import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle, Calendar, Activity } from 'lucide-react';

const AllElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await api.get('/elections');
        setElections(response.data);
      } catch (error) {
        console.error("Failed to fetch elections", error);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Synchronizing with Ledger...</p>
    </div>
  );

  const filteredElections = elections.filter(e => 
    (e.title?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) || 
    (e.description?.toLowerCase() || '').includes((searchTerm || '').toLowerCase())
  );

  const active = filteredElections.filter(e => e.status === 'ACTIVE');
  const completed = filteredElections.filter(e => e.status !== 'ACTIVE');

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#111827] border border-outline-variant/10 rounded-2xl">
            <CheckSquare className="w-8 h-8 text-[#3cd7ff]" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Election Registry</h1>
            <p className="text-on-surface-variant text-sm mt-1 opacity-80">
              {active.length} active protocol{active.length !== 1 ? 's' : ''} available for submission
            </p>
          </div>
        </div>

        <div className="relative w-full lg:w-96">
          <input 
            type="text" 
            placeholder="Search ballots or protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-outline-variant/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#3cd7ff]/50 transition-all font-medium text-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[10px] font-black text-on-surface-variant/40 bg-white/5 px-2 py-1 rounded-md uppercase tracking-widest hidden sm:block">CTRL+K</span>
          </div>
        </div>
      </div>

      {/* Active Elections */}
      {active.length === 0 ? (
        <div className="bg-[#111827] rounded-3xl border border-outline-variant/20 p-16 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-on-surface-variant/20" />
          <p className="text-on-surface-variant opacity-60 tracking-wide">No active ledger protocols at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {active.map((election) => (
            <div key={election.id} className="group bg-[#111827] rounded-3xl border border-outline-variant/20 p-8 flex flex-col gap-6 hover:border-[#3cd7ff]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(60,215,255,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3cd7ff]/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

              <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-[#0a0f1c] border border-outline-variant/30 rounded-xl">
                  <Activity className="w-5 h-5 text-[#3cd7ff]" />
                </div>
                {election.hasVoted ? (
                  <div className="flex items-center gap-1.5 bg-[#05e777]/10 border border-[#05e777]/20 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#05e777]" />
                    <span className="text-[10px] font-black text-[#05e777] uppercase tracking-[0.15em]">Voted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#05e777] animate-pulse shadow-[0_0_8px_#05e777]"></div>
                    <span className="text-[10px] font-bold text-[#05e777] uppercase tracking-[0.15em]">LIVE</span>
                  </div>
                )}
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{election.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 line-clamp-2">{election.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-[#0a0f1c] rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant/50" />
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Opens</span>
                  </div>
                  <span className="text-xs text-white font-medium">{new Date(election.startTime).toLocaleDateString()}</span>
                </div>
                <div className="bg-[#0a0f1c] rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-on-surface-variant/50" />
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Closes</span>
                  </div>
                  <span className="text-xs text-white font-medium">{new Date(election.endTime).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="relative z-10 mt-auto border-t border-outline-variant/10 pt-6">
                {election.hasVoted ? (
                  <button disabled className="w-full py-3.5 rounded-xl font-bold text-sm text-on-surface-variant border border-outline-variant/20 opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#05e777]" /> Ballot Submitted
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/dashboard/vote/${election.id}`)}
                    className="w-full py-3.5 bg-[#3cd7ff] text-[#003642] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] active:scale-[0.98] transition-all text-sm tracking-wide flex items-center justify-center gap-2"
                  >
                    Cast Your Vote <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Elections */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Closed Protocols</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completed.map((election) => (
              <div key={election.id} className="bg-[#111827] rounded-2xl border border-outline-variant/10 p-6 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                <div>
                  <h3 className="font-bold text-white">{election.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">{election.status}</span>
                </div>
                {election.status === 'COMPLETED' && (
                  <button
                    onClick={() => navigate(`/dashboard/results/${election.id}`)}
                    className="text-[#3cd7ff] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Results <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllElections;
