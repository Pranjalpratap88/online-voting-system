import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Users, Vote, Activity, BarChart2, TrendingUp,
  CheckCircle2, Clock, AlertTriangle, Plus, ChevronRight, Shield,
  Upload, FileText, Check, X
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color = '#3cd7ff' }) => (
  <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 flex flex-col gap-4 relative overflow-hidden">
    <div className="absolute top-4 right-4 opacity-[0.06]" style={{ color }}>
      <Icon style={{ width: 64, height: 64 }} strokeWidth={1} />
    </div>
    <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">{label}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-1 opacity-50">{sub}</p>}
    </div>
  </div>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, electionsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/elections'),
      ]);
      setStats(statsRes.data);
      setElections(electionsRes.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.post('/admin/import-citizens', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportResult(res.data);
      fetchData(); // Refresh stats
    } catch (err) {
      console.error(err);
      alert('Import failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset input
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Loading Command Center...</p>
    </div>
  );

  const statusColor = { ACTIVE: '#05e777', UPCOMING: '#3cd7ff', CLOSED: '#6b7280', COMPLETED: '#a855f7' };
  const statusBg = { ACTIVE: '#05e77715', UPCOMING: '#3cd7ff15', CLOSED: '#6b728015', COMPLETED: '#a855f715' };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Command Center</h1>
          <p className="text-on-surface-variant text-sm mt-1 opacity-70">Full system overview — MongoDB Cluster Status: Online</p>
        </div>
        <div className="flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv" 
              onChange={handleFileChange} 
            />
            <button
              onClick={handleImportClick}
              disabled={importing}
              className="bg-white/5 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-[#05e777]" /> 
              {importing ? 'Importing...' : 'Import Citizens (CSV)'}
            </button>
            <button
              onClick={() => navigate('/admin/elections/new')}
              className="bg-[#3cd7ff] text-[#003642] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> New Election
            </button>
        </div>
      </div>

      {importResult && (
          <div className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-6 relative overflow-hidden">
              <button onClick={() => setImportResult(null)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-[#05e77715] rounded-lg">
                      <Check className="w-5 h-5 text-[#05e777]" />
                  </div>
                  <h3 className="text-lg font-bold">Import Summary</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                      <p className="text-2xl font-black text-[#05e777]">{importResult.successCount}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Successfully Imported</p>
                  </div>
                  <div>
                      <p className="text-2xl font-black text-red-400">{importResult.failCount}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Failed Records</p>
                  </div>
              </div>
              {importResult.errors?.length > 0 && (
                  <div className="mt-6 bg-[#0a0f1c] p-4 rounded-xl border border-white/5 max-h-40 overflow-y-auto">
                      <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">Error Logs</p>
                      <ul className="space-y-2">
                          {importResult.errors.map((err, i) => (
                              <li key={i} className="text-xs text-on-surface-variant/70 border-l-2 border-red-400/50 pl-3">{err}</li>
                          ))}
                      </ul>
                  </div>
              )}
          </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Citizens" value={stats?.totalUsers ?? 0} color="#3cd7ff" />
        <StatCard icon={Vote} label="Total Elections" value={stats?.totalElections ?? 0} color="#a855f7" />
        <StatCard icon={Activity} label="Active Protocols" value={stats?.activeElections ?? 0} color="#05e777" />
        <StatCard icon={BarChart2} label="Votes Cast" value={stats?.totalVotes ?? 0} color="#f59e0b" />
      </div>

      {/* Recent Elections */}
      <div className="bg-[#111827] rounded-3xl border border-outline-variant/20 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#3cd7ff]" />
            <h2 className="text-lg font-bold text-white">Recent Elections</h2>
          </div>
          <button onClick={() => navigate('/admin/elections')} className="text-[#3cd7ff] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-outline-variant/10">
          {elections.length === 0 ? (
            <div className="p-10 text-center text-on-surface-variant opacity-50">No elections yet. Create one to get started.</div>
          ) : elections.map(e => (
            <div key={e.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#0a0f1c] rounded-lg border border-outline-variant/20">
                  <Vote className="w-4 h-4 text-[#3cd7ff]" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{e.title}</p>
                  <p className="text-xs text-on-surface-variant opacity-60 mt-0.5">
                    {new Date(e.startTime).toLocaleDateString()} → {new Date(e.endTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ color: statusColor[e.status], backgroundColor: statusBg[e.status] }}>
                  {e.status}
                </span>
                <button
                  onClick={() => navigate(`/admin/elections/${e.id}`)}
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button onClick={() => navigate('/admin/elections/new')}
          className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-6 text-left hover:border-[#3cd7ff]/30 transition-all group">
          <Plus className="w-6 h-6 text-[#3cd7ff] mb-3" />
          <p className="font-bold text-white">Create Election</p>
          <p className="text-xs text-on-surface-variant opacity-60 mt-1">Initialize a new voting protocol</p>
        </button>
        <button onClick={() => navigate('/admin/candidates/pending')}
          className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-6 text-left hover:border-orange-400/30 transition-all group">
          <Users className="w-6 h-6 text-orange-400 mb-3" />
          <p className="font-bold text-white">Pending Candidates</p>
          <p className="text-xs text-on-surface-variant opacity-60 mt-1">Review candidate applications</p>
        </button>
        <button onClick={() => navigate('/admin/users')}
          className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-6 text-left hover:border-[#05e777]/30 transition-all group">
          <Users className="w-6 h-6 text-[#05e777] mb-3" />
          <p className="font-bold text-white">Manage Citizens</p>
          <p className="text-xs text-on-surface-variant opacity-60 mt-1">View and manage registered voters</p>
        </button>
        <button onClick={() => navigate('/admin/elections')}
          className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-6 text-left hover:border-purple-500/30 transition-all group">
          <BarChart2 className="w-6 h-6 text-purple-400 mb-3" />
          <p className="font-bold text-white">Election Results</p>
          <p className="text-xs text-on-surface-variant opacity-60 mt-1">View live vote tallies</p>
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
