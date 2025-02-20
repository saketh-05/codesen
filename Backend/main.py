from fastapi import FastAPI, HTTPException,UploadFile, Form
from pydantic import BaseModel
import os
import httpx
import pdfplumber
from io import BytesIO
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests

load_dotenv()
app = FastAPI()

# Spotify API credentials and user details (should be securely managed)
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "my_id")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "my_secret")
# In a real app, obtain a user access token via OAuth; here we assume it's stored safely
SPOTIFY_USER_ACCESS_TOKEN = os.getenv("SPOTIFY_USER_ACCESS_TOKEN", "user_access_token")
SPOTIFY_USER_ID = os.getenv("SPOTIFY_USER_ID", "user_id")
# Load API Key securely
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

class InterviewRequest(BaseModel):
    role: str = None
    question: str = None
    answer: str = None

# Supabase configuration (ensure these are set securely in your environment)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class PlaylistRequest(BaseModel):
    genre: str
    mood: str
    tempo: str

class PlaylistResponse(BaseModel):
    playlist_id: str
    track_id: str

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_playlist", response_model=PlaylistResponse)
async def generate_playlist(request: PlaylistRequest):
    # Map tempo to target BPM
    tempo_map = {
        "slow": 80,
        "medium": 110,
        "fast": 140
    }
    target_tempo = tempo_map.get(request.tempo.lower(), 110)
    
    # Get a recommended track from Spotify's recommendations endpoint
    rec_url = "https://api.spotify.com/v1/recommendations"
    params = {
        "seed_genres": request.genre,
        "target_tempo": target_tempo,
        "limit": 1
    }
    headers = {
        "Authorization": f"Bearer {SPOTIFY_USER_ACCESS_TOKEN}"
    }
    async with httpx.AsyncClient() as client:
        rec_resp = await client.get(rec_url, params=params, headers=headers)
    if rec_resp.status_code != 200:
        raise HTTPException(status_code=rec_resp.status_code, detail="Failed to get recommendations")
    rec_data = rec_resp.json()
    if not rec_data.get("tracks"):
        raise HTTPException(status_code=404, detail="No track found")
    track = rec_data["tracks"][0]
    track_id = track["id"]
    track_uri = track["uri"]

    # Create a new playlist for the user
    create_playlist_url = f"https://api.spotify.com/v1/users/{SPOTIFY_USER_ID}/playlists"
    playlist_payload = {
        "name": f"{request.genre.title()} {request.mood.title()} {request.tempo.title()} Playlist",
        "public": False,
        "description": f"Playlist generated based on {request.genre}, {request.mood}, {request.tempo}"
    }
    async with httpx.AsyncClient() as client:
        create_resp = await client.post(create_playlist_url, json=playlist_payload, headers=headers)
    if create_resp.status_code not in (200, 201):
        raise HTTPException(status_code=create_resp.status_code, detail="Failed to create playlist")
    playlist_data = create_resp.json()
    playlist_id = playlist_data["id"]

    # Add the recommended track to the newly created playlist
    add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    add_payload = { "uris": [track_uri] }
    async with httpx.AsyncClient() as client:
        add_resp = await client.post(add_tracks_url, json=add_payload, headers=headers)
    if add_resp.status_code not in (200, 201):
        raise HTTPException(status_code=add_resp.status_code, detail="Failed to add track to playlist")

    # Store the playlist details in Supabase for future reference
    data = {
        "playlist_id": playlist_id,
        "track_id": track_id,
        "genre": request.genre,
        "mood": request.mood,
        "tempo": request.tempo
    }
    supabase_resp = supabase.table("playlists").insert(data).execute()
    # (Optionally check supabase_resp for errors.)
    print(supabase_resp)
    
    return PlaylistResponse(playlist_id=playlist_id, track_id=track_id)

@app.post("/api/groq")
async def handle_groq_request(data: InterviewRequest):
    """Handles AI-powered question generation & answer evaluation."""
    try:
        if data.question and data.answer:
            prompt = f"Evaluate this answer: {data.answer} for the question: {data.question}"
        else:
            prompt = f"Generate an interview question for a {data.role}."

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 200,
        }

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }

        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response_data)

        content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response from Groq")

        return {"feedback": content} if data.question else {"question": content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Groq API: {str(e)}")


@app.post("/api/upload_pdf")
async def upload_pdf(file: UploadFile):
    """Extracts text from uploaded PDF and generates interview questions."""
    try:
        pdf_content = await file.read()
        text = ""

        with pdfplumber.open(BytesIO(pdf_content)) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n" if page.extract_text() else ""

        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no extractable text.")

        # Limit input to the Groq API to the first 1000 characters
        prompt = f"Generate an interview question based on the following document content:\n{text[:1000]}"

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 200,
        }

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }

        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response_data)
        question = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response from Groq")

        return {"question": question}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
