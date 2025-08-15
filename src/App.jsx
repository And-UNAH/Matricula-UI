
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PacPage from './pages/PacPage';
import AsignaturasPage from './pages/AsignaturasPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/pac" element={<ProtectedRoute><PacPage /></ProtectedRoute>} />
          <Route path="/asignaturas" element={<ProtectedRoute><AsignaturasPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
