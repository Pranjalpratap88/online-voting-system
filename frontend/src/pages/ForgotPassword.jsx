import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      // Even on error, show success to prevent email enumeration
      // Only show error for network/server failures
      if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a16] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#3cd7ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Back link */}
        <Link to="/login" className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-white transition-colors text-sm font-medium mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-[#111827] rounded-3xl border border-outline-variant/20 p-10 shadow-2xl">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] mb-5">
                  <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Forgot Password?</h1>
                <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 max-w-xs">
                  No worries. Enter your registered email and we'll send you a reset link.
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
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#0a0f1c] text-white pl-11 pr-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none transition-all placeholder:text-on-surface-variant/30 text-base font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3cd7ff] text-[#003642] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-on-surface-variant/50 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-[#3cd7ff] font-bold hover:underline">Sign in</Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-[#05e777]/10 border border-[#05e777]/20 flex items-center justify-center text-[#05e777] mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black mb-3">Check Your Email</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 max-w-xs mb-2">
                If an account exists for <span className="text-white font-bold">{email}</span>, we've sent a password reset link.
              </p>
              <p className="text-on-surface-variant/50 text-xs mb-8">
                The link expires in 30 minutes. Check your spam folder if you don't see it.
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={() => { setSubmitted(false); setEmail(''); }}
                  className="w-full bg-[#0a0f1c] border border-outline-variant/20 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition-all text-sm"
                >
                  Try a different email
                </button>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center bg-[#3cd7ff] text-[#003642] font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all text-sm"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
