from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import httpx
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

# Spotify API credentials and user details (should be securely managed)
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "my_id")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "my_secret")
# In a real app, obtain a user access token via OAuth; here we assume it's stored safely
SPOTIFY_USER_ACCESS_TOKEN = os.getenv("SPOTIFY_USER_ACCESS_TOKEN", "user_access_token")
SPOTIFY_USER_ID = os.getenv("SPOTIFY_USER_ID", "user_id")

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
