import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './pages/Home.jsx';
import Newgame from './pages/Newgame.jsx';
import BackOffice from './pages/BackOffice.jsx';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newgame" element={<Newgame />} />
        <Route path="/popular" element={<NotFound />} />
        <Route path="/promotion" element={<NotFound />} />
        <Route path="/free" element={<NotFound />} />
        <Route path="/contact" element={<NotFound />} />
        <Route path="/backoffice" element={<BackOffice />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;