import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Key, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';

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
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-outline-variant/20'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant/50">Strength:</span>
        <span className={`text-xs font-bold ${score > 0 ? ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-[#05e777]'][score - 1] : ''}`}>
          {score > 0 ? labels[score - 1] : ''}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1">
        {checks.map((check, i) => (
          <div key={i} className={`flex items-center gap-1.5 text-xs ${check.pass ? 'text-[#05e777]' : 'text-on-surface-variant/40'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${check.pass ? 'bg-[#05e777]' : 'bg-outline-variant/30'}`} />
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new one.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'This reset link is invalid or has expired. Please request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a16] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#3cd7ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-white transition-colors text-sm font-medium mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-[#111827] rounded-3xl border border-outline-variant/20 p-10 shadow-2xl">
          {!success ? (
            <>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] mb-5">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Set New Password</h1>
                <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 max-w-xs">
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span>{error}</span>
                    {(error.includes('expired') || error.includes('invalid') || error.includes('Invalid')) && (
                      <div className="mt-2">
                        <Link to="/forgot-password" className="text-[#3cd7ff] font-bold hover:underline text-xs">
                          Request a new reset link →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!token ? null : (
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
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-[#0a0f1c] text-white pl-11 pr-12 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none transition-all placeholder:text-on-surface-variant/30 text-base font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrength password={newPassword} />
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
                        className={`w-full bg-[#0a0f1c] text-white pl-11 pr-12 py-3.5 rounded-xl border outline-none transition-all placeholder:text-on-surface-variant/30 text-base font-medium ${
                          confirmPassword && confirmPassword !== newPassword
                            ? 'border-red-500/50 focus:border-red-500/70'
                            : confirmPassword && confirmPassword === newPassword
                            ? 'border-[#05e777]/50 focus:border-[#05e777]/70'
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
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-400 mt-1.5">Passwords don't match</p>
                    )}
                    {confirmPassword && confirmPassword === newPassword && (
                      <p className="text-xs text-[#05e777] mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full bg-[#3cd7ff] text-[#003642] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 text-base mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-[#05e777]/10 border border-[#05e777]/20 flex items-center justify-center text-[#05e777] mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black mb-3">Password Reset!</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 max-w-xs mb-8">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#3cd7ff] text-[#003642] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all text-base"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
