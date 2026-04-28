import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyOTP from '../pages/VerifyOTP';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import AdminPanel from '../pages/AdminPanel';
import AdminElections from '../pages/AdminElections';
import AdminElectionDetail from '../pages/AdminElectionDetail';
import AdminUsers from '../pages/AdminUsers';
import CreateElection from '../pages/CreateElection';
import AllElections from '../pages/AllElections';
import CastYourVote from '../pages/CastYourVote';
import ElectionResults from '../pages/ElectionResults';
import CitizenResults from '../pages/CitizenResults';
import Profile from '../pages/Profile';
import SetupPassword from '../pages/SetupPassword';
import InviteElection from '../pages/InviteElection';
import CandidateApplicationForm from '../pages/CandidateApplicationForm';
import PendingCandidates from '../pages/PendingCandidates';
import CitizenNomination from '../pages/CitizenNomination';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../store/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#060a16] flex items-center justify-center">
      <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Authenticating...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={
          <div className="min-h-screen bg-[#060a16] flex items-center justify-center text-white text-center p-12">
            <div>
              <p className="text-[#3cd7ff] text-xs font-bold uppercase tracking-widest mb-4">Access Denied</p>
              <h1 className="text-4xl font-black mb-4">Insufficient Clearance</h1>
              <p className="text-on-surface-variant mb-8">You do not have the required role to access this node.</p>
              <a href="/login" className="px-6 py-3 bg-[#3cd7ff] text-[#003642] font-bold rounded-xl text-sm">Return to Login</a>
            </div>
          </div>
        } />

        {/* User Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="elections" element={<AllElections />} />
          <Route path="elections/invite/:token" element={<InviteElection />} />
          <Route path="nominate" element={<CitizenNomination />} />
          <Route path="vote/:electionId" element={<CastYourVote />} />
          <Route path="results" element={<CitizenResults />} />
          <Route path="results/:electionId" element={<ElectionResults />} />
          <Route path="profile" element={<Profile />} />
          <Route path="setup-password" element={<SetupPassword />} />
        </Route>

        {/* Admin/Manager Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ELECTION_MANAGER']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPanel />} />
          <Route path="elections" element={<AdminElections />} />
          <Route path="elections/new" element={<CreateElection />} />
          <Route path="elections/:id" element={<AdminElectionDetail />} />
          <Route path="elections/:electionId/add-candidate" element={<CandidateApplicationForm />} />
          <Route path="candidates/pending" element={<PendingCandidates />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={
          <div className="min-h-screen bg-[#060a16] flex items-center justify-center text-white text-center p-12">
            <div>
              <p className="text-[#3cd7ff] text-xs font-bold uppercase tracking-widest mb-4">404</p>
              <h1 className="text-4xl font-black mb-4">Protocol Entry Not Found</h1>
              <a href="/" className="text-[#3cd7ff] underline text-sm">Return Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
