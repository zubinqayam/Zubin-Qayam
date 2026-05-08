import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, Github, Mail, Fingerprint } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] [animation-delay:2s] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="p-10 pb-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 text-white shadow-xl mb-2 relative group">
              <Shield className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Protocol</h1>
              <p className="text-slate-500 font-medium">Verify identity to initialize orchestration.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.ai"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all",
                isLoading && "opacity-80 cursor-wait"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="bg-white px-4">Trusted Providers</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="h-12 rounded-xl border border-slate-100 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                 <Github className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
               </button>
               <button type="button" className="h-12 rounded-xl border border-slate-100 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                 <Fingerprint className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">SSO</span>
               </button>
            </div>
          </form>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Secured by Enterprise Vault Core • Argon2id
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
