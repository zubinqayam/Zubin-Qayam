import { Cpu, Zap, ShieldCheck, Database, History, RefreshCcw, Lock, AlertCircle, CheckCircle2, Activity, Heart, Target, Layers, TrendingUp, AlertTriangle, Shield, Settings2, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { AGENT_REGISTRY, AgentType } from '../types/agents';

import { ALGAEngine } from '../lib/alga';
import { ALGAStatus } from '../types/alga';
import { quarantineStore, QuarantinedItem } from '../lib/quarantine';
import { QuarantineManager } from './QuarantineManager';

export default function Coordinator() {
  const [activeAgents] = useState(AGENT_REGISTRY);
  const [quarantinedItems, setQuarantinedItems] = useState<QuarantinedItem[]>(quarantineStore.getAll());
  const [isQuarantineOpen, setIsQuarantineOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setQuarantinedItems(quarantineStore.getAll());
    window.addEventListener('zq_quarantine_update', handleUpdate);
    return () => window.removeEventListener('zq_quarantine_update', handleUpdate);
  }, []);

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case AgentType.INGESTION: return Database;
      case AgentType.VALIDATION: return CheckCircle2;
      case AgentType.COMPLIANCE: return Shield;
      case AgentType.RANKING: return Layers;
      case AgentType.FORECASTING: return TrendingUp;
      case AgentType.CONTRADICTION: return AlertTriangle;
      case AgentType.GOVERNANCE: return ShieldCheck;
      case AgentType.DEPLOYMENT: return Settings2;
      default: return Cpu;
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-screen fixed right-0 top-0 z-40 hidden xl:flex">
      <div className="p-6 h-16 flex items-center border-b border-slate-100">
        <h2 className="font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          ZQ Coordinator
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Operational Confidence */}
        <section className="space-y-4">
          <div className="px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Confidence Index</h3>
          </div>
          <div className="operational-card p-4 bg-gradient-to-br from-white to-slate-50/50">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-3xl font-black text-slate-900 leading-none">99.2</span>
                <span className="text-xs font-bold text-primary ml-1">%</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Optimal</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <ConfidenceMetric label="Logic Integrity" value={100} />
              <ConfidenceMetric label="Sync Latency" value={98} />
              <ConfidenceMetric label="Memory Cohesion" value={99} />
            </div>
          </div>
        </section>

        {/* Active Agent Mesh */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Agent Mesh</h3>
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">{activeAgents.length} Nodes</span>
          </div>
          <div className="space-y-2">
            {activeAgents.slice(0, 4).map(agent => (
              <AgentCard 
                key={agent.id}
                name={agent.name} 
                status={agent.status === 'active' ? 'active' : 'idle'} 
                task={agent.description} 
                duration="Live" 
                usage="0.0" 
                health={100}
                icon={getAgentIcon(agent.type)}
              />
            ))}
            <button className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors">
              View Full Mesh ({activeAgents.length} Agents)
            </button>
          </div>
        </section>
        
        {/* AI Infrastructure Health Rail */}
        <section className="space-y-4">
          <div className="px-2 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI Infrastructure</h3>
            <span className="text-[9px] font-bold text-primary flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 animate-pulse" />
              Live
            </span>
          </div>
          <div className="operational-card p-4 bg-[#0f172a] border-slate-800 space-y-4">
            <div className="space-y-3">
              <ProviderHealthStat 
                provider="OpenAI" 
                status="healthy" 
                latency={124} 
                fallback={false}
              />
              <ProviderHealthStat 
                provider="Claude" 
                status="healthy" 
                latency={240} 
                fallback={false}
              />
              <ProviderHealthStat 
                provider="Gemini" 
                status="degraded" 
                latency={850} 
                fallback={true}
              />
              <ProviderHealthStat 
                provider="Grok" 
                status="healthy" 
                latency={180} 
                fallback={false}
              />
            </div>
            
            <div className="pt-3 border-t border-slate-800 space-y-3">
               <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    <span>Provider Mesh</span>
                  </div>
                  <span className="text-secondary">Distributed</span>
               </div>
               <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-3 h-3 animate-spin-slow" />
                    <span>Cost Balance</span>
                  </div>
                  <span className="text-emerald-500">$2.42 Today</span>
               </div>
            </div>
          </div>
        </section>

        {/* Governance & Policy Matrix Rail */}
        <section className="space-y-4">
          <div className="px-2 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Policy Matrix (GPM)</h3>
            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Active
            </span>
          </div>
          <div className="operational-card p-4 bg-[#0f172a] border-emerald-900/40 space-y-4">
            {/* ALGA Health Monitor */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black uppercase text-slate-400">ALGA Health</span>
                 </div>
                 <span className="text-[10px] font-mono text-emerald-400">98.2%</span>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Accuracy</span>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Logic</span>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[96%] h-full bg-emerald-400" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Governance Health Matrix */}
            <section className="space-y-3 pt-2">
              <div className="px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Governance Matrix</h3>
              </div>
              <div className="operational-card p-4 bg-[#0f172a] border-primary/20 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                       <span className="text-[9px] font-black uppercase text-slate-300">Composite Health</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400">94.2%</span>
                 </div>
                 
                 <div className="space-y-2.5">
                    <div className="space-y-1">
                       <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase">
                          <span>Regional Compliance</span>
                          <span className="text-slate-300">92/100</span>
                       </div>
                       <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[92%]" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase">
                          <span>Logical Consistency</span>
                          <span className="text-slate-300">89/100</span>
                       </div>
                       <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[89%]" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase">
                          <span>Sovereign Alignment</span>
                          <span className="text-slate-300">96/100</span>
                       </div>
                       <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[96%]" />
                       </div>
                    </div>
                 </div>
              </div>
            </section>

            {/* Quarantine Monitor */}
            <button 
              onClick={() => setIsQuarantineOpen(true)}
              className={cn(
                "w-full p-3 rounded-xl border transition-all cursor-pointer text-left",
                quarantinedItems.length > 0 ? "bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:bg-rose-500/20" : "bg-white/5 border-white/10 opacity-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={cn("w-3 h-3", quarantinedItems.length > 0 ? "text-rose-500" : "text-slate-500")} />
                  <span className={cn("text-[9px] font-black uppercase tracking-widest", quarantinedItems.length > 0 ? "text-rose-500" : "text-slate-500")}>Quarantine</span>
                </div>
                <span className={cn("text-[10px] font-mono", quarantinedItems.length > 0 ? "text-rose-500" : "text-slate-500")}>{quarantinedItems.length}</span>
              </div>
              {quarantinedItems.length > 0 && (
                <p className="text-[7px] text-rose-400 font-bold uppercase leading-tight">
                  {quarantinedItems.length} Artifacts Isolated by Sovereign Gate
                </p>
              )}
            </button>

            {/* Runtime Observability Fabric */}
            <section className="space-y-3 pt-2">
              <div className="px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Observability Fabric</h3>
              </div>
              <div className="operational-card p-3 bg-[#0f172a] border-primary/20 space-y-3">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Activity className="w-3 h-3 text-primary" />
                     <span className="text-[8px] font-black uppercase text-slate-400">Live Traces</span>
                   </div>
                   <div className="flex gap-1">
                     <div className="w-1 h-3 bg-primary/20 rounded-full" />
                     <div className="w-1 h-3 bg-primary/40 rounded-full" />
                     <div className="w-1 h-3 bg-primary animate-pulse rounded-full" />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase">
                     <span>Sync Latency</span>
                     <span className="text-emerald-400">12ms</span>
                   </div>
                   <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase">
                     <span>Agent Consensus</span>
                     <span className="text-primary">Active (4/4)</span>
                   </div>
                   <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase">
                     <span>Memory Depth</span>
                     <span className="text-slate-300">1.4 TB</span>
                   </div>
                 </div>

                 <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary transition-all">
                   Open Trace Navigator
                 </button>
              </div>
            </section>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Sovereign Integrity</span>
                <span className="text-[9px] font-mono text-emerald-400">A+ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Risk Boundary</span>
                <span className="text-[9px] font-mono text-amber-400">0.14 Peak</span>
              </div>
              <div className="pt-2">
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                   <div className="w-[88%] h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="mt-1.5 flex justify-between items-center text-[7px] font-black text-slate-600 uppercase tracking-widest">
                  <span>Policy Coverage</span>
                  <span>88.2%</span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
               <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Audit Chain Replay</span>
               </div>
               <p className="text-[8px] text-slate-400 font-medium leading-relaxed">All 14 operational cycles since last login have cleared the local policy hash check.</p>
            </div>
          </div>
        </section>

        {/* Sync Pipeline */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sync Pipeline</h3>
            <div className="flex items-center gap-1.5 text-emerald-500">
               <RefreshCcw className="w-2.5 h-2.5 animate-spin-slow" />
               <span className="text-[9px] font-black uppercase tracking-widest">Live Syncing</span>
            </div>
          </div>
          <div className="operational-card overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-700">DB_CLUSTER_01</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-slate-400">ON_STATE</span>
                 </div>
              </div>
              <div className="flex gap-1 h-1">
                 {[1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,1].map((v, i) => (
                   <div key={i} className={cn("flex-1 rounded-full", v ? "bg-emerald-400/40" : "bg-slate-100")} />
                 ))}
              </div>
            </div>
            
            <div className="p-4 space-y-3">
               <SyncItem label="Pending Transactions" value="0x04" highlight />
               <SyncItem label="Sync Latency" value="12ms" />
               <SyncItem label="Last Consistency Check" value="1.2s ago" />
               <div className="pt-2 mt-2 border-t border-slate-50">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.1em] text-slate-300">
                    <span>Throughput Capacity</span>
                    <span className="text-secondary">82%</span>
                 </div>
                 <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      className="h-full bg-secondary"
                    />
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Security Readiness */}
        <section className="space-y-4">
          <div className="px-2 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Hardware</h3>
            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SecurityBadge icon={Lock} label="Encryption" active />
            <SecurityBadge icon={ShieldCheck} label="Audit Log" active />
            <SecurityBadge icon={CheckCircle2} label="JWT Valid" active />
            <SecurityBadge icon={AlertCircle} label="Keychain" />
          </div>
        </section>
      </div>

      {/* Audit Stream Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
         <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
               <History className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time Audit</span>
            </div>
            <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
               <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse [animation-delay:200ms]" />
               <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse [animation-delay:400ms]" />
            </div>
         </div>
         <div className="space-y-2">
            <AuditRow text="Memory snapshot indexed" time="10:44:02" />
            <AuditRow text="API request signature verified" time="10:43:58" />
         </div>
      </div>
      <QuarantineManager 
        isOpen={isQuarantineOpen}
        onClose={() => setIsQuarantineOpen(false)}
      />
    </aside>
  );
}

function AgentCard({ name, status, task, duration, usage, health, icon: Icon = Cpu }: { name: string, status: 'active' | 'idle' | 'error', task: string, duration: string, usage: string, health: number, icon?: any }) {
  const isActive = status === 'active';
  const isIdle = status === 'idle';
  const isError = status === 'error';

  return (
    <div className={cn(
      "operational-card p-3 space-y-3 relative overflow-hidden group transition-all",
      isIdle && "opacity-70"
    )}>
      {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}
      {isError && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="relative flex items-center justify-center">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-emerald-500" : isIdle ? "bg-slate-300" : "bg-red-500"
              )} />
              {isActive && (
                <div className="absolute w-full h-full rounded-full bg-emerald-500 animate-ping opacity-40" />
              )}
           </div>
           <span className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tight">{name}</span>
        </div>
        <Icon className={cn("w-3.5 h-3.5 transition-colors", isActive ? "text-primary" : "text-slate-300")} />
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
            <span>Current Task</span>
            {isActive && <Activity className="w-2.5 h-2.5 animate-pulse text-primary" />}
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
            <Target className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-[10px] font-bold text-slate-700 truncate">{task}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
               <Heart className={cn("w-2.5 h-2.5 fill-current", health > 95 ? "text-emerald-500" : "text-amber-500")} />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</span>
            </div>
            <span className={cn("text-[9px] font-black", health > 95 ? "text-emerald-500" : "text-amber-500")}>{health}%</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              className={cn("h-full", health > 95 ? "bg-emerald-500" : "bg-amber-500")}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
           {isActive && <span className="bg-primary/5 text-primary-dark px-1.5 py-0.5 rounded leading-none text-[8px] font-black uppercase tracking-widest">{usage} tokens</span>}
           {isActive && <span className="text-[9px] font-bold text-slate-400 ml-auto">{duration}</span>}
        </div>
      </div>
    </div>
  );
}

function SyncItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className={cn("font-bold", highlight ? "text-primary" : "text-slate-600")}>{value}</span>
    </div>
  );
}

function SecurityBadge({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={cn(
      "p-3 rounded-xl border flex flex-col gap-2 transition-all",
      active 
        ? "bg-white border-slate-200 shadow-sm" 
        : "bg-slate-50 border-slate-100 opacity-50 grayscale"
    )}>
      <Icon className={cn("w-4 h-4", active ? "text-emerald-500" : "text-slate-400")} />
      <span className="text-[10px] font-bold text-slate-600 truncate">{label}</span>
    </div>
  );
}

function AuditRow({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] text-slate-500 truncate">{text}</span>
      <span className="text-[9px] font-mono text-slate-300 shrink-0">{time}</span>
    </div>
  );
}

function ProviderHealthStat({ 
  provider, 
  status, 
  latency, 
  fallback 
}: { 
  provider: string, 
  status: 'healthy' | 'degraded' | 'down', 
  latency: number,
  fallback: boolean
}) {
  return (
    <div className="flex items-center justify-between group transition-all">
      <div className="flex items-center gap-2.5">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === 'healthy' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : status === 'degraded' ? "bg-amber-500" : "bg-rose-500"
        )} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{provider}</span>
      </div>
      <div className="flex items-center gap-3">
        {fallback && (
          <div className="px-1.5 py-0.5 bg-secondary/10 border border-secondary/20 rounded text-[7px] font-black text-secondary uppercase tracking-widest">
            Fallback
          </div>
        )}
        <span className="text-[9px] font-mono text-slate-500 italic">{latency}ms</span>
      </div>
    </div>
  );
}

function ConfidenceMetric({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
}
