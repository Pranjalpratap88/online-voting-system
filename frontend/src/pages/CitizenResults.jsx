import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Trophy, AlertCircle, Search, Activity, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

const statusMeta = {
  ACTIVE:   { label: 'Live',     color: '#05e777', bg: 'rgba(5,231,119,0.1)',   border: 'rgba(5,231,119,0.25)',   Icon: Activity },
  CLOSED:   { label: 'Closed',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  Icon: CheckCircle2 },
  UPCOMING: { label: 'Upcoming', color: '#3cd7ff', bg: 'rgba(60,215,255,0.1)',  border: 'rgba(60,215,255,0.25)', Icon: Clock },
};

const CitizenResults = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL | ACTIVE | CLOSED

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await api.get('/elections');
        setElections(response.data || []);
      } catch (error) {
        console.error('Failed to fetch elections', error);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#3cd7ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Loading Results...</p>
      </div>
    </div>
  );

  // Show ACTIVE (live) and CLOSED elections — results are available for both
  const withResults = elections.filter(e => e.status === 'ACTIVE' || e.status === 'CLOSED');

  const filtered = withResults
    .filter(e => filter === 'ALL' || e.status === filter)
    .filter(e => (e.title || '').toLowerCase().includes(search.toLowerCase()));

  const liveCount   = withResults.filter(e => e.status === 'ACTIVE').length;
  const closedCount = withResults.filter(e => e.status === 'CLOSED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <TrendingUp className="w-7 h-7 text-[#f59e0b]" />
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Election Results</h1>
          </div>
          <p className="text-on-surface-variant text-sm opacity-70">View live tallies and final outcomes</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#05e777]/10 border border-[#05e777]/25 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-[#05e777] animate-pulse" />
              <span className="text-xs font-black text-[#05e777] uppercase tracking-widest">{liveCount} Live</span>
            </div>
          )}
          {closedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/25 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="text-xs font-black text-[#f59e0b] uppercase tracking-widest">{closedCount} Final</span>
            </div>
          )}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <input
            type="text"
            placeholder="Search elections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-outline-variant/20 text-white pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#3cd7ff]/50 placeholder:text-on-surface-variant/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'CLOSED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-[#3cd7ff] text-[#003642]'
                  : 'bg-[#111827] border border-outline-variant/20 text-on-surface-variant/60 hover:text-white hover:border-outline-variant/40'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'ACTIVE' ? 'Live' : 'Final'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#111827] border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-4">
          <BarChart2 className="w-12 h-12 text-on-surface-variant/20" />
          <div>
            <p className="text-white font-bold mb-1">No results available</p>
            <p className="text-on-surface-variant/50 text-sm">
              {withResults.length === 0
                ? 'Results will appear once an election is active or closed.'
                : 'No elections match your search.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(election => {
            const meta = statusMeta[election.status] || statusMeta.CLOSED;
            const { Icon } = meta;
            return (
              <div
                key={election.id}
                className="group bg-[#111827] border border-outline-variant/15 rounded-2xl p-6 hover:border-outline-variant/35 transition-all duration-300 flex flex-col"
                style={{ '--hover-border': meta.border }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-[#0a0f1c] border border-outline-variant/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
                  >
                    {election.status === 'ACTIVE' && (
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: meta.color }} />
                    )}
                    {election.status !== 'ACTIVE' && <Icon className="w-3 h-3" />}
                    {meta.label}
                  </span>
                </div>

                {/* Title & description */}
                <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight leading-snug">{election.title}</h3>
                {election.description && (
                  <p className="text-sm text-on-surface-variant/60 line-clamp-2 mb-4 leading-relaxed">
                    {election.description}
                  </p>
                )}

                {/* Vote count if available */}
                {election.totalVotes !== undefined && (
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-3.5 h-3.5 text-on-surface-variant/40" />
                    <span className="text-xs text-on-surface-variant/50 font-medium">
                      {election.totalVotes} {election.totalVotes === 1 ? 'vote' : 'votes'} cast
                    </span>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/dashboard/results/${election.id}`)}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all border"
                    style={{
                      color: meta.color,
                      borderColor: meta.border,
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = meta.bg; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {election.status === 'ACTIVE' ? 'View Live Tally' : 'View Final Results'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CitizenResults;
