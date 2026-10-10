import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreateTournament from './pages/CreateTournament';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear-torneo" element={<CreateTournament />} />
      </Routes>
    </Router>
  );
}

export default App;
