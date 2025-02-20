import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AIInterviewer } from './pages/AIInterviewer';
import { SpotifyAI } from './pages/SpotifyAI';
import { Whiteboard } from './pages/Whiteboard';
import { TodoList } from './pages/TodoList';
import { Home } from './pages/Home';
import { Login} from './pages/login';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ai-interviewer" element={<AIInterviewer />} />
          <Route path="/spotify-ai" element={<SpotifyAI />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
          <Route path="/todo" element={<TodoList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;