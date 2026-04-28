import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, AlertCircle, Link2, ArrowRight, Loader } from 'lucide-react';

const InviteElection = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleInvite = async () => {
      try {
        const response = await api.get(`/elections/invite/${token}`);
        setElection(response.data);
        setSuccess(true);
        
        // Redirect to election after 3 seconds
        setTimeout(() => {
          navigate(`/dashboard/vote/${response.data.id}`);
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid or expired invite link');
      } finally {
        setLoading(false);
      }
    };

    handleInvite();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a16] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#3cd7ff] animate-spin mx-auto mb-4" />
          <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase">Verifying Invite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060a16] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-red-500/30 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Invalid Invite</h2>
          <p className="text-on-surface-variant opacity-80 mb-8">{error}</p>
          <button
            onClick={() => navigate('/dashboard/elections')}
            className="px-8 py-3.5 bg-[#3cd7ff] text-[#003642] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all text-sm"
          >
            View Available Elections
          </button>
        </div>
      </div>
    );
  }

  if (success && election) {
    return (
      <div className="min-h-screen bg-[#060a16] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-[#05e777]/30 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-[#05e777]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#05e777]/30">
            <CheckCircle2 className="w-10 h-10 text-[#05e777]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Access Granted</h2>
          <p className="text-on-surface-variant opacity-80 mb-2">
            You've been added to the eligible voters list for:
          </p>
          <p className="text-[#3cd7ff] font-bold text-lg mb-8">{election.title}</p>
          
          <div className="bg-[#0a0f1c] border border-outline-variant/20 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3 justify-center">
              <Link2 className="w-5 h-5 text-[#3cd7ff]" />
              <span className="text-sm text-on-surface-variant">Redirecting to ballot...</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/dashboard/vote/${election.id}`)}
            className="w-full px-8 py-3.5 bg-[#3cd7ff] text-[#003642] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all text-sm flex items-center justify-center gap-2"
          >
            Go to Election Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InviteElection;
