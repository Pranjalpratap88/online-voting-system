import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Trophy, BarChart2, Users, Award, Shield, TrendingUp } from 'lucide-react';

const ElectionResults = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Correct endpoint: /api/results/{electionId}
        const response = await api.get(`/results/${electionId}`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch election results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [electionId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#3cd7ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Loading Results...</p>
      </div>
    </div>
  );

  const results = data?.results || [];
  const maxVotes = results.length > 0 ? Math.max(...results.map(r => r.voteCount), 1) : 1;
  const winner = results[0];

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Error */}
      {error && (
        <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3">
          <Shield className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* No data yet */}
      {!error && !loading && results.length === 0 && (
        <div className="p-16 bg-[#111827] border border-outline-variant/20 rounded-3xl flex flex-col items-center text-center gap-4">
          <BarChart2 className="w-12 h-12 text-on-surface-variant/30" />
          <p className="text-on-surface-variant opacity-60">No votes have been cast in this election yet.</p>
        </div>
      )}

      {data && results.length > 0 && (
        <>
          {/* Winner Banner */}
          <div className="relative bg-[#111827] border border-[#f59e0b]/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl">
              <Trophy className="w-12 h-12 text-[#f59e0b]" />
            </div>
            <div className="relative z-10 text-center sm:text-left">
              <p className="text-xs font-black text-[#f59e0b]/70 uppercase tracking-widest mb-1">
                {data.totalVotes > 0 ? 'Leading Candidate' : 'No Votes Yet'}
              </p>
              <h2 className="text-3xl font-black text-white tracking-tight">{winner.candidateName}</h2>
              {winner.party && (
                <p className="text-on-surface-variant/60 text-sm font-medium mt-0.5">{winner.party}</p>
              )}
              <p className="text-[#f59e0b] font-bold mt-2 tracking-wide">
                {winner.voteCount} {winner.voteCount === 1 ? 'Vote' : 'Votes'} · {winner.percentage?.toFixed(1)}%
              </p>
            </div>
            {/* Total votes badge */}
            <div className="relative z-10 sm:ml-auto flex flex-col items-center sm:items-end gap-1">
              <div className="flex items-center gap-2 bg-[#0a0f1c] border border-outline-variant/20 rounded-xl px-4 py-3">
                <Users className="w-4 h-4 text-[#3cd7ff]" />
                <div>
                  <p className="text-white font-black text-xl leading-none">{data.totalVotes}</p>
                  <p className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest font-bold mt-0.5">Total Votes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Results */}
          <div className="space-y-3">
            <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">All Candidates</p>
            {results.map((result, index) => {
              const barWidth = maxVotes > 0 ? (result.voteCount / maxVotes) * 100 : 0;
              const isWinner = index === 0 && data.totalVotes > 0;
              return (
                <div
                  key={result.candidateId}
                  className={`bg-[#111827] border rounded-2xl p-6 transition-all ${
                    isWinner ? 'border-[#f59e0b]/30' : 'border-outline-variant/15 hover:border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                        isWinner
                          ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]'
                          : 'bg-[#0a0f1c] border-outline-variant/20 text-on-surface-variant/40'
                      }`}>
                        {isWinner ? <Award className="w-5 h-5" /> : `#${index + 1}`}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{result.candidateName}</h3>
                        {result.party && (
                          <p className="text-xs text-on-surface-variant/50 font-medium mt-0.5">{result.party}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-black ${isWinner ? 'text-[#f59e0b]' : 'text-[#3cd7ff]'}`}>
                        {result.voteCount}
                      </p>
                      <p className="text-xs text-on-surface-variant/50 uppercase tracking-widest font-bold mt-0.5">
                        {result.percentage?.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-[#0a0f1c] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: isWinner ? '#f59e0b' : '#3cd7ff',
                        boxShadow: isWinner ? '0 0 8px rgba(245,158,11,0.4)' : '0 0 8px rgba(60,215,255,0.3)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#111827] border border-outline-variant/15 rounded-2xl p-5 text-center">
              <p className="text-2xl font-black text-white">{data.totalVotes}</p>
              <p className="text-xs text-on-surface-variant/50 uppercase tracking-widest font-bold mt-1">Total Votes</p>
            </div>
            <div className="bg-[#111827] border border-outline-variant/15 rounded-2xl p-5 text-center">
              <p className="text-2xl font-black text-white">{results.length}</p>
              <p className="text-xs text-on-surface-variant/50 uppercase tracking-widest font-bold mt-1">Candidates</p>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-[#111827] border border-[#05e777]/20 rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#05e777] animate-pulse" />
                <p className="text-xs font-black text-[#05e777] uppercase tracking-widest">Verified</p>
              </div>
              <p className="text-xs text-on-surface-variant/50 uppercase tracking-widest font-bold mt-1">Immutable Record</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ElectionResults;
