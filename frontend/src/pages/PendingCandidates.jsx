import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  CheckCircle2, XCircle, User, Mail, Phone, MapPin, Briefcase,
  FileText, DollarSign, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';

const PendingCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    fetchPendingCandidates();
  }, []);

  const fetchPendingCandidates = async () => {
    try {
      const res = await api.get('/candidates/pending');
      setCandidates(res.data);
    } catch (err) {
      console.error('Failed to fetch pending candidates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (candidateId) => {
    setActionLoading(candidateId);
    try {
      await api.post(`/candidates/${candidateId}/approve`);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      alert('Candidate approved successfully!');
    } catch (err) {
      alert('Failed to approve candidate');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (candidateId) => {
    setActionLoading(candidateId);
    try {
      await api.post(`/candidates/${candidateId}/reject`, rejectionReason);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      setShowRejectModal(null);
      setRejectionReason('');
      alert('Candidate application rejected');
    } catch (err) {
      alert('Failed to reject candidate');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#3cd7ff] text-sm font-bold tracking-[0.2em] uppercase animate-pulse">
          Loading Applications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Pending Candidate Approvals</h1>
        <p className="text-on-surface-variant text-sm mt-1 opacity-70">
          {candidates.length} application{candidates.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-[#111827] rounded-3xl border border-outline-variant/20 p-16 text-center">
          <CheckCircle2 className="w-16 h-16 text-on-surface-variant/20 mx-auto mb-4" />
          <p className="text-on-surface-variant opacity-60">No pending candidate applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(candidate => (
            <div key={candidate.id} className="bg-[#111827] border border-outline-variant/20 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3cd7ff]/20 to-transparent border border-[#3cd7ff]/30 flex items-center justify-center font-black text-[#3cd7ff] text-2xl">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{candidate.name}</h3>
                    <p className="text-sm text-on-surface-variant opacity-70 mt-0.5">
                      {candidate.party || 'Independent'} • Age {candidate.age}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Pending Approval
                      </span>
                      {candidate.nominationFeePaid && (
                        <span className="text-xs font-bold text-[#05e777] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Fee Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApprove(candidate.id)}
                    disabled={actionLoading === candidate.id}
                    className="px-6 py-3 bg-[#05e777] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(5,231,119,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(candidate.id)}
                    disabled={actionLoading === candidate.id}
                    className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === candidate.id ? null : candidate.id)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                  >
                    {expanded === candidate.id ? (
                      <ChevronUp className="w-5 h-5 text-on-surface-variant" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === candidate.id && (
                <div className="px-6 pb-6 pt-0 border-t border-outline-variant/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-[#3cd7ff] uppercase tracking-widest">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-on-surface-variant/50 mt-0.5" />
                          <div>
                            <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Email</p>
                            <p className="text-sm text-white">{candidate.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-on-surface-variant/50 mt-0.5" />
                          <div>
                            <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Phone</p>
                            <p className="text-sm text-white">{candidate.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-on-surface-variant/50 mt-0.5" />
                          <div>
                            <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Address</p>
                            <p className="text-sm text-white leading-relaxed">{candidate.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-[#3cd7ff] uppercase tracking-widest">Professional Background</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Education</p>
                          <p className="text-sm text-white">{candidate.education || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Occupation</p>
                          <p className="text-sm text-white">{candidate.occupation || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Previous Positions</p>
                          <p className="text-sm text-white leading-relaxed">
                            {candidate.previousPositions || 'None'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Legal & Financial */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-[#3cd7ff] uppercase tracking-widest">Legal & Financial</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Criminal Record</p>
                          <span className={`text-sm font-bold ${
                            candidate.criminalRecord === 'NONE' ? 'text-[#05e777]' : 
                            candidate.criminalRecord === 'PENDING_CASES' ? 'text-orange-400' : 
                            'text-red-400'
                          }`}>
                            {candidate.criminalRecord.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Assets Value</p>
                          <p className="text-sm text-white">₹{candidate.assetsValue || 0} Lakhs</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant/50 uppercase font-bold">Nomination Fee</p>
                          <p className={`text-sm font-bold ${candidate.nominationFeePaid ? 'text-[#05e777]' : 'text-red-400'}`}>
                            {candidate.nominationFeePaid ? `Paid (${candidate.nominationFeeReceiptNo})` : 'Not Paid'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manifesto */}
                  {candidate.description && (
                    <div className="mt-6 p-4 bg-[#0a0f1c] rounded-xl border border-outline-variant/20">
                      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-2">
                        Election Manifesto
                      </p>
                      <p className="text-sm text-white leading-relaxed">{candidate.description}</p>
                    </div>
                  )}

                  {/* Submitted Date */}
                  <div className="mt-6 text-xs text-on-surface-variant/50">
                    Submitted on: {new Date(candidate.submittedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] border border-red-500/30 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-4">Reject Application</h2>
            <p className="text-sm text-on-surface-variant opacity-70 mb-6">
              Please provide a reason for rejection. This will be communicated to the candidate.
            </p>
            <textarea
              rows={4}
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full bg-[#111827] text-white px-4 py-3 rounded-xl border border-outline-variant/20 focus:border-red-500/50 outline-none text-sm resize-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-5 py-3 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-500 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCandidates;
