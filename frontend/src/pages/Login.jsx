import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  Shield, 
  Wifi, 
  Fingerprint, 
  AtSign, 
  Key, 
  Hexagon,
  Eye,
  EyeOff,
  ArrowRight,
  Mail
} from 'lucide-react';

const Login = () => {
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const loggedInUser = await login({ email, password });
      handleNavigation(loggedInUser);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials or unauthorized access');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email first');
      return;
    }
    setSendingOtp(true);
    try {
      await sendOtp(trimmedEmail);
      setOtpSent(true);
      setMessage('Verification code sent to your email. Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await verifyOtp(email, otp);
      handleNavigation(loggedInUser);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (user) => {
    if (user.role === 'ADMIN' || user.role === 'ELECTION_MANAGER') {
      navigate('/admin');
    } else if (user.needsPasswordSetup) {
      navigate('/dashboard/setup-password');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#060a16] text-white font-body flex flex-col relative overflow-hidden">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '48px 48px' 
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3cd7ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#05e777]/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-grow z-10 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 p-6 lg:p-12 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-16 group w-fit">
              <div className="bg-[#1e293b] p-2.5 rounded-xl group-hover:bg-[#3cd7ff]/10 transition-colors">
                <Lock className="w-6 h-6 text-[#3cd7ff]" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold font-headline tracking-wide">Online Voting Portal</span>
            </Link>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
              Secure <br/>
              <span className="text-[#3cd7ff]">Citizen Access</span>
            </h1>

            <p className="text-on-surface-variant text-lg lg:text-xl max-w-lg mb-12 leading-relaxed opacity-90">
              Access the national voting infrastructure. Your identity is verified through multi-factor authentication.
            </p>

            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-white font-medium opacity-90">
                <ShieldCheck className="w-6 h-6 text-[#05e777] shrink-0" />
                <span className="tracking-wide">End-to-end encrypted authentication</span>
              </li>
              <li className="flex items-center gap-4 text-white font-medium opacity-90">
                <Shield className="w-6 h-6 text-[#05e777] shrink-0" />
                <span className="tracking-wide">Role-based access control</span>
              </li>
              <li className="flex items-center gap-4 text-white font-medium opacity-90">
                <Wifi className="w-6 h-6 text-[#05e777] shrink-0" />
                <span className="tracking-wide">Real-time OTP verification</span>
              </li>
            </ul>
          </div>

          {/* Right Column — Login Card */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 border border-outline-variant/20 relative shadow-2xl">
              <Fingerprint className="absolute top-8 right-8 w-16 h-16 text-white/5" strokeWidth={1} />
              
              {/* Mode Toggle */}
              <div className="flex bg-[#0a0f1c] rounded-2xl p-1 mb-8 border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => { setIsOtpMode(false); setOtpSent(false); setError(''); setMessage(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isOtpMode ? 'bg-[#3cd7ff] text-[#003642]' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => { setIsOtpMode(true); setError(''); setMessage(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isOtpMode ? 'bg-[#3cd7ff] text-[#003642]' : 'text-on-surface-variant hover:text-white'}`}
                >
                  OTP Login
                </button>
              </div>

              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                {isOtpMode ? 'Login with OTP' : 'Welcome Back'}
              </h2>
              <p className="text-on-surface-variant text-sm mb-8 opacity-80">
                {isOtpMode ? 'We\'ll send a code to your registered email.' : 'Enter your credentials to continue.'}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-start gap-3">
                  <span className="shrink-0 mt-0.5">✓</span>
                  <span>{message}</span>
                </div>
              )}

              {/* Email field — shared */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2 opacity-70">
                  Email Address
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
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

              {!isOtpMode ? (
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase opacity-70">
                        Password
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs font-bold text-[#3cd7ff] hover:text-white transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••" 
                        className="w-full bg-[#0a0f1c] text-white pl-11 pr-12 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none transition-all placeholder:text-on-surface-variant/30 text-base font-medium tracking-widest" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3cd7ff] text-[#003642] font-bold text-base py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Sign In <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  {otpSent && (
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2 opacity-70">
                        Verification Code
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                        <input 
                          type="text" 
                          maxLength="6"
                          value={otp}
                          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit code" 
                          className="w-full bg-[#0a0f1c] text-white pl-11 pr-4 py-3.5 rounded-xl border border-outline-variant/20 focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/20 outline-none transition-all placeholder:text-on-surface-variant/30 text-xl font-black text-center tracking-[0.4em]" 
                        />
                      </div>
                      <p className="text-xs text-on-surface-variant/50 mt-2 text-center">
                        Didn't receive it?{' '}
                        <button type="button" onClick={handleSendOtp} className="text-[#3cd7ff] font-bold hover:underline">
                          Resend
                        </button>
                      </p>
                    </div>
                  )}

                  {!otpSent ? (
                    <button 
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp}
                      className="w-full bg-[#3cd7ff] text-[#003642] font-bold text-base py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {sendingOtp ? (
                        <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><Mail className="w-4 h-4" /> Send Verification Code</>
                      )}
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyOtp}>
                      <button 
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-[#3cd7ff] text-[#003642] font-bold text-base py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-[#003642] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-grow bg-outline-variant/15" />
                <span className="text-xs font-bold text-on-surface-variant/50 tracking-widest uppercase">New here?</span>
                <div className="h-px flex-grow bg-outline-variant/15" />
              </div>

              <Link 
                to="/register" 
                className="w-full flex items-center justify-center gap-3 bg-transparent border border-outline-variant/25 text-white font-bold py-3.5 rounded-xl hover:bg-white/5 hover:border-outline-variant/40 transition-all text-sm"
              >
                <Hexagon className="w-5 h-5 text-[#05e777]" /> 
                Create Citizen Account
              </Link>
            </div>
          </div>

        </div>
      </main>

      <footer className="z-10 w-full py-8 bg-[#040710] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 text-xs text-on-surface-variant/50">
          <span>© 2024 Online Voting Portal. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
