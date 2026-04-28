import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#060a16] text-white font-body relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }}
      />

      <Sidebar role="ADMIN" />
      <div className="flex-1 ml-64 z-10 relative flex flex-col">
        <main className="p-8 lg:p-10 min-h-screen flex flex-col gap-6">
          <Navbar isAdmin={true} />
          {/* key={location.key} forces remount on every navigation — fixes stale page state */}
          <Outlet key={location.key} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
