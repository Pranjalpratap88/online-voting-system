import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';
import { 
  User, Mail, Phone, MapPin, Shield, Edit3, Save, X, 
  CheckCircle2, Hash, Info, Calendar, Key, Eye, EyeOff,
  BadgeCheck, AlertCircle, Lock
} from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">{label}</label>
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-[#3cd7ff]/50 shrink-0" />
      <span className={`text-white font-semibold text-sm ${mono ? 'font-mono tracking-wider' : ''}`}>
        {value || <span className="text-on-surface-variant/30 italic font-normal">Not provided</span>}
      </span>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/citizens/profile');
        setCitizen(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/citizen/profile', {
        phone: formData.phone,
        address: formData.address,
        state: formData.state,
        pincode: formData.pincode,
        bio: formData.bio,
      });
      setCitizen(res.data);
      setFormData(res.data);
      setIsEditing(false);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdMessage('');

    if (!currentPassword) {
      setPwdError('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setPwdError('New password must be different from current password.');
      return;
    }

    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', { 
        currentPassword,
        newPassword, 
        confirmPassword 
      });
      setPwdMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdMessage(''), 4000);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-[#3cd7ff] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3cd7ff]/20 to-[#3cd7ff]/5 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] text-2xl font-black shadow-lg">
            {citizen?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{citizen?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 rounded-full text-[10px] font-black text-[#3cd7ff] uppercase tracking-widest">
                {user?.role}
              </span>
              <span className="text-xs text-[#05e777] flex items-center gap-1 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-[#111827] border border-outline-variant/20 text-white px-5 py-2.5 rounded-xl hover:bg-white/5 hover:border-outline-variant/35 transition-all font-bold text-sm"
          >
            <Edit3 className="w-4 h-4 text-[#3cd7ff]" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setIsEditing(false); setFormData(citizen); setError(''); }}
              className="p-2.5 bg-[#111827] border border-outline-variant/20 text-on-surface-variant/60 rounded-xl hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <button 
              onClick={handleUpdate}
              disabled={saving}
              className="flex items-center gap-2 bg-[#3cd7ff] text-[#003642] px-5 py-2.5 rounded-xl font-black text-sm disabled:opacity-60 hover:shadow-[0_0_15px_rgba(60,215,255,0.3)] transition-all"
            >
              {saving ? <div className="w-4 h-4 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-xl text-green-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="bg-[#111827] rounded-2xl border border-outline-variant/15 p-6">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Identity Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoRow icon={User} label="Full Name" value={citizen?.name} />
              <InfoRow icon={Mail} label="Email Address" value={citizen?.email} />
              <InfoRow icon={Hash} label="Voter ID" value={citizen?.voterId} mono />
              <InfoRow icon={Shield} label="Aadhaar ID" value={citizen?.aadhaarId ? `XXXX XXXX ${citizen.aadhaarId.slice(-4)}` : null} mono />
            </div>
          </div>

          {/* Editable Info */}
          <div className="bg-[#111827] rounded-2xl border border-outline-variant/15 p-6">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest mb-5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Contact & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Phone Number</label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all"
                      placeholder="10-digit number"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#3cd7ff]/50 shrink-0" />
                    <span className="text-white font-semibold text-sm">{citizen?.phone || <span className="text-on-surface-variant/30 italic font-normal">Not provided</span>}</span>
                  </div>
                )}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state || ''}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all"
                    placeholder="Your state"
                  />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#3cd7ff]/50 shrink-0" />
                    <span className="text-white font-semibold text-sm">{citizen?.state || <span className="text-on-surface-variant/30 italic font-normal">Not provided</span>}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address || ''}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all min-h-[80px] resize-none"
                    placeholder="Your full address"
                  />
                ) : (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#3cd7ff]/50 shrink-0 mt-0.5" />
                    <span className="text-white font-semibold text-sm leading-relaxed">{citizen?.address || <span className="text-on-surface-variant/30 italic font-normal">Not provided</span>}</span>
                  </div>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.pincode || ''}
                    onChange={e => setFormData({...formData, pincode: e.target.value})}
                    className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all"
                    placeholder="6-digit pincode"
                  />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Hash className="w-4 h-4 text-[#3cd7ff]/50 shrink-0" />
                    <span className="text-white font-semibold text-sm">{citizen?.pincode || <span className="text-on-surface-variant/30 italic font-normal">Not provided</span>}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-[#111827] rounded-2xl border border-outline-variant/15 p-6">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> About
            </h3>
            {isEditing ? (
              <textarea
                value={formData.bio || ''}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all min-h-[100px] resize-none"
                placeholder="Write a brief bio about yourself..."
              />
            ) : (
              <p className="text-white/70 text-sm leading-relaxed">
                {citizen?.bio || <span className="text-on-surface-variant/30 italic">No bio added yet. Click Edit Profile to add one.</span>}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="bg-[#111827] rounded-2xl border border-outline-variant/15 p-6">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest mb-5">Account Details</h3>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Member Since</label>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#3cd7ff]/50" />
                  <span className="text-white font-semibold text-sm">
                    {citizen?.registrationDate ? new Date(citizen.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Account Type</label>
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#3cd7ff]/50" />
                  <span className="text-white font-semibold text-sm">{citizen?.createdSource === 'CSV' ? 'Pre-registered' : 'Self-registered'}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[#05e777] text-xs font-bold">
                  <BadgeCheck className="w-4 h-4" />
                  Identity Verified
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#111827] rounded-2xl border border-outline-variant/15 p-6">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Change Password
            </h3>

            {pwdMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {pwdMessage}
              </div>
            )}
            {pwdError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {pwdError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Current Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl pl-9 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors">
                    {showCurrentPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">New Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl pl-9 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-[#3cd7ff]/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors">
                    {showNewPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Confirm Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full bg-[#0a0f1c] border rounded-xl pl-9 pr-10 py-2.5 text-white text-sm focus:outline-none transition-all ${
                      confirmPassword && confirmPassword !== newPassword ? 'border-red-500/40' :
                      confirmPassword && confirmPassword === newPassword ? 'border-[#05e777]/40' :
                      'border-outline-variant/20 focus:border-[#3cd7ff]/50'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors">
                    {showConfirmPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={pwdLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-[#0a0f1c] border border-[#3cd7ff]/25 text-[#3cd7ff] py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3cd7ff]/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {pwdLoading ? <div className="w-4 h-4 border-2 border-[#3cd7ff] border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
