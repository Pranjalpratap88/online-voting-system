import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Users, BarChart2, Plus, Trash2, Edit2, Copy, RefreshCw,
  CheckCircle2, Activity, XCircle, Clock, Trophy, User, Link2, Check, AlertCircle
} from 'lucide-react';

const statusColor = { ACTIVE: '#05e777', UPCOMING: '#3cd7ff', CLOSED: '#6b7280' };
const statusBg = { ACTIVE: '#05e77715', UPCOMING: '#3cd7ff15', CLOSED: '#6b728015' };

const AdminElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('candidates');
  const [newCandidate, setNewCandidate] = useState({ name: '', party: '', description: '' });
  const [adding, setAdding] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const fetchData = async () => {
    try {
      const electionRes = await api.get(`/elections/${id}`);
      setElection(electionRes.data);
      setEditData({
        title: electionRes.data.title,
        description: electionRes.data.description,
        startTime: electionRes.data.startTime,
        endTime: electionRes.data.endTime
      });

      if (electionRes.data.status !== 'UPCOMING') {
        try {
          const resultsRes = await api.get(`/results/${id}`);
          setResults(resultsRes.data);
        } catch (e) {
          console.error('Results not available yet');
        }
      }
    } catch (e) { 
      console.error(e); 
      alert('Failed to load election details');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/candidates', { ...newCandidate, electionId: id });
      setNewCandidate({ name: '', party: '', description: '' });
      setShowCandidateForm(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Failed to add candidate'); }
    finally { setAdding(false); }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Delete this candidate? This cannot be undone.')) return;
    try {
      await api.delete(`/candidates/${candidateId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete candidate');
    }
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/elections/${id}`, editData);
      setShowEditForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update election');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteElection = async () => {
    if (!window.confirm('Permanently delete this election protocol? This cannot be undone.')) return;
    try {
        await api.delete(`/elections/${id}`);
        navigate('/admin/elections');
    } catch (err) {
        alert('Failed to delete election');
    }
  };

  const handleCopyInviteLink = () => {
    if (!election?.inviteToken) return;
    const link = `${window.location.origin}/dashboard/elections/invite/${election.inviteToken}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateToken = async () => {
    if (!window.confirm('Regenerate invite link? The old link will stop working.')) return;
    setRegenerating(true);
    try {
      await api.post(`/elections/${id}/regenerate-invite`);
      fetchData();
    } catch (err) {
      alert('Failed to regenerate invite token');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">Accessing MongoDB Cluster...</p></div>;
  if (!election) return <div className="text-white text-center p-12">Election Protocol Not Found</div>;

  const maxVotes = results ? Math.max(...(results.results?.map(r => r.voteCount) || [1]), 1) : 1;
  const candidates = election.candidates || [];
  const eligibilityBadge = election.eligibilityMode === 'ALL' ? 'All Citizens' : 
                          election.eligibilityMode === 'INVITE' ? 'Invite Link' : 
                          'Specific Citizens';
  const eligibilityColor = election.eligibilityMode === 'ALL' ? '#05e777' : 
                          election.eligibilityMode === 'INVITE' ? '#3cd7ff' : '#f59e0b';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{election.title}</h1>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: statusColor[election.status], backgroundColor: statusBg[election.status] }}>
              {election.status}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: eligibilityColor, borderColor: `${eligibilityColor}40`, backgroundColor: `${eligibilityColor}10` }}>
              {eligibilityBadge}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm mt-1 opacity-70">{election.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowEditForm(true)}
            className="px-5 py-2.5 bg-[#3cd7ff]/10 border border-[#3cd7ff]/30 text-[#3cd7ff] rounded-xl font-bold text-sm hover:bg-[#3cd7ff]/20 transition-all flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button onClick={handleDeleteElection}
            className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Edit Election Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] border border-[#3cd7ff]/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-white mb-6">Edit Election</h2>
            <form onSubmit={handleUpdateElection} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">Title *</label>
                <input required type="text" value={editData.title}
                  onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#111827] text-white px-4 py-3 rounded-xl border border-transparent focus:border-[#3cd7ff]/50 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">Description</label>
                <textarea rows={3} value={editData.description}
                  onChange={e => setEditData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#111827] text-white px-4 py-3 rounded-xl border border-transparent focus:border-[#3cd7ff]/50 outline-none text-sm resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">Start Time *</label>
                  <input required type="datetime-local" value={editData.startTime}
                    onChange={e => setEditData(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full bg-[#111827] text-white px-4 py-3 rounded-xl border border-transparent focus:border-[#3cd7ff]/50 outline-none text-sm [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">End Time *</label>
                  <input required type="datetime-local" value={editData.endTime}
                    onChange={e => setEditData(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full bg-[#111827] text-white px-4 py-3 rounded-xl border border-transparent focus:border-[#3cd7ff]/50 outline-none text-sm [color-scheme:dark]" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditForm(false)}
                  className="px-5 py-2.5 text-on-surface-variant hover:text-white text-sm font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={updating}
                  className="bg-[#3cd7ff] text-[#003642] px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Link Section */}
      {election.eligibilityMode === 'INVITE' && election.inviteToken && (
        <div className="bg-[#111827] border border-[#3cd7ff]/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-5 h-5 text-[#3cd7ff]" />
            <h3 className="font-bold text-white">Shareable Invite Link</h3>
          </div>
          <p className="text-sm text-on-surface-variant opacity-70 mb-4">
            Share this link with citizens to grant them access to vote in this election.
          </p>
          <div className="flex gap-3">
            <div className="flex-1 bg-[#0a0f1c] border border-outline-variant/20 rounded-xl px-4 py-3 font-mono text-sm text-[#3cd7ff] overflow-x-auto whitespace-nowrap">
              {`${window.location.origin}/dashboard/elections/invite/${election.inviteToken}`}
            </div>
            <button onClick={handleCopyInviteLink}
              className="px-5 py-3 bg-[#3cd7ff]/10 border border-[#3cd7ff]/30 text-[#3cd7ff] rounded-xl font-bold text-sm hover:bg-[#3cd7ff]/20 transition-all flex items-center gap-2">
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
            <button onClick={handleRegenerateToken} disabled={regenerating}
              className="px-5 py-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl font-bold text-sm hover:bg-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} /> Regenerate
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Start Time', value: new Date(election.startTime).toLocaleString() },
          { label: 'End Time', value: new Date(election.endTime).toLocaleString() },
          { label: 'Candidates', value: candidates.length },
          { label: 'Eligible Voters', value: election.allEligible ? 'All Citizens' : (election.eligibleCitizenIds?.length || 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-2">{label}</p>
            <p className="text-white font-bold text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-[#111827] p-1 rounded-xl border border-outline-variant/20 w-fit">
        {['candidates', 'results'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize ${activeTab === t ? 'bg-[#3cd7ff] text-[#003642]' : 'text-on-surface-variant hover:text-white'}`}>
            {t === 'candidates' ? <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Candidates</span>
              : <span className="flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5" /> Results</span>}
          </button>
        ))}
      </div>

      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">{candidates.length} Registered Candidates</p>
            {election.status === 'UPCOMING' && (
              <button onClick={() => navigate(`/admin/elections/${id}/add-candidate`)}
                className="flex items-center gap-2 bg-[#3cd7ff]/10 border border-[#3cd7ff]/30 text-[#3cd7ff] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#3cd7ff]/20 transition-all">
                <Plus className="w-4 h-4" /> Add Candidate
              </button>
            )}
          </div>

          {showCandidateForm && (
            <div className="bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 rounded-2xl p-6 text-center">
              <p className="text-sm text-on-surface-variant opacity-80">
                Candidate registration has been moved to a dedicated form for better data collection.
              </p>
              <button
                onClick={() => navigate(`/admin/elections/${id}/add-candidate`)}
                className="mt-4 px-6 py-3 bg-[#3cd7ff] text-[#003642] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all"
              >
                Go to Candidate Registration Form
              </button>
            </div>
          )}

          {candidates.length === 0 ? (
            <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-12 text-center text-on-surface-variant opacity-40">
              No candidates registered for this protocol.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map(c => (
                <div key={c.id} className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 flex items-center justify-center font-black text-[#3cd7ff] text-lg">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      {c.party && <p className="text-xs text-[#3cd7ff] mt-0.5 font-medium">{c.party}</p>}
                      {c.description && <p className="text-xs text-on-surface-variant mt-1 opacity-60 line-clamp-2">{c.description}</p>}
                    </div>
                  </div>
                  {election.status === 'UPCOMING' && (
                    <button onClick={() => handleDeleteCandidate(c.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
                      title="Delete Candidate">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          {!results || results.results?.length === 0 ? (
            <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
              <p className="text-on-surface-variant opacity-60">No votes committed to the MongoDB ledger yet.</p>
            </div>
          ) : (
            <>
              <div className="bg-[#111827] border border-[#05e777]/20 rounded-2xl p-6 flex items-center gap-4">
                <Trophy className="w-8 h-8 text-[#f59e0b]" />
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Consensus Leader</p>
                  <p className="text-xl font-black text-white">{results.results[0]?.candidateName}</p>
                  <p className="text-sm text-[#05e777] font-bold">{results.results[0]?.voteCount} votes · {results.results[0]?.percentage?.toFixed(1)}%</p>
                </div>
              </div>
              <div className="space-y-4">
                {results.results.map((r, i) => (
                  <div key={r.candidateId} className="bg-[#111827] border border-outline-variant/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-on-surface-variant opacity-40">#{i + 1}</span>
                        <p className="font-bold text-white">{r.candidateName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#3cd7ff] font-black">{r.voteCount} votes</p>
                        <p className="text-xs text-on-surface-variant opacity-60">{r.percentage?.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-[#0a0f1c] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(r.voteCount / maxVotes) * 100}%`, backgroundColor: i === 0 ? '#05e777' : '#3cd7ff' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#111827] border border-outline-variant/20 rounded-2xl px-6 py-4 flex justify-between items-center shadow-xl">
                <p className="text-on-surface-variant text-sm opacity-70">Total Valid Ballots</p>
                <p className="text-white font-black text-xl">{results.totalVotes}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminElectionDetail;
