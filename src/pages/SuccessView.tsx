import { 
  CheckCircle2, 
  ArrowRight, 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Activity,
  History,
  Send,
  Sparkle,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function SuccessView() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/20 overflow-y-auto scrollbar-hide">
      <div className="max-w-5xl mx-auto px-6 py-12 w-full space-y-12 pb-32">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-emerald-100/50 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200/50 shadow-xl shadow-emerald-500/10"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="font-display font-black text-4xl text-slate-900 tracking-tight">Optimization Deployed</h1>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-sm font-medium">
              The operational delta has been merged. Production clusters are re-indexing memory traces for immediate continuity.
            </p>
          </div>
        </div>

        {/* Impact Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 operational-card p-10 flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
             <div className="relative z-10 space-y-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency Protocol Outcome</span>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-6xl font-black text-primary tracking-tighter">40%</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Performance gain</p>
                  </div>
                  <div>
                    <h3 className="text-6xl font-black text-secondary tracking-tighter">120ms</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Latency reduction</p>
                  </div>
                </div>
             </div>
             
             <div className="absolute bottom-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-16 h-16 text-primary" />
             </div>
          </div>

          <div className="operational-card p-8 bg-[#0f172a] border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Node Health</span>
            <div className="space-y-6">
              <HealthStat label="Latency" value="Stable" color="emerald" />
              <HealthStat label="Throughput" value="Active" color="emerald" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
               <Activity className="w-3.5 h-3.5" />
               Real-time Monitoring
            </div>
          </div>
        </div>

        {/* Tasks Log Card */}
        <div className="operational-card p-8 bg-white border-slate-100">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Execution Summary</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LogItem text="Redis caching cluster synchronized" />
              <LogItem text="API Key Vault encryption verified" />
              <LogItem text="Multi-model fallback route active" />
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="pill-button bg-primary text-white hover:bg-primary-dark shadow-primary/20">
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span className="font-black uppercase tracking-widest text-[10px]">View Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="pill-button bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="font-black uppercase tracking-widest text-[10px]">Operational Canvas</span>
          </button>
        </div>
      </div>

      {/* Floating Command Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <div className="glass-card shadow-2xl border border-slate-200/50 rounded-2xl px-6 py-4 flex items-center gap-4 group focus-within:ring-8 focus-within:ring-primary/5 transition-all">
          <Sparkle className="w-5 h-5 text-primary animate-pulse" />
          <input 
            type="text" 
            placeholder="Next operation: 'Analyze performance again in 24h'..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-700"
          />
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">
            <span className="opacity-60">⌘</span>K
          </div>
          <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all scale-95 hover:scale-100 shadow-lg shadow-primary/20">
             <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HealthStat({ label, value, color }: { label: string, value: string, color: 'emerald' | 'rose' }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={cn("text-[10px] font-black uppercase tracking-widest", color === 'emerald' ? "text-emerald-400" : "text-rose-400")}>
          {value}
        </span>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "85%" }}
          className={cn("h-full rounded-full transition-all duration-1000", color === 'emerald' ? "bg-primary" : "bg-accent")}
        />
      </div>
    </div>
  );
}

function LogItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100/50 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs font-bold text-slate-600">{text}</span>
    </div>
  );
}
