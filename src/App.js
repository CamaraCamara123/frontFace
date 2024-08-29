import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomePage from './components/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route lands on the LoginForm */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginForm />} />

        {/* Register route */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Welcome route */}
        <Route path="/welcome/:username" element={<WelcomePage />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
