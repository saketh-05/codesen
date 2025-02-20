import { motion } from 'framer-motion';
import { Music} from 'lucide-react';
import { useState } from 'react';

export function SpotifyAI() {
  const [genre, setGenre] = useState('pop');
  const [mood, setMood] = useState('happy');
  const [tempo, setTempo] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState("");

  const generatePlaylist = async () => {
    setLoading(true);
    setError("");
    setPlaylistData(null);
    try {
      const res = await fetch('https://your-fastapi-url.com/generate_playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ genre, mood, tempo })
      });
      const data = await res.json();
      if (res.ok) {
        setPlaylistData(data);
      } else {
        setError(data.detail || 'Error generating playlist');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <Music className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">AI Playlist Generator</h1>
      </motion.div>
      <p className="text-gray-600">Input your preferences to generate a playlist</p>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hip-hop">Hip-Hop</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="energetic">Energetic</option>
            <option value="calm">Calm</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempo</label>
          <select
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generatePlaylist}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-md font-medium text-sm"
        >
          <Music className="w-4 h-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Playlist'}
        </motion.button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      {playlistData && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium">Playlist Created!</h2>
          <p className="text-sm text-gray-600">Playlist ID: {playlistData.playlist_id}</p>
          {playlistData.track_id && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Your Song:</h3>
              <iframe
                src={`https://open.spotify.com/embed/track/${playlistData.track_id}`}
                width="300"
                height="80"
                allowTransparency={true}
                allow="encrypted-media"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
