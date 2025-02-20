import { motion } from 'framer-motion';
import { Brain, Music, PencilRuler, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const features = [
  {
    icon: Brain,
    title: 'AI Interview Practice',
    description: 'Practice your interview skills with our AI-powered interviewer.',
    to: '/ai-interviewer',
    color: 'bg-blue-500'
  },
  {
    icon: Music,
    title: 'AI Playlist Generator',
    description: 'Create personalized playlists using AI based on your preferences.',
    to: '/spotify-ai',
    color: 'bg-green-500'
  },
  {
    icon: PencilRuler,
    title: 'Whiteboard',
    description: 'Collaborate and brainstorm ideas with our digital whiteboard.',
    to: '/whiteboard',
    color: 'bg-purple-500'
  },
  {
    icon: ListTodo,
    title: 'Task Manager',
    description: 'Stay organized with our intuitive task management system.',
    to: '/todo',
    color: 'bg-red-500'
  }
];

export function Home() {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold">Welcome to AI Tools Platform</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our suite of AI-powered tools designed to enhance your productivity and learning experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={feature.to}
              className="block group h-full"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={cn('p-3 rounded-lg', feature.color)}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}