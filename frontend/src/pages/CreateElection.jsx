import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Plus, Calendar, Clock, FileText, Tag, Users, 
  Globe, Link as LinkIcon, CheckCircle2, AlertCircle, Info, Search
} from 'lucide-react';

const CreateElection = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    eligibilityMode: 'ALL', // ALL, INVITE, SPECIFIC
    eligibleCitizenIds: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [citizens, setCitizens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizens, setSelectedCitizens] = useState([]);
  const [loadingCitizens, setLoadingCitizens] = useState(false);

  useEffect(() => {
    if (form.eligibilityMode === 'SPECIFIC') {
      fetchCitizens();
    }
  }, [form.eligibilityMode]);

  const fetchCitizens = async () => {
    setLoadingCitizens(true);
    try {
      const res = await api.get('/admin/users');
      setCitizens(res.data.filter(u => u.role === 'CITIZEN'));
    } catch (err) {
      console.error('Failed to fetch citizens', err);
    } finally {
      setLoadingCitizens(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModeChange = (mode) => {
    setForm(prev => ({ ...prev, eligibilityMode: mode }));
    setSelectedCitizens([]);
  };

  const toggleCitizen = (citizenId) => {
    setSelectedCitizens(prev => 
      prev.includes(citizenId) 
        ? prev.filter(id => id !== citizenId)
        : [...prev, citizenId]
    );
  };

  const selectAll = () => {
    const filtered = citizens.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedCitizens(filtered.map(c => c.citizenId));
  };

  const clearAll = () => {
    setSelectedCitizens([]);
  };

  const convertToIST = (dateTimeString) => {
    // datetime-local input gives us: "2026-05-15T10:00"
    // This is the user's local time as they see it in the calendar
    // We need to send it as-is to the backend
    // The backend will treat it as IST time
    
    // Simply append :00 for seconds and return
    return dateTimeString + ':00';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        startTime: convertToIST(form.startTime),
        endTime: convertToIST(form.endTime),
        eligibilityMode: form.eligibilityMode,
        eligibleCitizenIds: form.eligibilityMode === 'SPECIFIC' ? selectedCitizens : []
      };
      
      const res = await api.post('/elections', payload);
      navigate(`/admin/elections/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  const filteredCitizens = citizens.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.voterId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" /> Basic Information
          </h3>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2">
              <Tag className="w-3.5 h-3.5" /> Election Title *
            </label>
            <input
              name="title"
              required
              type="text"
              placeholder="e.g. National Presidential Election 2024"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none text-sm placeholder:text-on-surface-variant/30 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2">
              <FileText className="w-3.5 h-3.5" /> Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the purpose and scope of this election..."
              value={form.description}
              onChange={handleChange}
              className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none text-sm placeholder:text-on-surface-variant/30 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" /> Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2">
                <Calendar className="w-3.5 h-3.5" /> Start Date & Time *
              </label>
              <input
                name="startTime"
                required
                type="datetime-local"
                value={form.startTime}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none text-sm transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2">
                <Clock className="w-3.5 h-3.5" /> End Date & Time *
              </label>
              <input
                name="endTime"
                required
                type="datetime-local"
                value={form.endTime}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none text-sm transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Eligibility Mode */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" /> Voter Eligibility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* All Citizens */}
            <button
              type="button"
              onClick={() => handleModeChange('ALL')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                form.eligibilityMode === 'ALL'
                  ? 'border-[#3cd7ff] bg-[#3cd7ff]/5'
                  : 'border-outline-variant/20 hover:border-outline-variant/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Globe className={`w-6 h-6 ${form.eligibilityMode === 'ALL' ? 'text-[#3cd7ff]' : 'text-on-surface-variant/40'}`} />
                {form.eligibilityMode === 'ALL' && (
                  <CheckCircle2 className="w-5 h-5 text-[#3cd7ff]" />
                )}
              </div>
              <p className="font-bold text-white text-sm mb-1">All Citizens</p>
              <p className="text-xs text-on-surface-variant/60 leading-relaxed">
                Every registered citizen can vote
              </p>
            </button>

            {/* Invite Link */}
            <button
              type="button"
              onClick={() => handleModeChange('INVITE')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                form.eligibilityMode === 'INVITE'
                  ? 'border-[#3cd7ff] bg-[#3cd7ff]/5'
                  : 'border-outline-variant/20 hover:border-outline-variant/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <LinkIcon className={`w-6 h-6 ${form.eligibilityMode === 'INVITE' ? 'text-[#3cd7ff]' : 'text-on-surface-variant/40'}`} />
                {form.eligibilityMode === 'INVITE' && (
                  <CheckCircle2 className="w-5 h-5 text-[#3cd7ff]" />
                )}
              </div>
              <p className="font-bold text-white text-sm mb-1">Invite Link</p>
              <p className="text-xs text-on-surface-variant/60 leading-relaxed">
                Share a link — anyone who opens it can vote
              </p>
            </button>

            {/* Specific Citizens */}
            <button
              type="button"
              onClick={() => handleModeChange('SPECIFIC')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                form.eligibilityMode === 'SPECIFIC'
                  ? 'border-[#3cd7ff] bg-[#3cd7ff]/5'
                  : 'border-outline-variant/20 hover:border-outline-variant/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Users className={`w-6 h-6 ${form.eligibilityMode === 'SPECIFIC' ? 'text-[#3cd7ff]' : 'text-on-surface-variant/40'}`} />
                {form.eligibilityMode === 'SPECIFIC' && (
                  <CheckCircle2 className="w-5 h-5 text-[#3cd7ff]" />
                )}
              </div>
              <p className="font-bold text-white text-sm mb-1">Specific Citizens</p>
              <p className="text-xs text-on-surface-variant/60 leading-relaxed">
                Select individual citizens from the list
              </p>
            </button>
          </div>

          {/* Info boxes */}
          {form.eligibilityMode === 'ALL' && (
            <div className="p-4 bg-[#3cd7ff]/5 border border-[#3cd7ff]/20 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-[#3cd7ff] shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                All registered citizens in the system will be able to see and vote in this election.
              </p>
            </div>
          )}

          {form.eligibilityMode === 'INVITE' && (
            <div className="p-4 bg-[#3cd7ff]/5 border border-[#3cd7ff]/20 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-[#3cd7ff] shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                A unique shareable link will be generated. Any registered citizen who opens the link will be automatically added to the eligible voters list.
              </p>
            </div>
          )}

          {/* Citizen Selector */}
          {form.eligibilityMode === 'SPECIFIC' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                  {selectedCitizens.length} Selected
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs font-bold text-[#3cd7ff] hover:text-white transition-colors px-3 py-1.5 bg-[#3cd7ff]/10 rounded-lg"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-bold text-on-surface-variant/60 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <input
                  type="text"
                  placeholder="Search citizens by name, email, or voter ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0a0f1c] text-white pl-10 pr-4 py-3 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm placeholder:text-on-surface-variant/30"
                />
              </div>

              <div className="max-h-80 overflow-y-auto bg-[#0a0f1c] rounded-xl border border-outline-variant/20">
                {loadingCitizens ? (
                  <div className="p-8 text-center text-on-surface-variant/50 text-sm">
                    Loading citizens...
                  </div>
                ) : filteredCitizens.length === 0 ? (
                  <div className="p-8 text-center text-on-surface-variant/50 text-sm">
                    No citizens found
                  </div>
                ) : (
                  filteredCitizens.map(citizen => (
                    <label
                      key={citizen.citizenId}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-outline-variant/10 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCitizens.includes(citizen.citizenId)}
                        onChange={() => toggleCitizen(citizen.citizenId)}
                        className="w-4 h-4 rounded border-outline-variant/30 bg-[#0a0f1c] text-[#3cd7ff] focus:ring-[#3cd7ff]/20 focus:ring-2"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{citizen.name}</p>
                        <p className="text-xs text-on-surface-variant/50 truncate">{citizen.email}</p>
                      </div>
                      <span className="text-xs font-mono text-on-surface-variant/40 shrink-0">{citizen.voterId}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/elections')}
            className="px-8 py-3.5 rounded-xl font-bold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (form.eligibilityMode === 'SPECIFIC' && selectedCitizens.length === 0)}
            className="flex-1 bg-[#3cd7ff] text-[#003642] py-3.5 rounded-xl font-black text-sm hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Election
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateElection;
