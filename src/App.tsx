/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Coordinator from './components/Coordinator';
import FloatingConfig from './components/FloatingConfig';
import ChatView from './pages/ChatView';
import DiffView from './pages/DiffView';
import SuccessView from './pages/SuccessView';
import LoginView from './pages/LoginView';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('zq_auth');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsInitializing(true);
    setTimeout(() => {
      setIsInitializing(false);
      setIsAuthenticated(true);
      localStorage.setItem('zq_auth', 'true');
    }, 4500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('zq_auth');
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <LoginView key="login" onLogin={handleLogin} />
        ) : isInitializing ? (
          <motion.div 
            key="init"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 z-[110] flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-8 text-center">
               <div className="relative inline-flex">
                 <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                   <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 animate-ping group-hover:animate-none" />
                   <RefreshCcw className="w-10 h-10 animate-spin" />
                 </div>
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-black text-white tracking-tight uppercase">Initializing Protocol</h2>
                 <p className="text-slate-400 text-sm font-medium tracking-wide">Synchronizing provider mesh and securing operational vault...</p>
               </div>
               <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '100%' }}
                   transition={{ duration: 4 }}
                   className="h-full bg-primary shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                 />
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex w-full h-screen overflow-hidden bg-surface-bg">
            <Sidebar />
            
            <main className="flex-1 ml-64 mr-0 xl:mr-80 flex flex-col relative h-full transition-all">
              <TopBar onLogout={handleLogout} />
              
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={
                      <motion.div 
                        key="canvas"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="h-full w-full"
                      >
                        <ChatView />
                      </motion.div>
                    } />
                    
                    <Route path="/diff" element={
                      <motion.div 
                        key="diff"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full w-full"
                      >
                        <DiffView />
                      </motion.div>
                    } />
                    
                    <Route path="/success" element={
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="h-full w-full"
                      >
                        <SuccessView />
                      </motion.div>
                    } />
                  </Routes>
                </AnimatePresence>
              </div>

              <FloatingConfig />
            </main>

            <Coordinator />
          </div>
        )}
      </AnimatePresence>
    </Router>
  );
}
