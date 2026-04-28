import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ShieldCheck, ShieldOff, Trash2, Search, UserCheck, UserX, CheckCircle, XCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApproveManager = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/admin/approve-manager/${id}`);
      setUsers(u => u.map(x => x.id === id ? { ...x, approved: true } : x));
      alert('Election Manager approved successfully');
    } catch (e) { alert('Failed to approve manager'); }
    finally { setActionLoading(null); }
  };

  const [expanded, setExpanded] = useState(null);

  const filtered = users.filter(u =>
    (u.name?.toLowerCase() || '').includes((search || '').toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes((search || '').toLowerCase()) ||
    (u.voterId?.toLowerCase() || '').includes((search || '').toLowerCase())
  );

  const verified = users.filter(u => u.isVerified).length;
  const managers = users.filter(u => u.role === 'ELECTION_MANAGER').length;
  const pendingManagers = users.filter(u => u.role === 'ELECTION_MANAGER' && !u.isApproved);
  const pendingCount = pendingManagers.length;

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Loading Citizens...</p></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">CITIZEN REGISTRY</h1>
          <p className="text-on-surface-variant text-sm mt-1 opacity-70 uppercase tracking-widest">{users.length} registered citizens in MongoDB Atlas</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-outline-variant/10 rounded-2xl p-5 shadow-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-2">Total Citizens</p>
          <p className="text-3xl font-black text-white">{users.length}</p>
        </div>
        <div className="bg-[#111827] border border-[#05e777]/20 rounded-2xl p-5 shadow-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-2">Verified</p>
          <p className="text-3xl font-black text-[#05e777]">{verified}</p>
        </div>
        <div className="bg-[#111827] border border-[#3cd7ff]/20 rounded-2xl p-5 shadow-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-2">Managers</p>
          <p className="text-3xl font-black text-[#3cd7ff]">{managers}</p>
        </div>
        <div className="bg-[#111827] border border-orange-500/20 rounded-2xl p-5 shadow-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-2">Pending Appr.</p>
          <p className="text-3xl font-black text-orange-400">{pendingCount}</p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Pending Manager Approvals</h2>
              <p className="text-sm text-on-surface-variant opacity-70 mt-1">
                {pendingCount} Election Manager{pendingCount !== 1 ? 's' : ''} awaiting authorization
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingManagers.map(u => (
              <div key={u.id} className="bg-[#111827] border border-orange-500/20 rounded-2xl p-5 flex items-center justify-between hover:border-orange-500/40 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30 flex items-center justify-center font-black text-orange-400 text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-white text-base">{u.name}</p>
                    <p className="text-sm text-on-surface-variant opacity-70 mt-0.5">{u.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-[#3cd7ff]/10 text-[#3cd7ff] border border-[#3cd7ff]/20">
                        Election Manager
                      </span>
                      {u.isVerified && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#05e777] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Identity Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApproveManager(u.id)}
                    disabled={actionLoading === u.id}
                    className="px-6 py-3 bg-[#05e777] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(5,231,119,0.4)] transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
                  >
                    {actionLoading === u.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Approve Manager
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                    title="View Details"
                  >
                    <Search className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-[#3cd7ff] transition-colors" />
        <input
          type="text"
          placeholder="Search by name, email or voter ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-outline-variant/10 text-white pl-11 pr-4 py-4 rounded-2xl text-sm outline-none focus:border-[#3cd7ff]/50 placeholder:text-on-surface-variant/30 transition-all shadow-xl"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111827] rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[1.2fr_1.5fr_120px_150px_auto] text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] px-8 py-5 border-b border-outline-variant/5 bg-white/[0.02]">
          <span>Citizen Name</span>
          <span>Contact & Identity</span>
          <span>Role</span>
          <span>Verification</span>
          <span className="text-right">Manage</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-20 text-center">
            <Users className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
            <p className="text-on-surface-variant opacity-40 font-bold tracking-widest uppercase text-sm">No citizens match your search</p>
          </div>
        ) : filtered.map(u => (
          <React.Fragment key={u.id}>
            <div 
              onClick={() => setExpanded(expanded === u.id ? null : u.id)}
              className={`grid grid-cols-[1.2fr_1.5fr_120px_150px_auto] items-center px-8 py-5 border-b border-outline-variant/5 hover:bg-white/[0.03] transition-all cursor-pointer group ${expanded === u.id ? 'bg-white/[0.05]' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3cd7ff]/20 to-transparent border border-[#3cd7ff]/20 flex items-center justify-center font-black text-[#3cd7ff] text-sm shadow-lg group-hover:scale-110 transition-transform">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white text-sm">{u.name}</p>
                  <p className="text-[10px] text-[#3cd7ff] font-bold tracking-widest opacity-60 uppercase mt-0.5">{u.voterId || 'ID PENDING'}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-0.5 pr-4">
                <p className="text-sm text-on-surface-variant font-medium truncate">{u.email}</p>
                <p className="text-[10px] text-on-surface-variant/40 font-bold tracking-tighter uppercase">{u.phone || 'NO PHONE'}</p>
              </div>

              <div>
                <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg ${
                  u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                  u.role === 'ELECTION_MANAGER' ? 'bg-[#3cd7ff]/10 text-[#3cd7ff] border border-[#3cd7ff]/20' : 
                  'bg-white/5 text-on-surface-variant border border-white/10'
                }`}>{u.role}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                  u.isVerified ? 'text-[#05e777]' : 'text-red-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-[#05e777]' : 'bg-red-400'} animate-pulse`} />
                  {u.isVerified ? 'Identity Verified' : 'Not Verified'}
                </div>
                {u.role === 'ELECTION_MANAGER' && (
                    <div className={`text-[9px] font-black uppercase tracking-widest ${
                      u.isApproved ? 'text-blue-400' : 'text-orange-400'
                    }`}>
                      Protocol: {u.isApproved ? 'Authorized' : 'Awaiting Approval'}
                    </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                {u.role === 'ELECTION_MANAGER' && !u.isApproved && (
                    <button onClick={(e) => { e.stopPropagation(); handleApproveManager(u.id); }} disabled={actionLoading === u.id}
                      className="p-2.5 bg-[#05e777]/10 text-[#05e777] hover:bg-[#05e777] hover:text-black rounded-xl transition-all disabled:opacity-50 shadow-lg border border-[#05e777]/20"
                      title="Approve Manager">
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${expanded === u.id ? 'rotate-180 bg-white/10' : 'bg-white/5'}`}>
                  <Search className="w-3.5 h-3.5 text-on-surface-variant" />
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === u.id && (
              <div className="px-8 py-8 bg-black/40 border-b border-outline-variant/10 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#3cd7ff] uppercase tracking-[0.2em] opacity-80">Location Details</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-on-surface-variant/40 uppercase font-bold">Address</p>
                        <p className="text-white text-sm font-medium leading-relaxed">{u.address || 'N/A'}</p>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] text-on-surface-variant/40 uppercase font-bold">State</p>
                          <p className="text-white text-sm font-bold uppercase tracking-wide">{u.state || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-on-surface-variant/40 uppercase font-bold">Pincode</p>
                          <p className="text-white text-sm font-bold tracking-widest">{u.pincode || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#3cd7ff] uppercase tracking-[0.2em] opacity-80">Identity Proofs</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-on-surface-variant/40 uppercase font-bold">Aadhaar Reference</p>
                        <p className="text-white text-sm font-bold tracking-widest font-mono">
                          {u.aadhaarId ? `XXXX-XXXX-${u.aadhaarId.slice(-4)}` : 'NOT LINKED'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant/40 uppercase font-bold">Voter Serial Number</p>
                        <p className="text-white text-sm font-bold tracking-widest uppercase font-mono">{u.voterId || 'SYSTEM GENERATED'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#3cd7ff] uppercase tracking-[0.2em] opacity-80">System Metadata</p>
                    <div className="space-y-3">
                      <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Auth Status</p>
                          <span className="text-[9px] font-black text-[#05e777] uppercase tracking-widest">Active</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#3cd7ff] to-[#05e777] w-[85%] rounded-full shadow-[0_0_8px_rgba(60,215,255,0.4)]" />
                        </div>
                        <p className="text-[9px] text-on-surface-variant/40 mt-3 italic">Citizen identity records are managed via MongoDB Cluster0 on AWS Mumbai.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
