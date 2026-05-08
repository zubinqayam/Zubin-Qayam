import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X, Trash2, FileText, Clock, Smartphone, Info, RefreshCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { quarantineStore, QuarantinedItem } from '../lib/quarantine';
import { ALGAReportModal } from './ALGAReportModal';
import { cn } from '../lib/utils';

interface QuarantineManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuarantineManager({ isOpen, onClose }: QuarantineManagerProps) {
  const [items, setItems] = useState<QuarantinedItem[]>(quarantineStore.getAll());
  const [selectedItem, setSelectedItem] = useState<QuarantinedItem | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setItems(quarantineStore.getAll());
    window.addEventListener('zq_quarantine_update', handleUpdate);
    return () => window.removeEventListener('zq_quarantine_update', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handlePurge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    quarantineStore.remove(id);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to purge all quarantined artifacts? This action is irreversible.')) {
      quarantineStore.clear();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[80vh]"
        >
          {/* Header */}
          <div className="p-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Quarantine Manager</h2>
                <div className="flex items-center gap-3 mt-1">
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Isolated Operational Artifacts</p>
                   <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full uppercase">{items.length} Pending Actions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-rose-100"
              >
                <Trash2 className="w-4 h-4" />
                Purge All
              </button>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* List Sidebar */}
            <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
               <div className="p-4">
                  <div className="relative">
                     <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Search isolated records..."
                       className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                     />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                       <CheckCircle2 className="w-12 h-12 text-emerald-200" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Infrastructure Sanitized</p>
                    </div>
                  ) : items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all group relative overflow-hidden",
                        selectedItem?.id === item.id 
                          ? "bg-white border-rose-200 shadow-xl shadow-rose-500/5 ring-1 ring-rose-500/20" 
                          : "bg-white border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3 text-slate-400" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <button 
                          onClick={(e) => handlePurge(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-md transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 line-clamp-2 mb-3 leading-tight uppercase font-mono">
                        {item.originalContent.substring(0, 80)}...
                      </p>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5 font-mono text-[10px] font-black text-rose-500">
                           <ShieldAlert className="w-3 h-3" />
                           SCORE: {item.report.compositeScore}
                         </div>
                         <Smartphone className="w-3 h-3 text-slate-300" />
                      </div>
                      {selectedItem?.id === item.id && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-rose-500" />
                      )}
                    </button>
                  ))}
               </div>
            </div>

            {/* Content View */}
            <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-hide">
               {selectedItem ? (
                 <div className="max-w-2xl mx-auto space-y-8 pb-12">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Artifact Disposition</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Smartphone className="w-3 h-3" />
                          Source: {selectedItem.sourceDevice}
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          {new Date(selectedItem.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsReportOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                        >
                           <ShieldCheck className="w-4 h-4 text-primary" />
                           View Audit
                        </button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Info className="w-3 h-3" />
                        Isolation Evidence
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm text-slate-600 leading-relaxed whitespace-pre-wrap selection:bg-rose-100 selection:text-rose-900">
                         {selectedItem.originalContent}
                      </div>
                   </div>

                   <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3">
                         <ShieldAlert className="w-5 h-5 text-rose-500" />
                         <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Policy Enforcement Triggered</span>
                      </div>
                      <p className="text-xs font-medium text-rose-600 leading-relaxed">
                         This artifact was automatically isolated by the ALGA Gate due to a critical policy violation in the Governance axis ({selectedItem.report.axisScores.governance}/100).
                      </p>
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
                          <RefreshCcw className="w-4 h-4" />
                          Re-Evaluate with High Override
                        </button>
                        <button 
                          onClick={() => {
                            quarantineStore.remove(selectedItem.id);
                            setSelectedItem(null);
                          }}
                          className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Purge Record
                        </button>
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200">
                       <FileText className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Select an Artifact</h3>
                      <p className="text-xs text-slate-400 font-medium">Review isolated operational data across the federated node stack.</p>
                    </div>
                 </div>
               )}
            </div>
          </div>

          <ALGAReportModal 
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            report={selectedItem?.report!}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
