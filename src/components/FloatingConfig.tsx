import { useState, useEffect } from 'react';
import { Key, X, ChevronRight, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function FloatingConfig() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('ZQ_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey) return;
    localStorage.setItem('ZQ_API_KEY', apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('ZQ_API_KEY');
    setApiKey('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="candy-card w-80 p-6 border-l-8 border-l-secondary shadow-2xl relative overflow-hidden pointer-events-auto"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16" />
             
             <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 leading-tight tracking-tight">System Access</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Credential Management</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">API Key Hole</label>
                  <div className="relative group flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Key className="w-4 h-4 text-slate-300 group-focus-within:text-secondary transition-colors" />
                      </div>
                      <input 
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-...."
                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none text-sm font-mono"
                      />
                    </div>
                    {apiKey && (
                      <button 
                        onClick={handleClear}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all border border-slate-200 hover:border-rose-200"
                        title="Clear Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    Key will be securely stored in the local session for authorized execution traces.
                  </p>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={!apiKey || isSaved}
                  className={cn(
                    "pill-button w-full h-12 transition-all shadow-lg",
                    isSaved 
                      ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                      : "bg-secondary text-white hover:bg-secondary-dark shadow-secondary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  )}
                >
                  {isSaved ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {isSaved ? "Authorization Active" : "Initialize Token"}
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 pointer-events-auto group",
          isOpen 
            ? "bg-slate-900 text-white border-slate-800 rotate-90 scale-90" 
            : "bg-primary text-white hover:scale-110 active:scale-95 shadow-primary/30"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
             <Key className="w-7 h-7 animate-bounce-subtle" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-primary group-hover:scale-150 transition-transform" />
          </div>
        )}
      </button>
    </div>
  );
}
