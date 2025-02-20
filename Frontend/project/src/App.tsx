import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import  AIInterviewAgent  from './pages/Aiinterviewer';
import { SpotifyAI } from './pages/SpotifyAI';
import { Whiteboard } from './pages/Whiteboard';
import { TodoList } from './pages/TodoList';
import { Home } from './pages/Home';
import { Login} from './pages/login';
import { Register} from './pages/register';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ai-interviewer" element={<AIInterviewAgent />} />
          <Route path="/spotify-ai" element={<SpotifyAI />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          {/* <Route path='/register' element={<Register />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;