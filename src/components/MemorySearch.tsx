import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Filter, 
  Calendar, 
  Cpu, 
  Layers, 
  Zap, 
  Clock, 
  ArrowRight,
  MessageSquare,
  Bot,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SearchFilters, SearchResult } from '../types/search';
import { MemoryEngine } from '../lib/search';
import { ChatMessage } from '../constants';

interface MemorySearchProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onResultClick: (id: string) => void;
}

export function MemorySearch({ isOpen, onClose, messages, onResultClick }: MemorySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    isSemantic: true,
    agentContext: [],
    projectScope: 'All'
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (filters.query.length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const found = MemoryEngine.search(messages, filters);
        setResults(found);
        setIsSearching(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [filters, messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                   <Search className="w-5 h-5" />
                 </div>
                 <div>
                   <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Memory Search</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Browse Contextual History</p>
                 </div>
               </div>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
              
              {/* Query Input */}
              <div className="space-y-3">
                 <div className="relative group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text"
                     placeholder="Search operational logs, agent logic..."
                     value={filters.query}
                     onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                     className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-medium text-sm"
                   />
                 </div>
                 <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, isSemantic: !prev.isSemantic }))}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        filters.isSemantic ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-100 text-slate-400 border border-slate-100"
                      )}
                    >
                      <Sparkles className="w-3 h-3" />
                      {filters.isSemantic ? 'Semantic Active' : 'Keyword Only'}
                    </button>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                      {results.length} Nodes Found
                    </span>
                 </div>
              </div>

              {/* Filters Section */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 px-1">
                   <Filter className="w-3 h-3 text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Context Filters</span>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-1 flex items-center gap-1.5">
                       <Calendar className="w-2.5 h-2.5" /> Date Start
                     </label>
                     <input 
                       type="date"
                       className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:border-primary/20"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-1 flex items-center gap-1.5">
                       <Cpu className="w-2.5 h-2.5" /> Agent Scope
                     </label>
                     <select className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:border-primary/20 appearance-none">
                        <option>All Agents</option>
                        <option>Orchestrator</option>
                        <option>Security-Bot</option>
                        <option>User</option>
                     </select>
                   </div>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-1 flex items-center gap-1.5">
                     <Layers className="w-2.5 h-2.5" /> Project Context
                   </label>
                   <div className="flex flex-wrap gap-2">
                      {['ZQ_COORDINATOR', 'INNM-WOSDS', 'OX_INTEL', 'ALL'].map(project => (
                        <button 
                          key={project}
                          onClick={() => setFilters(prev => ({ ...prev, projectScope: project }))}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                            filters.projectScope === project ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          )}
                        >
                          {project}
                        </button>
                      ))}
                   </div>
                 </div>
              </div>

              {/* Results List */}
              <div className="space-y-3 pt-2">
                 <div className="flex items-center justify-between px-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ranked Results</span>
                   {isSearching && <Zap className="w-3 h-3 text-primary animate-pulse" />}
                 </div>

                 <div className="space-y-3 pb-12">
                   {results.length > 0 ? (
                     results.map(result => (
                       <button
                         key={result.id}
                         onClick={() => onResultClick(result.id)}
                         className="w-full text-left p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group"
                       >
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               <div className={cn(
                                 "w-6 h-6 rounded-lg flex items-center justify-center",
                                 result.role === 'assistant' ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                               )}>
                                 {result.role === 'assistant' ? <Bot className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                 {result.context.agent}
                               </span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-bold text-slate-300">
                                 {Math.round(result.score * 100)}% Match
                               </span>
                               <Clock className="w-3 h-3 text-slate-200" />
                            </div>
                         </div>
                         <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                           {result.content}
                         </p>
                         <div className="mt-3 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                              {result.timestamp}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                         </div>
                       </button>
                     ))
                   ) : filters.query.length > 2 ? (
                     <div className="py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                           <MessageSquare className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching memory fragments</p>
                     </div>
                   ) : (
                     <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-300">
                        <Zap className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enter query to scan memory</span>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
               <div className="flex items-center gap-3 text-slate-400">
                 <Shield className="w-4 h-4" />
                 <span className="text-[9px] font-black uppercase tracking-widest">
                   Local Sync Privacy Active • Zero Cloud Leakage
                 </span>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
