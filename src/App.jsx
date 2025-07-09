import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuilderPage from './pages/BuilderPage.jsx';
import PublicProfile from './pages/PublicProfile.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuilderPage />} />
        <Route path=":username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
