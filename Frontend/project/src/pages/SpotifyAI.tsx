import { motion } from 'framer-motion';
import { Music, Share2 } from 'lucide-react';

export function SpotifyAI() {
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

      <p className="text-gray-600">
        Create personalized music playlists using AI based on your preferences
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 space-y-6"
        >
          <h2 className="text-lg font-medium">Playlist Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Playlist Name</label>
              <input
                type="text"
                placeholder="Enter playlist name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Genres</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Select genres</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mood</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Select mood</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tempo</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Medium</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Allow Explicit Content</label>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Make Public</label>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1" />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-md font-medium text-sm"
            >
              <Music className="w-4 h-4 mr-2" />
              Generate Playlist
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-medium">Your Playlists</h2>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Evening Relaxation</h3>
                <p className="text-sm text-gray-500">Private • Created 2/20/2025</p>
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}