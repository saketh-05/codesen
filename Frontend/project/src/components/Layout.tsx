import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Brain, Music, PencilRuler, ListTodo, Home as HomeIcon } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/ai-interviewer', icon: Brain, label: 'AI Interviewer' },
  { to: '/spotify-ai', icon: Music, label: 'Spotify AI' },
  { to: '/whiteboard', icon: PencilRuler, label: 'Whiteboard' },
  { to: '/todo', icon: ListTodo, label: 'Todo List' }
];

export function Layout({ children }: { children: React.ReactNode }) {
const location = useLocation();
  const isLogin = location.pathname === '/' ? true : false;
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-2 text-sm font-medium transition-colors',
                      isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                    )
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {!isLogin && <a href='/login' className="text-red-600 text-sm font-medium">Login</a>}
              {isLogin && <a href='/login' className="text-red-600 text-sm font-medium">Logout</a>}
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}