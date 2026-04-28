import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  Shield, 
  Wifi, 
  ShieldAlert, 
  Fingerprint, 
  Clock 
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, sendOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const loggedInUser = await verifyOtp(email, otp);
      
      if (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'ELECTION_MANAGER') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setResendLoading(true);
    try {
        await sendOtp(email);
        setMessage('OTP resent successfully.');
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
        setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a16] text-white font-body flex flex-col relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '48px 48px' 
        }}
      ></div>

      <main className="flex-grow z-10 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 p-6 lg:p-12 items-center">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-16">
              <div className="bg-[#1e293b] p-2.5 rounded-xl">
                <Lock className="w-6 h-6 text-[#3cd7ff]" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold font-headline tracking-wide">Online Voting Portal</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
              Validate Your <br/>
              <span className="text-[#3cd7ff]">Protocol Key</span>
            </h1>

            <p className="text-on-surface-variant text-lg lg:text-xl max-w-lg mb-12 leading-relaxed opacity-90">
              Identity validation in progress. Enter the 6-digit cryptographic sequence sent to <span className="text-white font-bold">{email}</span>.
            </p>

            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-white font-medium opacity-90">
                <Clock className="w-6 h-6 text-[#3cd7ff]" />
                <span className="tracking-wide">OTP valid for 10 minutes</span>
              </li>
              <li className="flex items-center gap-4 text-white font-medium opacity-90">
                <ShieldAlert className="w-6 h-6 text-[#05e777]" />
                <span className="tracking-wide">Multi-factor Authentication Required</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 border border-outline-variant/20 relative shadow-2xl">
              <Fingerprint className="absolute top-8 right-8 w-16 h-16 text-white/5" strokeWidth={1} />
              
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Identity Verification</h2>
              <p className="text-on-surface-variant text-sm mb-10 opacity-80">
                Finalizing secure node connection.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-4 text-center">
                    Enter 6-Digit Sequence
                  </label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="0 0 0 0 0 0" 
                    className="w-full bg-[#0a0f1c] text-white py-5 rounded-xl border border-transparent focus:border-[#3cd7ff]/50 focus:ring-1 focus:ring-[#3cd7ff]/50 outline-none transition-all placeholder:text-on-surface-variant/20 text-3xl font-black text-center tracking-[0.5em]" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-[#3cd7ff] text-[#003642] font-bold text-base py-4 rounded-xl hover:shadow-[0_0_20px_rgba(60,215,255,0.4)] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Finalize Authentication'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant opacity-80">
                  Didn't receive the key? <button onClick={handleResend} disabled={resendLoading} className="text-[#3cd7ff] font-bold hover:underline disabled:opacity-50">
                    {resendLoading ? 'Sending...' : 'Resend Protocol'}
                  </button>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="z-10 w-full py-10 bg-[#040710] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-sm text-on-surface-variant font-medium">
          <div className="text-[10px] text-on-surface-variant/40 tracking-wider">
            © 2024 Online Voting Portal. Secure & Scalable.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerifyOTP;
