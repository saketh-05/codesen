import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "https://i.imgur.com/DNMwy5q.jpeg" // Placeholder image
  });

  const handleLogout = () => {
    // Clear user session logic here (e.g., removing tokens)
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center"
      >
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-gray-300"
        />
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <table className="w-full border border-gray-300 text-left">
          <tbody>
            <tr>
              <td className="p-3 border-b font-semibold">Name:</td>
              <td className="p-3 border-b">{user.name}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Email:</td>
              <td className="p-3">{user.email}</td>
            </tr>
          </tbody>
        </table>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
