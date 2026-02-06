// src/admin/layout/index.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './header';
import AdminSidebar from './sidebar';
import AdminFooter from './footer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Main Content with Router Outlet */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* React Router Outlet - Content from routes will render here */}
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;