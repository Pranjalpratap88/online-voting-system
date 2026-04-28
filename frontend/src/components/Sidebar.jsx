import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, LineChart, LogOut, User, Settings, UserPlus, FileCheck } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';

const Sidebar = ({ role, className = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasUpcomingElections, setHasUpcomingElections] = useState(false);
  const [checkingElections, setCheckingElections] = useState(true);

  // Check for upcoming elections on mount (only for citizens)
  useEffect(() => {
    if (role !== 'ADMIN' && role !== 'ELECTION_MANAGER') {
      checkUpcomingElections();
    } else {
      setCheckingElections(false);
    }
  }, [role]);

  const checkUpcomingElections = async () => {
    try {
      const response = await api.get('/elections/upcoming');
      setHasUpcomingElections(response.data && response.data.length > 0);
    } catch (error) {
      console.error('Failed to check upcoming elections', error);
      setHasUpcomingElections(false);
    } finally {
      setCheckingElections(false);
    }
  };

  // Base user links (always visible)
  const baseUserLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Elections', path: '/dashboard/elections', icon: CheckSquare },
  ];

  // Conditional nomination link (only if upcoming elections exist)
  const nominationLink = { 
    name: 'Apply as Candidate', 
    path: '/dashboard/nominate', 
    icon: UserPlus,
    badge: 'NEW'
  };

  // Other user links
  const otherUserLinks = [
    { name: 'Results', path: '/dashboard/results', icon: LineChart },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
  ];

  // Build user links dynamically
  const userLinks = [
    ...baseUserLinks,
    ...(hasUpcomingElections ? [nominationLink] : []),
    ...otherUserLinks
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Elections', path: '/admin/elections', icon: CheckSquare },
    { name: 'Candidate Applications', path: '/admin/candidates/pending', icon: FileCheck },
    { name: 'Citizens', path: '/admin/users', icon: Users },
  ];

  const links = role === 'ADMIN' ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen flex flex-col bg-[#0a0f1c] border-r border-outline-variant/10 w-64 z-50 ${className}`}>
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-outline-variant/10">
        <Link to="/" className="block">
          <h1 className="text-[#3cd7ff] text-lg font-black tracking-wide leading-tight">
            Online Voting Portal
          </h1>
          <p className="text-[9px] tracking-widest font-bold text-on-surface-variant/40 mt-1 uppercase">
            Secure • Transparent • Verified
          </p>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-[#111827] border border-outline-variant/10">
          <div className="w-8 h-8 rounded-lg bg-[#3cd7ff]/15 border border-[#3cd7ff]/20 flex items-center justify-center shrink-0">
            <span className="text-[#3cd7ff] text-sm font-black">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">{user?.name || 'Citizen'}</p>
            <p className="text-on-surface-variant/40 text-[10px] font-medium truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
        <p className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest px-3 mb-2">
          {role === 'ADMIN' ? 'Administration' : 'Navigation'}
        </p>
        {links.map(link => {
          const isActive = link.exact
            ? location.pathname === link.path
            : location.pathname === link.path || location.pathname.startsWith(link.path + '/');
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all duration-200 relative group ${
                isActive 
                  ? 'text-[#3cd7ff] bg-[#3cd7ff]/10 border border-[#3cd7ff]/15' 
                  : 'text-on-surface-variant/60 hover:bg-[#111827] hover:text-white border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#3cd7ff] rounded-r-full shadow-[0_0_8px_#3cd7ff]" />
              )}
              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-semibold flex-1">{link.name}</span>
              {link.badge && (
                <span className="px-1.5 py-0.5 bg-[#05e777]/15 border border-[#05e777]/30 rounded text-[9px] font-black text-[#05e777] uppercase tracking-wider">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
        
        {/* Show message if no upcoming elections for citizens */}
        {role !== 'ADMIN' && role !== 'ELECTION_MANAGER' && !checkingElections && !hasUpcomingElections && (
          <div className="mt-2 mx-3 p-3 bg-[#111827] border border-outline-variant/10 rounded-xl">
            <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">
              Candidate Applications
            </p>
            <p className="text-[10px] text-on-surface-variant/60 leading-relaxed">
              No upcoming elections accepting nominations at this time.
            </p>
          </div>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-6 space-y-1 border-t border-outline-variant/10 pt-4">
        <Link
          to={role === 'ADMIN' ? '/dashboard' : '/dashboard/profile'}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant/50 hover:text-white hover:bg-[#111827] transition-all text-sm font-medium"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
