import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Subjects from './pages/Subjects';
import Game from './pages/Game';
import ScoreHistory from './pages/ScoreHistory';
import AiAnalysis from './pages/AiAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/mapel" element={<Subjects />} />
        <Route path="/mapel/ipa" element={<Game />} />
        <Route path="/score-history" element={<ScoreHistory />} />
        
        {/* Rute Analisis AI yang sudah dimasukkan ke dalam blok Routes */}
        <Route path="/analysis" element={<AiAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;