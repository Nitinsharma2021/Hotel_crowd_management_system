import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReservationForm from './pages/ReservationForm';
import AIAssistant from './pages/AIAssistant';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserve" element={<ReservationForm />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 