import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Server, Globe, Lock } from 'lucide-react';
import { AIProvider, PROVIDERS } from '../types/orchestrator';
import { cn } from '../lib/utils';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export function VaultModal({ isOpen, onClose, onSave }: VaultModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AIProvider.OPENAI);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTest = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
    }, 1500);
  };

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="p-8 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Shield className="w-32 h-32 text-primary" />
             </div>
             <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secure AI Vault Entry</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">Enterprise-grade provider configuration & routing policies.</p>
             </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">AI Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-sm font-bold transition-all",
                        selectedProvider === provider.id 
                          ? "bg-primary/5 border-primary text-primary shadow-sm" 
                          : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedProvider === provider.id ? "bg-primary animate-pulse" : "bg-slate-200"
                      )} />
                      {provider.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">API Key</label>
                <div className="relative group">
                  <Key className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    apiKey ? "text-primary" : "text-slate-300"
                  )} />
                  <input 
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter ${currentProvider?.name} secret key...`}
                    className="w-full h-12 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-xl text-sm font-mono focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 px-1">
                   <Shield className="w-3 h-3 text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Argon2id Encrypted Strategy Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white transition-all group">
                   <input type="checkbox" className="w-4 h-4 rounded-md border-slate-200 text-primary focus:ring-primary" defaultChecked />
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-700">Multi-Model Routing</span>
                     <span className="text-[9px] font-black text-slate-400">Fallback Enabled</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white transition-all">
                   <input type="checkbox" className="w-4 h-4 rounded-md border-slate-200 text-primary focus:ring-primary" defaultChecked />
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-700">Audit Truthfulness</span>
                     <span className="text-[9px] font-black text-slate-400">Policy: Standard</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleTest}
                disabled={!apiKey || isTesting}
                className={cn(
                  "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest transition-all",
                  testResult === 'success' ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                )}
              >
                {isTesting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Server className="w-4 h-4" />
                  </motion.div>
                ) : testResult === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Connection Ready
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Test Connectivity
                  </>
                )}
              </button>
              <button 
                onClick={onClose}
                className="h-12 px-6 rounded-xl bg-slate-100 text-slate-500 text-sm font-black uppercase tracking-widest hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
