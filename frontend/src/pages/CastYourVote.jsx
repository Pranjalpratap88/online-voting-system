import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, Vote, ChevronRight, AlertCircle, CheckCircle2, Lock, Zap } from 'lucide-react';

const CastYourVote = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionRes = await api.get(`/elections/${electionId}`);
        setElection(electionRes.data);
        setCandidates(electionRes.data.candidates || []);
        if (electionRes.data.hasVoted) setVoted(true);
      } catch (err) {
        setError('Failed to load election data. Ensure you are eligible for this election.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [electionId]);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setVoting(true);
    setError('');
    try {
      await api.post('/vote', { electionId, candidateId: selectedCandidate });
      setVoted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to securely cast vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Initializing Secure Booth...</p>
    </div>
  );

  if (voted) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#111827] rounded-3xl border border-[#05e777]/30 p-16 flex flex-col items-center text-center gap-6 shadow-[0_0_40px_rgba(5,231,119,0.05)]">
        <div className="w-24 h-24 bg-[#05e777]/10 rounded-full flex items-center justify-center border border-[#05e777]/30">
          <CheckCircle2 className="w-12 h-12 text-[#05e777]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-3">Ballot Committed</h2>
          <p className="text-on-surface-variant opacity-80 leading-relaxed max-w-sm">
            Your vote has been cryptographically sealed and committed to the MongoDB ledger. It cannot be altered.
          </p>
        </div>
        <div className="bg-[#05e777]/10 border border-[#05e777]/20 px-6 py-3 rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#05e777]" />
          <span className="text-sm font-bold text-[#05e777] tracking-wider uppercase">MongoDB Chain Anchored</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/elections')}
          className="mt-4 px-8 py-3.5 bg-[#0a0f1c] border border-outline-variant/30 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-sm flex items-center gap-2"
        >
          Return to Ballots <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-12 space-y-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#3cd7ff10] border border-[#3cd7ff20] rounded-xl">
            <Vote className="w-8 h-8 text-[#3cd7ff]" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Cryptographic Ballot</h1>
            {election && <p className="text-on-surface-variant text-sm mt-1 opacity-80">{election.title}</p>}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-[#111827] border border-[#3cd7ff]/20 rounded-2xl px-6 py-4 flex items-center gap-4">
          <Lock className="w-5 h-5 text-[#3cd7ff] flex-shrink-0" />
          <p className="text-sm text-on-surface-variant opacity-80">
            Your selection will be encrypted before being committed. <strong className="text-white">The system ensures "One Citizen, One Vote" via unique constraints.</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3 mt-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Candidates Grid */}
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.15em] opacity-60 mb-6">Select a Candidate</p>
        
        {candidates.length === 0 ? (
          <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-10 text-center">
            <p className="text-on-surface-variant opacity-60">No candidates registered for this election protocol.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map(candidate => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={`cursor-pointer relative group transition-all duration-300 ${
                  selectedCandidate === candidate.id ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                {/* Selected Checkmark */}
                {selectedCandidate === candidate.id && (
                  <div className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-[#05e777] rounded-full flex items-center justify-center border-2 border-[#05e777] shadow-[0_0_15px_rgba(5,231,119,0.5)]">
                    <CheckCircle2 className="w-5 h-5 text-[#003642]" />
                  </div>
                )}

                {/* Card */}
                <div className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center h-full ${
                  selectedCandidate === candidate.id
                    ? 'border-[#05e777] bg-gradient-to-b from-[#05e777]/10 to-[#05e777]/5 shadow-[0_0_30px_rgba(5,231,119,0.2)]'
                    : 'border-[#3cd7ff]/30 bg-[#111827] hover:border-[#3cd7ff]/60 shadow-[0_0_20px_rgba(60,215,255,0.05)]'
                }`}
                >
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center font-black text-2xl mb-4 transition-all ${
                    selectedCandidate === candidate.id 
                      ? 'border-[#05e777] text-[#05e777] bg-[#05e777]/20' 
                      : 'border-[#3cd7ff] text-[#3cd7ff] bg-[#3cd7ff]/10'
                  }`}>
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-black text-white tracking-tight mb-1 uppercase">
                    {candidate.name}
                  </h3>

                  {/* Party */}
                  {candidate.party && (
                    <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest mb-3">
                      {candidate.party}
                    </p>
                  )}

                  {/* Description */}
                  {candidate.description && (
                    <p className="text-xs text-on-surface-variant/60 italic leading-relaxed">
                      "{candidate.description}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Message */}
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          THE FUTURE IS<br />IN YOUR HANDS
        </h2>
        <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest">
          SECURE IMMUTABLE BALLOT ID: #SL-2024-001 • SECURITY • TERMS • PRIVACY • AES-256-GCM ACTIVE
        </p>
      </div>

      {/* Action Buttons */}
      <div className="max-w-5xl mx-auto flex gap-4 pt-8">
        <button
          onClick={() => navigate('/dashboard/elections')}
          className="px-8 py-4 rounded-xl font-bold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-wider"
        >
          Cancel
        </button>
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || voting}
          className="flex-1 bg-[#3cd7ff] text-[#003642] py-4 rounded-xl font-black text-base hover:shadow-[0_0_25px_rgba(60,215,255,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Zap className="w-5 h-5" />
          {voting ? 'Processing Transaction...' : 'Submit Choice'}
        </button>
      </div>
    </div>
  );
};

export default CastYourVote;
