import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bolt, 
  CheckCircle2, 
  X, 
  Bot, 
  ArrowUp, 
  PlusCircle, 
  CornerDownRight,
  Database,
  Zap,
  Info,
  Clock,
  FileText,
  FolderOpen,
  Link2,
  Mic,
  Search,
  Scan,
  Github,
  Braces,
  Play,
  RefreshCcw,
  User as UserIcon,
  Key
} from 'lucide-react';
import { INITIAL_MESSAGES, ChatMessage, OptimizationProposal } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AIProvider, RoutingMode, PROVIDERS } from '../types/orchestrator';
import { SmartRouter } from '../lib/orchestrator';
import { VaultModal } from '../components/VaultModal';
import TopBar from '../components/TopBar';

export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AIProvider.OPENAI);
  const [routingMode, setRoutingMode] = useState<RoutingMode>(RoutingMode.SMART);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSnapshot = () => {
    setIsSnapshotting(true);
    setIsMenuOpen(false);
    
    // Simulate capture
    setTimeout(() => {
      setIsSnapshotting(false);
      // Add a system-like message or just a toast-like effect
      const snapshotMsg: ChatMessage = {
        id: `snap-${Date.now()}`,
        role: 'user',
        content: "[INTERNAL_MEMORY_SNAPSHOT] Attached operational logs, agent health status, and sync latency metrics.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, snapshotMsg]);
    }, 8000);
  };

  const handleSend = async (type: string = 'Send') => {
    if (!inputValue.trim()) return;
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // Backend Orchestration Call
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: routingMode === RoutingMode.SMART ? SmartRouter.route(currentInput, []) : selectedProvider,
          model: 'auto',
          prompt: currentInput,
          messages: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Operational Error: Failed to route to provider. Check Secure Vault configuration or network status.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const getButtonMode = () => {
    if (inputValue.startsWith('/deploy')) return 'Deploy';
    if (inputValue.startsWith('/run')) return 'Run';
    if (inputValue.startsWith('/analyze')) return 'Analyze';
    if (inputValue.startsWith('/sync')) return 'Sync';
    return 'Send';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/20 overflow-hidden pt-16 relative">
      {/* Secure AI Vault Modal */}
      <VaultModal 
        isOpen={isVaultOpen} 
        onClose={() => setIsVaultOpen(false)} 
        onSave={(config) => {
          setIsVaultOpen(false);
          // logic to persist configuration
        }}
      />

      {/* Messages area (Memory Timeline) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-12 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Operational Continuity Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <LiveContextCard 
               title="Continue Corporate Insurance Analysis" 
               status="Drafting Report" 
               icon={FileText} 
               accent="primary"
             />
             <LiveContextCard 
               title="Resume Deployment Review" 
               status="Awaiting Approval" 
               icon={Zap} 
               accent="secondary"
             />
          </section>

          <div className="relative">
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-slate-200/60" />
            
            <div className="space-y-12">
              {messages.map((message) => (
                <div key={message.id} className="relative pl-12 group">
                  <div className={cn(
                    "absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center border z-10 transition-shadow",
                    message.role === 'user' ? "bg-white border-slate-200 shadow-sm" : "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  )}>
                    {message.role === 'user' ? <UserIcon className="w-5 h-5 text-slate-400" /> : <Bot className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {message.role === 'assistant' ? 'Intelligence Layer' : 'Operational Identity'}
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      {message.timestamp}
                    </div>

                    <div className={cn(
                      "max-w-3xl text-sm leading-relaxed",
                      message.role === 'user' ? "text-slate-600 font-medium" : "text-slate-800"
                    )}>
                      {message.content}
                    </div>

                    {message.optimizationProposal && (
                      <OptimizationProposalCard 
                        proposal={message.optimizationProposal} 
                        onViewDiff={() => navigate('/diff')}
                        onApprove={() => navigate('/success')}
                      />
                    )}

                    {message.isStreaming && (
                      <div className="flex items-center gap-3 py-2 px-4 bg-primary/5 rounded-xl border border-primary/10 w-fit">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:200ms]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:400ms]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Reasoning Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Provider Command Surface */}
      <div className="p-6 bg-white/40 backdrop-blur-2xl border-t border-slate-200/60 relative z-20">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Orchestrator Control Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/50">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvider(p.id);
                      setRoutingMode(RoutingMode.MANUAL);
                    }}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      selectedProvider === p.id && routingMode === RoutingMode.MANUAL
                        ? "bg-white text-primary shadow-sm border border-slate-200/50"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
                <button
                  onClick={() => setRoutingMode(RoutingMode.SMART)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                    routingMode === RoutingMode.SMART
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Zap className={cn("w-2.5 h-2.5", routingMode === RoutingMode.SMART && "animate-pulse")} />
                  Smart Route
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsVaultOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              <Key className="w-3 h-3 text-primary" />
              Secure Vault
            </button>
          </div>

          <div className="relative">
            <AnimatePresence>
              {isSnapshotting && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 bottom-full bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-30 mb-4"
                >
                  <RefreshCcw className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">Capturing Operational Context...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -8, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 mb-4 grid grid-cols-1 gap-1"
                >
                  <MenuButton icon={FileText} label="Attach File" />
                  <MenuButton icon={FolderOpen} label="Attach Folder" />
                  <MenuButton icon={Link2} label="Paste URL" />
                  <MenuButton icon={Mic} label="Record Voice" />
                  <MenuButton icon={Scan} label="Take Screenshot" />
                  <MenuButton icon={Github} label="Inject GitHub PR" />
                  <MenuButton icon={Braces} label="Add Memory Snapshot" onClick={handleSnapshot} />
                  <MenuButton icon={Play} label="Run Automation" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              "relative flex items-end gap-2 bg-slate-100/50 border border-slate-200/50 rounded-2xl p-2 transition-all group focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/20",
              isMenuOpen && "ring-4 ring-primary/5"
            )}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-xl transition-all",
                  isMenuOpen ? "bg-primary text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                )}
              >
                <PlusCircle className={cn("w-5 h-5 transition-transform", isMenuOpen && "rotate-45")} />
              </button>
              
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(getButtonMode());
                  }
                }}
                placeholder="What operation should continue? Type '/' for commands..."
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3.5 pr-4 resize-none min-h-[52px] max-h-48 scrollbar-hide font-medium"
              />

              <div className="flex items-center gap-2 pr-1 pb-1">
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSend(getButtonMode())}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "pill-button h-11 px-6 min-w-[100px] shadow-lg transition-all",
                    inputValue.trim() 
                      ? "bg-primary text-white hover:bg-primary-dark shadow-primary/20" 
                      : "bg-slate-200 text-slate-400 shadow-none grayscale opacity-50"
                  )}
                >
                  <span className="font-black uppercase tracking-widest text-[10px]">{getButtonMode()}</span>
                  <ArrowUp className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveContextCard({ title, status, icon: Icon, accent }: { title: string, status: string, icon: any, accent: 'primary' | 'secondary' }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="operational-card p-5 flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer group"
    >
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-5 transition-transform duration-500 group-hover:scale-150",
        accent === 'primary' ? "bg-primary" : "bg-secondary"
      )} />
      
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
          accent === 'primary' ? "bg-primary/5 border-primary/20 text-primary group-hover:bg-primary group-hover:text-white" : "bg-secondary/5 border-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-white"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           Live
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status}</p>
      </div>
    </motion.div>
  );
}

function MenuButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </button>
  );
}

function OptimizationProposalCard({ 
  proposal, 
  onViewDiff,
  onApprove 
}: { 
  proposal: OptimizationProposal;
  onViewDiff?: () => void;
  onApprove?: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="operational-card border-l-4 border-l-primary p-6 mt-4 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Bolt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">Optimization Proposal</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accessing Intelligence Memory</p>
          </div>
          <div className="ml-auto bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            {proposal.priority} Priority
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-1 text-slate-400 tracking-widest text-[9px] font-black uppercase">
            <p>Module</p>
            <div className="bg-slate-100 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 w-fit border border-slate-200">
              {proposal.module}
            </div>
          </div>
          <div className="space-y-1 text-right text-slate-400 tracking-widest text-[9px] font-black uppercase">
            <p>Context</p>
            <div className="bg-slate-100 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 w-fit ml-auto border border-slate-200">
              {proposal.context}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="p-4 bg-slate-50 rounded-xl text-sm leading-relaxed text-slate-600 border border-slate-200/50">
            {proposal.description}
          </p>
        </div>

        {proposal.diff && (
          <div className="bg-[#0f172a] rounded-xl overflow-hidden border border-slate-800 mb-6 font-mono text-[12px] shadow-2xl">
            <div className="p-4 space-y-1">
              {proposal.diff.remove.map((line, i) => (
                <div key={i} className="text-rose-400/80 flex gap-4 truncate">
                  <span className="opacity-20 select-none">-</span>
                  <span className="line-through">{line}</span>
                </div>
              ))}
              {proposal.diff.add.map((line, i) => (
                <div key={i} className="text-emerald-400 flex gap-4 truncate bg-emerald-500/10 -mx-4 px-4 border-l-2 border-emerald-500">
                  <span className="opacity-40 select-none">+</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={onApprove}
            className="pill-button flex-1 bg-primary text-white hover:bg-primary-dark shadow-primary/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-black uppercase tracking-widest text-[10px]">Approve Fix</span>
          </button>
          <button 
            onClick={onViewDiff}
            className="pill-button flex-1 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-none"
          >
            <span className="font-black uppercase tracking-widest text-[10px]">View Full Diff</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Keep User and UserCircle for existing code logic
function User({ className }: { className?: string }) {
  return (
    <div className={className}>
      <UserCircle className="w-full h-full" />
    </div>
  );
}

function UserCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
