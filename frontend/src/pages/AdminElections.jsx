import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Vote, Plus, Trash2, XCircle, ChevronRight,
  AlertCircle, Clock, CheckCircle2, Activity, Search, Copy, Check, Link2, Users, Globe
} from 'lucide-react';

const statusColor = { ACTIVE: '#05e777', UPCOMING: '#3cd7ff', CLOSED: '#6b7280' };
const statusBg = { ACTIVE: '#05e77715', UPCOMING: '#3cd7ff15', CLOSED: '#6b728015' };
const statusIcon = { ACTIVE: Activity, UPCOMING: Clock, CLOSED: XCircle };

const AdminElections = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchElections = async () => {
    try {
      const res = await api.get('/elections');
      setElections(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchElections(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this election protocol?')) return;
    setActionLoading(id);
    try { 
        await api.delete(`/elections/${id}`); 
        setElections(e => e.filter(x => x.id !== id)); 
    }
    catch (e) { alert('Failed to delete'); }
    finally { setActionLoading(null); }
  };

  const handleCopyInviteLink = (token, id) => {
    const link = `${window.location.origin}/dashboard/elections/invite/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = ['ALL', 'ACTIVE', 'UPCOMING', 'CLOSED'];
  const filtered = elections.filter(e => {
    const matchFilter = filter === 'ALL' || e.status === filter;
    const matchSearch = (e.title?.toLowerCase() || '').includes((search || '').toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Accessing MongoDB Registry...</p></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Election Protocol Registry</h1>
          <p className="text-on-surface-variant text-sm mt-1 opacity-70">{elections.length} total protocols in cluster</p>
        </div>
        <button
          onClick={() => navigate('/admin/elections/new')}
          className="bg-[#3cd7ff] text-[#003642] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Election
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 bg-[#111827] p-1 rounded-xl border border-outline-variant/20">
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === t ? 'bg-[#3cd7ff] text-[#003642]' : 'text-on-surface-variant hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <input
            type="text"
            placeholder="Search protocols..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-outline-variant/20 text-white pl-9 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#3cd7ff]/50 placeholder:text-on-surface-variant/30"
          />
        </div>
      </div>

      <div className="bg-[#111827] rounded-3xl border border-outline-variant/20 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[1fr_120px_140px_180px_180px_140px] text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 px-6 py-3 border-b border-outline-variant/10">
          <span>Protocol Name</span>
          <span>Status</span>
          <span>Eligibility</span>
          <span>Start Epoch</span>
          <span>End Epoch</span>
          <span className="text-right pr-4">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center text-on-surface-variant opacity-40 flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10" />
            <p>No protocols found matching criteria</p>
          </div>
        ) : filtered.map((e) => {
          const Icon = statusIcon[e.status] || Activity;
          const eligibilityBadge = e.eligibilityMode === 'ALL' ? { text: 'All', icon: Globe, color: '#05e777' } : 
                                  e.eligibilityMode === 'INVITE' ? { text: 'Invite', icon: Link2, color: '#3cd7ff' } : 
                                  { text: 'Specific', icon: Users, color: '#f59e0b' };
          const EligIcon = eligibilityBadge.icon;
          
          return (
            <div key={e.id} className="grid grid-cols-[1fr_120px_140px_180px_180px_140px] items-center px-6 py-4 border-b border-outline-variant/10 hover:bg-white/[0.02] transition-colors last:border-b-0">
              <div>
                <p className="font-bold text-white text-sm">{e.title}</p>
                <p className="text-xs text-on-surface-variant opacity-50 mt-0.5 line-clamp-1">
                  {e.allEligible ? 'All citizens eligible' : `${e.eligibleCitizenIds?.length || 0} eligible voters`}
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ color: statusColor[e.status], backgroundColor: statusBg[e.status] }}>
                  <Icon className="w-3 h-3" />{e.status}
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border"
                  style={{ color: eligibilityBadge.color, borderColor: `${eligibilityBadge.color}40`, backgroundColor: `${eligibilityBadge.color}10` }}>
                  <EligIcon className="w-3 h-3" />{eligibilityBadge.text}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono">{new Date(e.startTime).toLocaleString()}</p>
              <p className="text-xs text-on-surface-variant font-mono">{new Date(e.endTime).toLocaleString()}</p>
              <div className="flex items-center justify-end gap-1">
                {e.eligibilityMode === 'INVITE' && e.inviteToken && (
                  <button
                    onClick={() => handleCopyInviteLink(e.inviteToken, e.id)}
                    className="p-2 text-[#3cd7ff] hover:bg-[#3cd7ff]/10 rounded-lg transition-colors"
                    title="Copy Invite Link">
                    {copiedId === e.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => navigate(`/admin/elections/${e.id}`)}
                  className="p-2 text-[#3cd7ff] hover:bg-[#3cd7ff]/10 rounded-lg transition-colors" title="Manage Protocol">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(e.id)} disabled={actionLoading === e.id}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50" title="Revoke Protocol">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminElections;
