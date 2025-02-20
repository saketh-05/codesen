import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const API_URL = 'http://127.0.0.1:8000/tasks/';

export function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', due_date: '', status: 'Not Started' });

  // Fetch tasks from FastAPI backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, { method: 'GET' });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.due_date) return alert("Title and Due Date are required!");
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    setNewTask({ title: '', description: '', priority: 'Medium', due_date: '', status: 'Not Started' });
    fetchTasks(); // Refresh task list after adding a new task
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    await fetch(`${API_URL}${id}`, { method: 'DELETE' });
    fetchTasks(); // Refresh task list after deleting a task
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-3">
          <ListTodo className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Task Manager</h1>
        </motion.div>

        {/* Add Task Button */}
        <motion.button
          onClick={handleAddTask}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </motion.button>
      </div>

      {/* Task Input Form */}
      <div className="flex space-x-4">
        <input name="title" placeholder="Title" value={newTask.title} onChange={handleInputChange} className="border p-2 rounded w-1/4" />
        <input name="description" placeholder="Description" value={newTask.description} onChange={handleInputChange} className="border p-2 rounded w-1/4" />
        <select name="priority" value={newTask.priority} onChange={handleInputChange} className="border p-2 rounded">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <input type="date" name="due_date" value={newTask.due_date} onChange={handleInputChange} className="border p-2 rounded" />
        <select name="status" value={newTask.status} onChange={handleInputChange} className="border p-2 rounded">
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading tasks...</td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <motion.tr key={task._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      task.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    )}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(task.due_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      task.status === 'Not Started' ? 'bg-gray-100 text-gray-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    )}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteTask(task._id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}