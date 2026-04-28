import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.needsPasswordSetup && location.pathname !== '/dashboard/setup-password') {
      navigate('/dashboard/setup-password');
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="flex min-h-screen bg-[#060a16] text-white font-body relative overflow-hidden">
      {/* Subtle Dot Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '48px 48px' 
        }}
      ></div>

      <Sidebar role="USER" className="z-20" />
      <div className="flex-1 ml-64 flex flex-col z-10 relative">
        <main className="flex-1 p-8 lg:p-10 flex flex-col gap-10">
          <Navbar isAdmin={false} />
          {/* key={location.key} forces remount on every navigation — fixes stale page state */}
          <Outlet key={location.key} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
