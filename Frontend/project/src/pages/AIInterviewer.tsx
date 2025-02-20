import { motion } from 'framer-motion';
import { User, Play, Star } from 'lucide-react';
import { cn } from '../utils/cn';

const topics = ['Behavioral Interview', 'Machine Learning', 'Natural Language Processing', 'Data Science'];
const difficulties = ['Easy', 'Intermediate', 'Hard', 'Very Hard'];

export function AIInterviewer() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <User className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">AI Interview Practice</h1>
      </motion.div>

      <p className="text-gray-600">
        Practice your interview skills with our AI interviewer. Select your preferred topic and difficulty level to get started.
      </p>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Topic:</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Choose a topic...</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Difficulty:</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Choose difficulty...</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md font-medium text-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Interview
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Previous Sessions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, index) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-4 space-y-2"
            >
              <h3 className="font-medium">{topic}</h3>
              <p className="text-sm text-gray-500">Difficulty: {difficulties[index % difficulties.length]}</p>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}