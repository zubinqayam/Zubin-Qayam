import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Activity, BarChart3, ListChecks, Info, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ALGAReport, ALGAStatus } from '../types/alga';
import { cn } from '../lib/utils';

interface ALGAReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ALGAReport | null | undefined;
}

export function ALGAReportModal({ isOpen, onClose, report }: ALGAReportModalProps) {
  if (!isOpen || !report) return null;

  const getStatusColor = (status: ALGAStatus) => {
    switch (status) {
      case ALGAStatus.PASS: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case ALGAStatus.REVIEW: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case ALGAStatus.QUARANTINED: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      case ALGAStatus.REJECT: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const axisLabels = {
    accuracy: 'Artifact Accuracy',
    logic: 'Categorical Logic',
    governance: 'Sovereign Governance',
    alignment: 'Strategic Alignment'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest">Global Sovereign Audit</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Normalization & Enrichment Matrix (NEM) Validation Gate</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Left Column: Summary */}
            <div className="w-full md:w-[40%] p-8 bg-white space-y-8">
              <div className="text-center space-y-2">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 * (1 - report.compositeScore / 100)}
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        report.status === ALGAStatus.PASS ? "text-emerald-500" :
                        report.status === ALGAStatus.REVIEW ? "text-amber-500" :
                        "text-rose-500"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">{report.compositeScore}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Composite</span>
                  </div>
                </div>
                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mx-auto mt-4", getStatusColor(report.status))}>
                  <ShieldCheck className="w-3 h-3" />
                  Audit Status: {report.status}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Activity className="w-3 h-3" />
                   Matrix Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(report.axisScores).map(([key, score]) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wide text-slate-600">
                        <span>{axisLabels[key as keyof typeof axisLabels]}</span>
                        <span>{score}/100</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full transition-all",
                            score >= 90 ? "bg-emerald-500" :
                            score >= 70 ? "bg-amber-500" :
                            "bg-rose-500"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Evidence & Details */}
            <div className="flex-1 p-8 bg-white space-y-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
              {/* Claims / Evidence Map */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <ListChecks className="w-3 h-3 text-primary" />
                   Sovereign Evidence Map (SEM)
                </h3>
                <div className="space-y-2">
                  {report.claims.length > 0 ? report.claims.map((evidence, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                       <CheckCircle2 className={cn("w-3 h-3 mt-0.5 shrink-0", evidence.isVerified ? "text-emerald-500" : "text-amber-500")} />
                       <div className="space-y-1">
                         <p className="text-[11px] font-medium text-slate-600 leading-relaxed font-mono">
                           {evidence.claim}
                         </p>
                         <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{evidence.confidence * 100}% Confidence</span>
                           {evidence.source && <span className="text-[8px] font-black uppercase text-primary tracking-widest">Source: {evidence.source}</span>}
                         </div>
                       </div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 italic">No structured claims detected in current artifact.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Info className="w-3 h-3 text-primary" />
                   NEM Recommendations
                </h3>
                <div className="space-y-3">
                  {report.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-3 text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-primary/20 italic font-mono">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance Violations */}
              {report.governanceViolations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                     <ShieldAlert className="w-3 h-3" />
                     Policy Violations
                  </h3>
                  <div className="space-y-2">
                    {report.governanceViolations.map((violation, idx) => (
                      <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex gap-3">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {violation}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <BarChart3 className="w-4 h-4 text-slate-400" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sovereign Validation Engine v2.0.1</span>
            </div>
            <button 
              onClick={onClose}
              className="pill-button px-6 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black transition-all"
            >
              Acknowledge Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
