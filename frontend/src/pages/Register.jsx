import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { 
  Lock, 
  ShieldCheck, 
  Shield, 
  UserPlus, 
  AtSign, 
  Key, 
  User,
  Phone,
  Hash,
  MapPin,
  Briefcase,
  Users
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    aadhaarId: '',
    role: 'CITIZEN'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...formData,
        age: parseInt(formData.age)
      });
      // Redirect to verification page with email in query params
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your data.');
    } finally {
      setLoading(false);
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

      <main className="flex-grow z-10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="flex flex-col sticky top-12">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-[#1e293b] p-2.5 rounded-xl">
                <Lock className="w-6 h-6 text-[#3cd7ff]" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold font-headline tracking-wide">Online Voting Portal</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
              Create Your <br/>
              <span className="text-[#3cd7ff]">Digital ID</span>
            </h1>

            <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed opacity-90">
              Register now to participate in secure, transparent elections. Your identity is protected by cutting-edge cryptographic protocols.
            </p>

            <div className="space-y-6">
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                    <ShieldCheck className="w-8 h-8 text-[#05e777] shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Authenticated Identity</h3>
                        <p className="text-on-surface-variant text-sm opacity-70">Aadhaar-linked verification ensures "One Citizen, One Vote".</p>
                    </div>
                </div>
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                    <Users className="w-8 h-8 text-[#3cd7ff] shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Role-Based Access</h3>
                        <p className="text-on-surface-variant text-sm opacity-70">Choose between Citizen or Election Manager registration.</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl bg-[#111827] rounded-3xl p-8 border border-outline-variant/20 relative shadow-2xl">
              <UserPlus className="absolute top-8 right-8 w-16 h-16 text-white/5" strokeWidth={1} />
              
              <h2 className="text-3xl font-bold mb-8 tracking-tight">Registration Protocol</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full name as per ID" className="form-input-custom" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Age</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input type="number" name="age" required min="18" value={formData.age} onChange={handleChange} placeholder="18+" className="form-input-custom" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Gender</label>
                  <select name="gender" required value={formData.gender} onChange={handleChange} className="form-input-custom appearance-none">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input type="tel" name="phone" required pattern="[6-9][0-9]{9}" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile" className="form-input-custom" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="citizen@example.com" className="form-input-custom" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Aadhaar ID</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input type="text" name="aadhaarId" required pattern="\d{12}" maxLength="12" value={formData.aadhaarId} onChange={handleChange} placeholder="12-digit UID" className="form-input-custom" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                    <textarea name="address" required value={formData.address} onChange={handleChange} placeholder="Complete address for eligibility mapping" className="form-input-custom min-h-[100px] py-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Account Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <select name="role" required value={formData.role} onChange={handleChange} className="form-input-custom pl-12 appearance-none">
                      <option value="CITIZEN">Citizen</option>
                      <option value="ELECTION_MANAGER">Election Manager</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-2">Access Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input type="password" name="password" required={formData.role === 'ELECTION_MANAGER'} value={formData.password} onChange={handleChange} placeholder="Secure key" className="form-input-custom" />
                  </div>
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="submit" disabled={loading} className="w-full bg-[#3cd7ff] text-[#003642] font-black text-lg py-5 rounded-xl hover:shadow-[0_0_30px_rgba(60,215,255,0.4)] transition-all active:scale-[0.98] disabled:opacity-50">
                    {loading ? 'Initializing Protocol...' : 'Register Account'}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant opacity-80">
                  Already registered? <Link to="/login" className="text-[#3cd7ff] font-bold hover:underline">Authenticate Node</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-input-custom {
          width: 100%;
          background-color: #0a0f1c;
          color: white;
          padding-left: 3rem;
          padding-right: 1rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-radius: 0.75rem;
          border: 1px solid transparent;
          outline: none;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .form-input-custom:focus {
          border-color: rgba(60, 215, 255, 0.5);
          box-shadow: 0 0 0 1px rgba(60, 215, 255, 0.5);
        }
        select.form-input-custom {
          padding-left: 1rem;
        }
        select.form-input-custom.pl-12 {
          padding-left: 3rem;
        }
      `}} />
    </div>
  );
};

export default Register;
