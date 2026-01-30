import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DefenseProvider } from './contexts/DefenseContext';
import Home from './pages/Home';
import UploadDefense from './pages/UploadDefense';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import Help from './pages/Help';
import EmailConfirmation from './pages/EmailConfirmation';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <DefenseProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            
            {/* Rotas com parâmetro opcional para o fluxo de passos */}
            <Route path="/upload" element={<UploadDefense />} />
            <Route path="/upload/:step" element={<UploadDefense />} />
            
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </DefenseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
