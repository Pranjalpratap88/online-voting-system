import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User as UserIcon, LogOut, BadgeCheck, Settings, ChevronRight, ArrowLeft } from 'lucide-react';

// ─── Route metadata ────────────────────────────────────────────────────────────
// parent: null  → true root page, NO back button (Dashboard / Admin home only)
// parent: path  → show back button, navigate to that path
const routeMeta = {
  // ── Citizen true roots (no back button) ──────────────────────────────────────
  '/dashboard': { title: 'Dashboard', parent: null },

  // ── Citizen section roots (back → Dashboard) ─────────────────────────────────
  '/dashboard/elections':      { title: 'Elections',          parent: '/dashboard' },
  '/dashboard/results':        { title: 'Results',            parent: '/dashboard' },
  '/dashboard/profile':        { title: 'My Profile',         parent: '/dashboard' },
  '/dashboard/nominate':       { title: 'Apply as Candidate', parent: '/dashboard' },
  '/dashboard/setup-password': { title: 'Setup Password',     parent: '/dashboard' },

  // ── Admin true root (no back button) ─────────────────────────────────────────
  '/admin': { title: 'Dashboard', parent: null },

  // ── Admin section roots (back → Admin Dashboard) ─────────────────────────────
  '/admin/elections':          { title: 'Manage Elections',        parent: '/admin' },
  '/admin/users':              { title: 'Manage Citizens',         parent: '/admin' },
  '/admin/candidates/pending': { title: 'Candidate Applications',  parent: '/admin' },

  // ── Admin sub-pages (back → their section) ───────────────────────────────────
  '/admin/elections/new': { title: 'Create Election', parent: '/admin/elections' },
};

// Resolve dynamic routes (with URL params) to their meta
const resolveMeta = (pathname) => {
  // Exact match first
  if (routeMeta[pathname]) return routeMeta[pathname];

  // /dashboard/vote/:electionId  → back to Elections
  if (/^\/dashboard\/vote\/[^/]+$/.test(pathname))
    return { title: 'Cast Your Vote', parent: '/dashboard/elections' };

  // /dashboard/results/:electionId  → back to Results list
  if (/^\/dashboard\/results\/[^/]+$/.test(pathname))
    return { title: 'Election Results', parent: '/dashboard/results' };

  // /dashboard/elections/invite/:token  → back to Elections
  if (/^\/dashboard\/elections\/invite\/[^/]+$/.test(pathname))
    return { title: 'Invite Election', parent: '/dashboard/elections' };

  // /admin/elections/:id/add-candidate  → back to that election detail
  if (/^\/admin\/elections\/[^/]+\/add-candidate$/.test(pathname)) {
    const electionId = pathname.split('/')[3];
    return { title: 'Add Candidate', parent: `/admin/elections/${electionId}` };
  }

  // /admin/elections/:id  (not /new, not /add-candidate)  → back to Elections list
  if (/^\/admin\/elections\/[^/]+$/.test(pathname))
    return { title: 'Election Details', parent: '/admin/elections' };

  // Fallback — show back button to the section root
  if (pathname.startsWith('/admin'))
    return { title: 'Admin Panel', parent: '/admin' };

  return { title: 'Portal', parent: '/dashboard' };
};

// ─── Component ─────────────────────────────────────────────────────────────────
const Navbar = ({ isAdmin }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const meta = resolveMeta(location.pathname);
  const canGoBack = meta.parent !== null;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBack = () => navigate(meta.parent);
  const handleLogout = () => { logout(); navigate('/login'); };

  const notifications = [
    { id: 1, text: 'New election available for your constituency.', time: 'Just now', unread: true },
    { id: 2, text: 'Your vote has been recorded successfully.',      time: '2h ago',  unread: true },
    { id: 3, text: 'Election results are now published.',            time: '1d ago',  unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="flex justify-between items-center w-full pb-6 border-b border-outline-variant/10 mb-2 relative z-[60]">

      {/* ── Left: back button + breadcrumb + title ── */}
      <div className="flex items-center gap-3">
        {canGoBack ? (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#111827] border border-outline-variant/20 text-on-surface-variant/60 hover:text-[#3cd7ff] hover:border-[#3cd7ff]/40 hover:bg-[#3cd7ff]/5 transition-all active:scale-95 shrink-0"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          /* Placeholder keeps title aligned on root pages */
          <div className="w-9 h-9 shrink-0" />
        )}

        <div>
          <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest mb-0.5">
            {isAdmin ? 'Administration' : 'Citizen Portal'}
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white leading-none">{meta.title}</h2>
        </div>
      </div>

      {/* ── Right: notifications + profile ── */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
            className={`p-2.5 rounded-xl border transition-all relative ${
              showNotifications
                ? 'bg-[#3cd7ff]/10 border-[#3cd7ff]/30 text-[#3cd7ff]'
                : 'bg-[#111827] border-outline-variant/15 text-on-surface-variant/60 hover:text-white hover:border-outline-variant/30'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border border-[#060a16]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#111827] border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-white">Notifications</span>
                <span className="text-[10px] text-[#3cd7ff] font-bold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-[#3cd7ff]/[0.03]' : ''}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-[#3cd7ff]' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm text-white/85 leading-snug">{n.text}</p>
                      <span className="text-[10px] text-on-surface-variant/40 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${
              showProfile
                ? 'bg-[#3cd7ff]/10 border-[#3cd7ff]/30'
                : 'bg-[#111827] border-outline-variant/15 hover:border-outline-variant/30'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#3cd7ff]/15 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] text-xs font-black shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-bold text-white leading-none">{user?.name?.split(' ')[0] || 'Citizen'}</span>
              <span className="text-[9px] font-bold text-[#3cd7ff]/70 uppercase tracking-wider">{user?.role || 'User'}</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-[#111827] border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-4 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3cd7ff]/15 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] font-black">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-on-surface-variant/50 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#05e777]">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span className="font-bold">Verified Identity</span>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => { navigate('/dashboard/profile'); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-on-surface-variant/70 hover:text-white transition-all text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4" /> My Profile
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                </button>
                <button
                  onClick={() => { navigate('/dashboard/setup-password'); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-on-surface-variant/70 hover:text-white transition-all text-sm font-medium"
                >
                  <Settings className="w-4 h-4" /> Account Settings
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                </button>
              </div>

              <div className="p-2 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/[0.08] hover:bg-red-500/15 text-red-400 transition-all text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
