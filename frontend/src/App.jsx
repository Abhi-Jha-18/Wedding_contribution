import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public & Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicWedding from './pages/PublicWedding';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import WeddingProfile from './pages/WeddingProfile';
import Wishlist from './pages/Wishlist';
import Contributions from './pages/Contributions';
import QRCodePage from './pages/QRCodePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Pages with Main Layout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Pages (standalone with luxury split layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Wedding Invitation Page (Standalone with dedicated invitation header & footer) */}
      <Route path="/wedding/:slug" element={<PublicWedding />} />

      {/* Couple SaaS Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="wedding" element={<WeddingProfile />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="contributions" element={<Contributions />} />
        <Route path="qr-code" element={<QRCodePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
