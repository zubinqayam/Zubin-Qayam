import { useState } from 'react';
import { 
  FolderLock, 
  FileCode, 
  ChevronRight, 
  Star, 
  LayoutDashboard, 
  Settings, 
  CircleHelp,
  Clock,
  Plus,
  History,
  FolderOpen,
  Cpu,
  Brain,
  Zap,
  BookOpen,
  Blocks,
  ShieldCheck,
  Ship,
  Boxes
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { INITIAL_FILE_TREE, FileTreeNode } from '../constants';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Sidebar() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>(INITIAL_FILE_TREE);
  const location = useLocation();

  const NAV_ITEMS = [
    { label: 'Workspace', icon: LayoutDashboard, path: '/' },
    { label: 'Projects', icon: FolderOpen, path: '/projects' },
    { label: 'Agents', icon: Cpu, path: '/agents' },
    { label: 'Memory', icon: Brain, path: '/memory' },
    { label: 'Automations', icon: Zap, path: '/automations' },
    { label: 'Knowledge', icon: BookOpen, path: '/knowledge' },
    { label: 'Integrations', icon: Blocks, path: '/integrations' },
    { label: 'Audit', icon: ShieldCheck, path: '/audit' },
    { label: 'Deployments', icon: Ship, path: '/deployments' },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-400 flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-slate-800">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20"
        >
          <span className="font-display font-black text-xl tracking-tighter">ZQ</span>
        </motion.div>
        <div>
          <h1 className="font-display font-black text-white text-base leading-none tracking-tight">AI LOGIC™</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Operational OS</p>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.label}
              to={item.path} 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium group",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm" 
                  : "hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", location.pathname === item.path ? "text-primary" : "text-slate-500")} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Collections */}
        <div className="space-y-4">
          <div className="px-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Active Context</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">Project Alpha</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Critical Audit</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="p-4 border-t border-slate-800/50 space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-all text-xs font-medium">
          <Settings className="w-3.5 h-3.5" />
          Settings
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-all text-xs font-medium">
          <CircleHelp className="w-3.5 h-3.5" />
          Help Center
        </a>
      </div>
    </aside>
  );
}
