import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import { 
  ShieldCheck, Activity, LayoutGrid, CheckCircle2, 
  Clock, Vote, TrendingUp, AlertCircle, ChevronRight,
  Calendar, Users, BarChart3, Zap, Bell, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Countdown timer component
const Countdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 24) {
        const d = Math.floor(h / 24);
        setTimeLeft(`${d}d ${h % 24}h left`);
      } else {
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return <span>{timeLeft}</span>;
};

const StatCard = ({ icon: Icon, label, value, sub, color = '#3cd7ff', trend }) => (
  <div className="bg-[#111827] rounded-2xl border border-outline-variant/15 p-6 flex flex-col gap-3 hover:border-outline-variant/30 transition-all">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-[#05e777]/10 text-[#05e777]' : 'bg-red-500/10 text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-0.5">{label}</p>
      {sub && <p className="text-xs text-on-surface-variant/40 mt-1">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/elections');
        setElections(response.data);
      } catch (error) {
        console.error("Failed to fetch elections", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#3cd7ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#3cd7ff] text-xs font-bold tracking-[0.3em] uppercase animate-pulse">Loading Dashboard...</p>
      </div>
    </div>
  );

  const activeElections = elections.filter(e => e.status === 'ACTIVE');
  const votedElections = elections.filter(e => e.hasVoted);
  const pendingVotes = activeElections.filter(e => !e.hasVoted);
  const upcomingElections = elections.filter(e => e.status === 'UPCOMING');
  const hasUpcomingElections = upcomingElections.length > 0;

  return (
    <div className="space-y-8 pb-12">

      {/* Password setup nudge */}
      {user?.needsPasswordSetup && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Set up your password</p>
              <p className="text-xs text-on-surface-variant/60">Enable quick sign-in with a password for future logins.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/setup-password')}
            className="shrink-0 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold text-xs rounded-xl hover:bg-yellow-500/30 transition-all"
          >
            Set Password
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative p-8 lg:p-10 rounded-3xl bg-[#111827] border border-outline-variant/15 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3cd7ff]/8 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-[#05e777]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-[#05e777]/10 border border-[#05e777]/20 rounded-full text-[10px] font-black text-[#05e777] uppercase tracking-widest">
                Verified Citizen
              </span>
              {pendingVotes.length > 0 && (
                <span className="px-2.5 py-1 bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 rounded-full text-[10px] font-black text-[#3cd7ff] uppercase tracking-widest flex items-center gap-1">
                  <Bell className="w-3 h-3" /> {pendingVotes.length} Pending
                </span>
              )}
              {hasUpcomingElections && (
                <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Nominations Open
                </span>
              )}
            </div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-2">
              Welcome back, <span className="text-[#3cd7ff]">{user?.name?.split(' ')[0] || 'Citizen'}</span>
            </h2>
            <p className="text-on-surface-variant/70 text-base max-w-lg">
              {pendingVotes.length > 0
                ? `You have ${pendingVotes.length} active election${pendingVotes.length > 1 ? 's' : ''} waiting for your vote.`
                : hasUpcomingElections
                ? `${upcomingElections.length} upcoming election${upcomingElections.length > 1 ? 's are' : ' is'} accepting candidate nominations.`
                : 'You\'re all caught up. No pending votes at this time.'}
            </p>
          </div>
          <div className="flex gap-3 shrink-0 flex-wrap">
            {hasUpcomingElections && (
              <button
                onClick={() => navigate('/dashboard/nominate')}
                className="px-6 py-3 bg-gradient-to-r from-[#05e777] to-[#04c766] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(5,231,119,0.4)] transition-all text-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Apply as Candidate
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard/elections')}
              className="px-6 py-3 bg-[#3cd7ff] text-[#003642] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all text-sm flex items-center gap-2"
            >
              <Vote className="w-4 h-4" /> View Elections
            </button>
            <button
              onClick={() => navigate('/dashboard/results')}
              className="px-6 py-3 bg-[#0a0f1c] border border-outline-variant/25 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-sm flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-[#05e777]" /> Results
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Vote} label="Votes Cast" value={votedElections.length} sub="Total participation" color="#3cd7ff" />
        <StatCard icon={Zap} label="Active Elections" value={activeElections.length} sub="Open for voting" color="#05e777" />
        <StatCard icon={Clock} label="Pending Votes" value={pendingVotes.length} sub="Awaiting your vote" color={pendingVotes.length > 0 ? '#f59e0b' : '#3cd7ff'} />
        <StatCard icon={Calendar} label="Upcoming" value={upcomingElections.length} sub="Starting soon" color="#a78bfa" />
      </div>

      {/* Active Ballots */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3cd7ff]/10 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-[#3cd7ff]" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">Active Ballots</h3>
            {pendingVotes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#3cd7ff] text-[#003642] text-[10px] font-black flex items-center justify-center">
                {pendingVotes.length}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/dashboard/elections')}
            className="text-xs font-bold text-[#3cd7ff] hover:text-white transition-colors flex items-center gap-1"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pendingVotes.length === 0 ? (
            <div className="lg:col-span-3 p-16 rounded-2xl bg-[#111827] border border-outline-variant/10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#05e777]/10 border border-[#05e777]/15 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#05e777] opacity-60" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">All caught up!</h4>
                <p className="text-on-surface-variant/50 text-sm max-w-xs mx-auto">
                  No pending elections require your vote right now.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard/results')}
                className="px-5 py-2.5 bg-[#0a0f1c] border border-outline-variant/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-sm flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-[#3cd7ff]" /> View Past Results
              </button>
            </div>
          ) : (
            pendingVotes.map((election) => (
              <div
                key={election.id}
                className="group p-6 rounded-2xl bg-[#111827] hover:bg-[#141d2e] transition-all duration-300 flex flex-col gap-5 relative overflow-hidden border border-outline-variant/15 hover:border-[#3cd7ff]/20 shadow-lg"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#3cd7ff]/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-[#3cd7ff]/10 transition-all pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#0a0f1c] border border-outline-variant/20 rounded-xl group-hover:border-[#3cd7ff]/25 transition-all">
                    <ShieldCheck className="w-5 h-5 text-[#3cd7ff]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#05e777]/8 px-2.5 py-1 rounded-full border border-[#05e777]/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#05e777] animate-pulse" />
                    <span className="text-[10px] font-black text-[#05e777] tracking-widest uppercase">Live</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white mb-2 leading-tight group-hover:text-[#3cd7ff] transition-colors line-clamp-2">
                    {election.title}
                  </h4>
                  <p className="text-on-surface-variant/60 text-sm line-clamp-2 leading-relaxed">
                    {election.description}
                  </p>
                </div>

                {election.endDate && (
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant/50">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">
                      <Countdown endDate={election.endDate} />
                    </span>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant/40 font-medium">Your vote matters</span>
                  <button 
                    onClick={() => navigate(`/dashboard/vote/${election.id}`)}
                    className="bg-[#3cd7ff] text-[#003642] font-black px-5 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(60,215,255,0.35)] active:scale-[0.96] transition-all text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    Vote Now <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recently Voted */}
      {votedElections.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#05e777]/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#05e777]" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">Your Votes</h3>
            </div>
            <button
              onClick={() => navigate('/dashboard/results')}
              className="text-xs font-bold text-[#3cd7ff] hover:text-white transition-colors flex items-center gap-1"
            >
              View results <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {votedElections.slice(0, 3).map(election => (
              <div
                key={election.id}
                className="p-5 rounded-2xl bg-[#111827] border border-outline-variant/10 flex items-center gap-4 hover:border-[#05e777]/20 transition-all cursor-pointer group"
                onClick={() => navigate(`/dashboard/results/${election.id}`)}
              >
                <div className="w-10 h-10 rounded-xl bg-[#05e777]/10 border border-[#05e777]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#05e777]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-[#05e777] transition-colors">{election.title}</p>
                  <p className="text-xs text-on-surface-variant/50 mt-0.5">Vote submitted</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-[#05e777] transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
