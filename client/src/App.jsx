import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import UploadDefense from './pages/UploadDefense';
import ManualDefense from './pages/ManualDefense';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/upload" element={<UploadDefense />} />
          <Route path="/manual-defense" element={<ManualDefense />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
