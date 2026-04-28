import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[#05e777]'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-outline-variant/20'}`} />
        ))}
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-on-surface-variant/50">Strength:</span>
        <span className={`text-xs font-bold ${score > 0 ? ['text-red-400','text-orange-400','text-yellow-400','text-[#05e777]'][score-1] : ''}`}>
          {score > 0 ? labels[score - 1] : ''}
        </span>
      </div>
    </div>
  );
};

const SetupPassword = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/setup-password', { 
        newPassword: password,
        confirmPassword: confirmPassword
      });
      
      // Update local user state — password is now set
      const updatedUser = { ...user, needsPasswordSetup: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping — mark locally so they aren't redirected again this session
    const updatedUser = { ...user, needsPasswordSetup: false };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#060a16] flex items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#3cd7ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#111827] rounded-3xl border border-outline-variant/20 p-10 shadow-2xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] mb-5">
            <Shield className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#05e777]/10 border border-[#05e777]/20 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#05e777] animate-pulse" />
            <span className="text-[10px] font-black text-[#05e777] uppercase tracking-widest">Identity Verified</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Set Your Password</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed opacity-80">
            Welcome, <span className="text-white font-bold">{user?.name}</span>! Create a password to enable quick sign-in next time.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">
              New Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-[#0a0f1c] border border-outline-variant/20 rounded-xl pl-11 pr-12 py-3.5 text-white focus:outline-none focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 transition-all font-medium placeholder:text-on-surface-variant/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">
              Confirm Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input 
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className={`w-full bg-[#0a0f1c] border rounded-xl pl-11 pr-12 py-3.5 text-white focus:outline-none transition-all font-medium placeholder:text-on-surface-variant/30 ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-500/50'
                    : confirmPassword && confirmPassword === password
                    ? 'border-[#05e777]/50'
                    : 'border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-xs text-red-400 mt-1.5">Passwords don't match</p>
            )}
            {confirmPassword && confirmPassword === password && (
              <p className="text-xs text-[#05e777] mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#3cd7ff] text-[#003642] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-60 text-base"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Set Password & Continue</>
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full mt-3 py-3 text-on-surface-variant/50 hover:text-white text-sm font-medium transition-colors"
        >
          Skip for now — I'll use OTP login
        </button>

        <p className="text-center text-xs text-on-surface-variant/30 mt-4">
          You can always set or change your password from your profile settings.
        </p>
      </div>
    </div>
  );
};

export default SetupPassword;
