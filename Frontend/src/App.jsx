// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Landing Page & Auth
import LandingPage from './pages/landing/index'; // Tambahkan ini
import Login from "./pages/login";
import Register from "./pages/register";

// Import Layout & Admin Components
import AdminLayout from './admin/layout/index';
import Dashboard from './admin/dashboard/index';
import ProtectedRoute from './admin/components/ProtectedRoute';

// Import CRUD (Packages, Destinations, Customers)
import PackageIndex from './admin/packages/index';
import PackageCreate from './admin/packages/create';
import PackageUpdate from './admin/packages/update';
import DestinationIndex from './admin/destinations/index';
import DestinationCreate from './admin/destinations/create';
import DestinationUpdate from './admin/destinations/update';
import CustomerIndex from './admin/customers/index';
import CustomerCreate from './admin/customers/create';
import CustomerUpdate from './admin/customers/update';

//sisi customer
import UserPackageIndex from './pages/packages/index';
import UserPackageDetail from './pages/packages/detail';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTE PUBLIK --- */}
        {/* Sekarang rute utama adalah Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages" element={<UserPackageIndex />} />
        <Route path="/packages/:id" element={<UserPackageDetail />}/>

          {/* --- RUTE ADMIN (PROTECTED) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="packages" element={<PackageIndex />} />
            <Route path="packages/create" element={<PackageCreate />} />
            <Route path="packages/update/:id" element={<PackageUpdate />} />

            <Route path="destinations" element={<DestinationIndex />} />
            <Route path="destinations/create" element={<DestinationCreate />} />
            <Route path="destinations/update/:id" element={<DestinationUpdate />} />

            <Route path="customers" element={<CustomerIndex />} />
            <Route path="customers/create" element={<CustomerCreate />} />
            <Route path="customers/update/:id" element={<CustomerUpdate />} />
          </Route>
        </Route>

        {/* 404 & Fallback */}
        <Route path="*" element={<div className="p-10 text-center"><h1>404 - Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;