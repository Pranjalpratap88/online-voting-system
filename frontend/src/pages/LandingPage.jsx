import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="dark">
      {/* TopNavBar Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-lg shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between px-8 py-5 max-w-[1440px] mx-auto font-['Inter'] antialiased tracking-tight">
          <div className="text-2xl font-black tracking-tighter text-white uppercase">Online Voting Portal</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-[#00d4ff] font-bold border-b-2 border-[#00d4ff] pb-1 transition-all" href="#">Features</a>
            <a className="text-[#bbc9cf] hover:text-white px-2 py-1 transition-colors" href="#">How it Works</a>
            <a className="text-[#bbc9cf] hover:text-white px-2 py-1 transition-colors" href="#">Security</a>
            <a className="text-[#bbc9cf] hover:text-white px-2 py-1 transition-colors" href="#">Institutions</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="hidden lg:block text-[#bbc9cf] hover:text-white px-4 py-2 transition-all active:scale-[0.97]">Sign In</button>
            <button onClick={() => navigate('/register')} className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold active:scale-[0.97] transition-all">Launch Ballot</button>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section: The Digital Bastion */}
        <section className="relative min-h-[921px] flex items-center px-8 lg:px-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background"></div>
            <img 
              alt="abstract blockchain" 
              className="w-full h-full object-cover opacity-30" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW9ham_uZawtpsn7uow7xmQ8rldpaSyfmMx3jGUzI39H0tBtCx6iv-wL2I_Asl_QIr13ePQ-w3USNT3DcfU8SGDKkLRlkCODBm4-jBb5wIdB9q6zdLrsT35v0KAWphjPwOATaoJNOeN0uEOwrqkLxqURuszlsrUY6UyJ7T-PMY0ekbj85IR3Wb1c5JFFOcelSJmdc8GDj0ye2TCyScDgkEnV8H0nsKftY_4yvPbnXFC5NQddC3JcqtHFvSieT9F6DsMnFNjSqTxxzI" 
            />
          </div>
          <div className="relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/10 border border-secondary/20 rounded-full mb-8">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-secondary text-xs font-bold uppercase tracking-widest">Protocol V4.0 Active</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Democracy is Immutable</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Online Voting Portal leverages zero-knowledge proofs and decentralized consensus to deliver a voting platform that is cryptographically secure, mathematically verifiable, and entirely private.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/login')} className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-lg font-black text-lg active:scale-[0.97] transition-all">Launch Ballot</button>
              <button className="glass-panel text-white border border-outline-variant/30 px-10 py-5 rounded-lg font-bold hover:bg-surface-container-high transition-all">Explore Architecture</button>
            </div>
          </div>
        </section>

        {/* Stats: Tonal Architecture */}
        <section className="px-8 lg:px-24 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Total Volume</p>
              <h3 className="text-4xl font-black text-white">12.4M</h3>
              <p className="text-primary text-sm font-medium mt-1">Votes Secured Permanently</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Integrity Factor</p>
              <h3 className="text-4xl font-black text-white">100%</h3>
              <p className="text-secondary text-sm font-medium mt-1">Zero Breach History</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Network Nodes</p>
              <h3 className="text-4xl font-black text-white">8.2k+</h3>
              <p className="text-primary text-sm font-medium mt-1">Decentralized Validators</p>
            </div>
          </div>
        </section>

        {/* Features Section: Glassmorphism Bento */}
        <section className="px-8 lg:px-24 py-24 bg-surface-container-lowest">
          <div className="mb-16">
            <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase mb-4">Core Principles</h2>
            <h3 className="text-4xl font-black text-white tracking-tight">Engineered for Absolute Trust</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 glass-panel rounded-xl p-10 relative overflow-hidden group">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-4xl mb-6">security</span>
                <h4 className="text-2xl font-bold text-white mb-4">Cryptographic Integrity</h4>
                <p className="text-on-surface-variant max-w-md">Every ballot is cryptographically signed and hashed, creating a permanent audit trail that cannot be altered or deleted by any central authority.</p>
              </div>
              <img 
                alt="security background" 
                className="absolute right-0 bottom-0 w-1/2 opacity-20 group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz24OqlLCGPr-KOETrARu5VNtFe2xKa09waz1PQduTXXnzxH2JXHGRQqSeNxo16BVoK64Bq3l6qMh7Ffim74iqxVFkFbGJyIDUwj0D4sMqwdWWCTo_Ghz7CrOSEI3ydkKpclf2oCNt4PbS6CHCZrtfdBEn8uzhRgM6tB4caEYzO8oo-BNSVzhhvj9RIL4a7CAX05iTensuQo-6MCLSgtQYKU777zsnrkW3pE89wHVX5CVyqps3coGE1vzsV_7k8QELy5vlTIY6Tp24" 
              />
            </div>
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-10">
              <span className="material-symbols-outlined text-secondary text-4xl mb-6">visibility_off</span>
              <h4 className="text-2xl font-bold text-white mb-4">Zero-Knowledge Privacy</h4>
              <p className="text-on-surface-variant">Verify the validity of a vote without ever revealing the voter's identity or their specific selection. Mathematical privacy at scale.</p>
            </div>
            <div className="md:col-span-5 bg-surface-container-high rounded-xl p-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-6">update</span>
              <h4 className="text-2xl font-bold text-white mb-4">Real-time Transparency</h4>
              <p className="text-on-surface-variant">Watch the ledger update in real-time. Public observers can track network health and block finality through our open explorer.</p>
            </div>
            <div className="md:col-span-7 glass-panel rounded-xl p-10 relative overflow-hidden">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-4">Quantum-Resistant Layer</h4>
                  <p className="text-on-surface-variant max-w-sm">Built on lattice-based cryptography to ensure votes remain secure even against next-generation computing threats.</p>
                </div>
                <div className="mt-8 flex gap-2">
                  <div className="w-12 h-1 bg-primary rounded-full"></div>
                  <div className="w-8 h-1 bg-surface-variant rounded-full"></div>
                  <div className="w-8 h-1 bg-surface-variant rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works: Step-by-Step Tonal Hierarchy */}
        <section className="px-8 lg:px-24 py-32 bg-surface">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-5xl font-black text-white tracking-tighter mb-8 leading-tight">The Path to <br />Verification</h2>
              <p className="text-on-surface-variant mb-8">Four steps to absolute certainty. Our protocol eliminates the 'black box' of traditional voting systems.</p>
              <button className="text-primary font-bold inline-flex items-center gap-2 hover:gap-4 transition-all">
                Read Whitepaper <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="lg:w-2/3 space-y-12">
              {[
                { step: '01', title: 'Identity Attestation', desc: 'Voters use biometric or sovereign IDs to generate a unique, non-reversible cryptographic key on their local device.' },
                { step: '02', title: 'Encrypted Casting', desc: 'The ballot is homomorphically encrypted. The system can count the vote without ever decrypting it, preserving total secrecy.' },
                { step: '03', title: 'Consensus Validation', desc: 'Global nodes verify the cryptographic proof of the vote\'s validity before appending it to the immutable ledger.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container/20 transition-colors">
                    <span className="text-2xl font-black text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-2">{item.title}</h5>
                    <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Institutions Section: High-End Editorial */}
        <section className="px-8 lg:px-24 py-24 bg-surface-container-low">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-on-surface-variant tracking-[0.4em] uppercase mb-4">Trusted Institutions</h2>
            <div className="w-24 h-px bg-outline-variant/30 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              { name: 'NORDIC COUNCIL', tag: 'CERTIFIED PARTNER' },
              { name: 'GENEVA GROUP', tag: 'SECURITY AUDIT' },
              { name: 'PACIFIC ALLIANCE', tag: 'GOVERNANCE NODE' },
              { name: 'ETHEREUM FOUNDATION', tag: 'ECOSYSTEM GRANT' }
            ].map((inst, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4">
                <div className="text-xl font-black tracking-widest text-white">{inst.name}</div>
                <div className="text-[10px] text-primary tracking-[0.2em] font-bold">{inst.tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 lg:px-24 py-32">
          <div className="bg-gradient-to-br from-surface-container-low to-surface-container-highest rounded-2xl p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] -ml-32 -mb-32"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter relative z-10">Deploy Sovereignty Today.</h2>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-12 relative z-10">Whether for municipal elections or corporate governance, Online Voting Portal provides the infrastructure for unshakeable trust.</p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button onClick={() => navigate('/register')} className="bg-secondary text-on-secondary px-10 py-5 rounded-lg font-black text-lg active:scale-[0.97] transition-all">Execute Demo</button>
              <button className="bg-white/5 text-white px-10 py-5 rounded-lg font-bold hover:bg-white/10 transition-all">Contact Sales</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Navigation Shell */}
      <footer className="bg-[#060e20] border-t border-[#3c494e]/15">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full py-12 px-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-lg font-bold text-white">Online Voting Portal</div>
            <p className="font-['Inter'] text-sm uppercase tracking-widest text-[#bbc9cf]/60">© 2024 Online Voting Portal. Built on Immutable Architecture.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Inter'] text-sm uppercase tracking-widest text-[#bbc9cf]/60 hover:text-[#a8e8ff] hover:translate-x-1 transition-transform" href="#">Privacy Protocol</a>
            <a className="font-['Inter'] text-sm uppercase tracking-widest text-[#bbc9cf]/60 hover:text-[#a8e8ff] hover:translate-x-1 transition-transform" href="#">Security Whitepaper</a>
            <a className="font-['Inter'] text-sm uppercase tracking-widest text-[#bbc9cf]/60 hover:text-[#a8e8ff] hover:translate-x-1 transition-transform" href="#">Compliance</a>
            <a className="font-['Inter'] text-sm uppercase tracking-widest text-[#bbc9cf]/60 hover:text-[#a8e8ff] hover:translate-x-1 transition-transform" href="#">Contact Guard</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#00d4ff] text-xl cursor-pointer hover:scale-110 transition-transform">hub</span>
            <span className="material-symbols-outlined text-[#00d4ff] text-xl cursor-pointer hover:scale-110 transition-transform">language</span>
            <span className="material-symbols-outlined text-[#00d4ff] text-xl cursor-pointer hover:scale-110 transition-transform">shield</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
