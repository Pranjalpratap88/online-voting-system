import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase,
  FileText, DollarSign, AlertCircle, CheckCircle2, Upload, Info
} from 'lucide-react';

const CandidateApplicationForm = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    party: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    education: '',
    occupation: '',
    previousPositions: '',
    criminalRecord: 'NONE',
    assetsValue: '',
    nominationFeePaid: false,
    nominationFeeReceiptNo: '',
    photoUrl: '',
    affidavitUrl: '',
    nominationFormUrl: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        assetsValue: form.assetsValue ? parseInt(form.assetsValue) : 0,
        electionId
      };

      await api.post('/candidates', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/admin/elections/${electionId}`);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#111827] border border-[#05e777]/30 rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-[#05e777]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#05e777]/30">
            <CheckCircle2 className="w-10 h-10 text-[#05e777]" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Application Submitted!</h2>
          <p className="text-on-surface-variant opacity-80 mb-2">
            Your candidature application has been submitted successfully.
          </p>
          <p className="text-sm text-on-surface-variant opacity-60 mb-8">
            It will be reviewed by the election commission. You'll be notified once approved.
          </p>
          <div className="bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 rounded-xl p-4 mb-8">
            <p className="text-xs text-on-surface-variant opacity-70">
              Redirecting to election details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div className="bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 rounded-2xl p-6 flex items-start gap-4">
        <Info className="w-5 h-5 text-[#3cd7ff] shrink-0 mt-0.5" />
        <div className="text-sm text-on-surface-variant opacity-80 leading-relaxed">
          <p className="font-bold text-white mb-2">Important Information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All fields marked with * are mandatory</li>
            <li>Your application will be reviewed by the election commission</li>
            <li>Nomination fee must be paid before final approval</li>
            <li>False information may lead to disqualification</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Full Name *
              </label>
              <input
                name="name"
                required
                type="text"
                placeholder="As per official documents"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Age *
              </label>
              <input
                name="age"
                required
                type="number"
                min="25"
                placeholder="Must be 25 or above"
                value={form.age}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Email Address *
              </label>
              <input
                name="email"
                required
                type="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Phone Number *
              </label>
              <input
                name="phone"
                required
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
              Residential Address *
            </label>
            <textarea
              name="address"
              required
              rows={2}
              placeholder="Complete address with city, state, and pincode"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Political Information */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Political & Professional Background
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Party Affiliation
              </label>
              <input
                name="party"
                type="text"
                placeholder="Independent or Party Name"
                value={form.party}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Education Qualification
              </label>
              <input
                name="education"
                type="text"
                placeholder="Highest degree"
                value={form.education}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Current Occupation
              </label>
              <input
                name="occupation"
                type="text"
                placeholder="Your profession"
                value={form.occupation}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Assets Value (in Lakhs)
              </label>
              <input
                name="assetsValue"
                type="number"
                min="0"
                placeholder="Total assets value"
                value={form.assetsValue}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
              Previous Political Positions
            </label>
            <textarea
              name="previousPositions"
              rows={2}
              placeholder="List any previous political positions held (if any)"
              value={form.previousPositions}
              onChange={handleChange}
              className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
              Election Manifesto / Platform Statement
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe your vision and agenda for this election..."
              value={form.description}
              onChange={handleChange}
              className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Legal Declaration */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" /> Legal Declaration
          </h3>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
              Criminal Record Status *
            </label>
            <select
              name="criminalRecord"
              required
              value={form.criminalRecord}
              onChange={handleChange}
              className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
            >
              <option value="NONE">No Criminal Record</option>
              <option value="PENDING_CASES">Pending Cases</option>
              <option value="CONVICTED">Convicted</option>
            </select>
          </div>
        </div>

        {/* Nomination Fee */}
        <div className="bg-[#111827] rounded-2xl border border-outline-variant/20 p-6 space-y-5">
          <h3 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Nomination Fee
          </h3>

          <div className="flex items-center gap-3 p-4 bg-[#0a0f1c] rounded-xl border border-outline-variant/20">
            <input
              type="checkbox"
              name="nominationFeePaid"
              checked={form.nominationFeePaid}
              onChange={handleChange}
              className="w-5 h-5 rounded border-outline-variant/30 bg-[#0a0f1c] text-[#3cd7ff] focus:ring-[#3cd7ff]/20 focus:ring-2"
            />
            <label className="text-sm text-white font-medium">
              I have paid the nomination fee (₹10,000 for General / ₹5,000 for SC/ST)
            </label>
          </div>

          {form.nominationFeePaid && (
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mb-2 block">
                Receipt Number
              </label>
              <input
                name="nominationFeeReceiptNo"
                type="text"
                placeholder="Enter payment receipt number"
                value={form.nominationFeeReceiptNo}
                onChange={handleChange}
                className="w-full bg-[#0a0f1c] text-white px-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 outline-none text-sm"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/admin/elections/${electionId}`)}
            className="px-8 py-3.5 rounded-xl font-bold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#3cd7ff] text-[#003642] py-3.5 rounded-xl font-black text-sm hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Nomination
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateApplicationForm;
