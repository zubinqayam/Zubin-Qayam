import { 
  FileCode, 
  ChevronRight, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Code,
  Github,
  Zap,
  Layout,
  Search,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';

const CHANGED_FILES = [
  { id: '1', name: 'controllers/user_controller.rb', added: 12, removed: 4, type: 'rb' },
  { id: '2', name: 'models/user.rb', added: 5, removed: 0, type: 'rb' },
  { id: '3', name: 'config/redis.yml', added: 3, removed: 1, type: 'yml' },
  { id: '4', name: 'services/auth_service.ts', added: 8, removed: 2, type: 'ts' },
  { id: '5', name: 'package.json', added: 2, removed: 0, type: 'json' },
];

export default function DiffView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState('1');

  const fileTypes = useMemo(() => {
    const types = new Set(CHANGED_FILES.map(f => f.type));
    return Array.from(types);
  }, []);

  const filteredFiles = useMemo(() => {
    return CHANGED_FILES.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || file.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const activeFile = CHANGED_FILES.find(f => f.id === activeFileId);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/20 overflow-hidden">
      {/* Diff Header */}
      <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Protocol: Development <ChevronRight className="w-3 h-3" /> Delta Review
            </div>
            <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">API Optimization Phase 1</h2>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="pill-button bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-none">
            <XCircle className="w-4 h-4 text-accent" />
            <span className="font-black uppercase tracking-widest text-[10px]">Reject Policy</span>
          </button>
          <button 
            onClick={() => navigate('/success')}
            className="pill-button bg-primary text-white hover:bg-primary-dark shadow-primary/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-black uppercase tracking-widest text-[10px]">Apply Optimization</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer (Side) */}
        <div className="w-80 border-r border-slate-200/60 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Changed Entities ({filteredFiles.length})</span>
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter memory nodes..."
                className="w-full h-9 pl-9 pr-4 bg-slate-100/50 border border-slate-200/50 rounded-xl text-xs outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 px-0.5">
              <FilterChip label="All" active={selectedType === null} onClick={() => setSelectedType(null)} />
              {fileTypes.map(type => (
                <FilterChip key={type} label={`.${type}`} active={selectedType === type} onClick={() => setSelectedType(type)} />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {filteredFiles.length > 0 ? (
              filteredFiles.map(file => (
                <FileItem 
                  key={file.id}
                  name={file.name} 
                  added={file.added} 
                  removed={file.removed} 
                  active={activeFileId === file.id}
                  onClick={() => setActiveFileId(file.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center space-y-3 opacity-50">
                <FileCode className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empty Trace</p>
              </div>
            )}
          </div>
        </div>

        {/* Code Diff area */}
        <div className="flex-1 bg-[#0f172a] text-slate-300 overflow-hidden flex flex-col relative shadow-inner">
          <div className="h-10 px-4 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500">
              <FileCode className="w-3.5 h-3.5 text-secondary" />
              <span className="text-slate-400 tracking-tight">{activeFile?.name || 'No selection'}</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +{activeFile?.added || 0}
              </div>
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                -{activeFile?.removed || 0}
              </div>
              <Activity className="w-3.5 h-3.5 text-slate-600 animate-pulse-soft" />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto font-mono text-[13px] p-6 scrollbar-hide">
             <div className="space-y-0.5">
                {activeFileId === '1' ? (
                  <>
                    <CodeLine num={42} content="def show" />
                    <CodeLine num={43} content="  @user = User.find(params[:id])" />
                    <CodeLine num={44} content="@posts = @user.posts" variant="remove" />
                    <CodeLine num={45} content="@comments = @user.comments" variant="remove" />
                    <CodeLine num={44} content="+ @posts = Rails.cache.fetch('user_posts', expires_in: 1.hr) do" variant="add" />
                    <CodeLine num={45} content="+   @user.posts.includes(:author, :tags).to_a" variant="add" />
                    <CodeLine num={46} content="+ end" variant="add" />
                    <CodeLine num={47} content="  " />
                    <CodeLine num={48} content="end" />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                    <p>Load Artifact Details on Canvas</p>
                  </div>
                )}
             </div>
          </div>

          {/* Watermark */}
          <div className="absolute bottom-4 right-6 opacity-5 pointer-events-none">
             <span className="font-display font-black text-6xl tracking-tighter">ZQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
        active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

function FileItem({ 
  name, 
  added, 
  removed, 
  active,
  onClick 
}: { 
  name: string, 
  added: number, 
  removed: number, 
  active?: boolean,
  onClick: () => void
}) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "px-3 py-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 group relative overflow-hidden",
        active ? "bg-white border border-slate-200/60 shadow-sm" : "hover:bg-slate-100/50"
      )}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
        active ? "bg-primary/5 text-primary" : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
      )}>
        <FileCode className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={cn("block text-xs truncate font-bold tracking-tight", active ? "text-slate-900" : "text-slate-500")}>
          {name}
        </span>
        <div className="flex gap-2 mt-1">
           <div className="flex gap-1 text-[9px] font-black uppercase tracking-widest">
             <span className="text-emerald-500">+{added}</span>
             <span className="text-rose-400">-{removed}</span>
           </div>
        </div>
      </div>
      <ChevronRight className={cn("w-3.5 h-3.5 transition-all", active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
    </motion.div>
  );
}

function CodeLine({ num, content, variant }: { num: number, content: string, variant?: 'add' | 'remove' }) {
  return (
    <div className={cn(
      "flex gap-4 -mx-4 px-4 group transition-colors",
      variant === 'add' ? "bg-emerald-500/10 border-l-2 border-emerald-500/50" : 
      variant === 'remove' ? "bg-rose-500/10 border-l-2 border-rose-500/50" : "hover:bg-slate-800/50"
    )}>
      <span className="w-8 text-right select-none opacity-20 group-hover:opacity-40">{num}</span>
      <span className={cn(
        "whitespace-pre",
        variant === 'add' ? "text-emerald-400" : 
        variant === 'remove' ? "text-rose-400 line-through" : "text-slate-400"
      )}>
        {variant === 'add' ? '+' : variant === 'remove' ? '-' : ' '} {content}
      </span>
    </div>
  );
}
