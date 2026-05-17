import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Users, 
  BrainCircuit, 
  ShieldAlert, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Plus,
  Trash2,
  Edit,
  LineChart as AnalysisIcon,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useForms } from '../context/FormContext';
import { Page } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: Page) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ currentPage, onNavigate, isCollapsed, setIsCollapsed }: SidebarProps) {
  const { forms, deleteForm, user, logout } = useForms();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analysis', icon: AnalysisIcon, label: 'Full Analysis' },
    { id: 'responses', icon: Users, label: 'Responses' },
    { id: 'insights', icon: BrainCircuit, label: 'AI Insights' },
    { id: 'spam', icon: ShieldAlert, label: 'Spam Filter' },
    { id: 'saved-forms', icon: FolderOpen, label: 'Saved Forms' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="border-r border-white/10 bg-slate-950/80 backdrop-blur-xl flex flex-col shrink-0 relative z-50 h-screen overflow-hidden"
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white border border-white/20 hover:scale-110 mb-transition shadow-lg shadow-blue-500/20"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className={cn("p-6 mb-4 flex items-center gap-3 overflow-hidden", isCollapsed ? "justify-center" : "")}>
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <Zap className="text-white w-6 h-6 fill-current" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-black tracking-tighter text-white"
          >
            SmartPulse <span className="text-blue-400">AI</span>
          </motion.span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative",
              currentPage === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", currentPage === item.id ? "text-white" : "text-slate-500 group-hover:text-blue-400")} />
            {!isCollapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
            
            {currentPage === item.id && !isCollapsed && (
              <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
            )}
          </button>
        ))}

        {/* Saved Forms Section */}
        <div className="pt-8 pb-4">
          {!isCollapsed && (
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 pl-4">Saved Forms</p>
          )}
          <div className="space-y-1.5">
            {forms.map((form) => (
              <div key={form.id} className="group relative">
                <button 
                  onClick={() => onNavigate('dashboard')} // In a real app this would load the specific form
                  className={cn(
                    "w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all",
                    "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                  )}
                >
                  <FolderOpen className="w-5 h-5 shrink-0 text-slate-600 group-hover:text-blue-400" />
                  {!isCollapsed && (
                    <div className="flex flex-col items-start truncate overflow-hidden">
                      <span className="text-sm font-bold truncate w-full">{form.title}</span>
                      <span className="text-[10px] text-slate-600 font-bold">{form.responsesCount} responses</span>
                    </div>
                  )}
                </button>
                
                {!isCollapsed && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md rounded-lg p-1 border border-white/5 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); onNavigate('create'); }} className="p-1.5 hover:text-blue-400"><Edit className="w-3 h-3" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteForm(form.id); }} className="p-1.5 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 mt-auto space-y-2">
        <button 
          onClick={() => onNavigate('create')}
          className={cn(
            "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer",
            isCollapsed ? "p-3" : "py-4"
          )}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>NEW FORM</span>}
        </button>

        {user && (
          <div className={cn("p-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 overflow-hidden", isCollapsed ? "justify-center" : "")}>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0 border border-white/10 text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-none">{user.name}</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mt-1">Admin</span>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={() => {
            logout();
            onNavigate('landing');
          }}
          className={cn(
            "w-full flex items-center gap-4 text-slate-500 hover:text-red-400 p-3.5 rounded-2xl transition-all cursor-pointer",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
