import { 
  ChevronRight, 
  Bell, 
  Search,
  Command,
  LayoutDashboard,
  Terminal,
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface TopBarProps {
  onLogout?: () => void;
}

export default function TopBar({ onLogout }: TopBarProps) {
  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between w-full">
      <div className="flex items-center gap-3 text-sm font-display font-medium">
        <Layers className="w-4 h-4 text-primary" />
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Workspace</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-400">Project Alpha</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-primary-dark font-black tracking-tight bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/20">Operational Canvas</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence Memory... (⌘K)"
            className="w-full h-10 pl-10 pr-4 bg-slate-100/50 border border-slate-200/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none text-xs font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Sync Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50 group cursor-default">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-wider leading-none">Operational</span>
              <span className="text-[8px] font-bold text-emerald-600/60 leading-none mt-0.5">Trust: 99%</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all relative group">
            <Bell className="w-4 h-4 group-hover:text-slate-600" />
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border border-white" />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
            <Command className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20 cursor-pointer relative group"
            title="Log Out"
          >
            AR
            <div className="absolute -inset-1 bg-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
