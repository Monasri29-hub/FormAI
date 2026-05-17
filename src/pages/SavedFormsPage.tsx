import React from 'react';
import { motion } from 'motion/react';
import { 
  FolderOpen, Plus, Search, Filter, MoreVertical, 
  Trash2, Edit, ExternalLink, Activity, Eye, Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useForms } from '../context/FormContext';
import { Page } from '../types';

export default function SavedFormsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { forms, deleteForm } = useForms();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyLink = (form: any) => {
    // Generate secure link using active browser origin
    const secureUrl = `${window.location.origin}/?fill=${form.id}`;
    navigator.clipboard.writeText(secureUrl)
      .then(() => {
        setCopiedId(form.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => console.error('Failed to copy secure link:', err));
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-slate-950 scrollbar-hide">
      <header className="mb-12 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <FolderOpen className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Your Forms</h1>
           </div>
           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Manage and monitor all your active data collection assets</p>
        </div>
        <button 
          onClick={() => onNavigate('create')}
          className="btn-primary flex items-center gap-3 px-8"
        >
           <Plus className="w-5 h-5" /> Create New Form
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {forms.map((form, i) => (
          <motion.div 
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card group hover:border-blue-500/30 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
               <div className={cn(
                 "px-3 py-1 rounded-full text-[8px] font-black tracking-[0.2em] uppercase border",
                 form.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-white/10"
               )}>
                 {form.status}
               </div>
               <div className="flex gap-2">
                  <button onClick={() => onNavigate('create')} className="p-2 text-slate-600 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteForm(form.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>

            <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">{form.title}</h3>
            <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{form.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Responses</p>
                  <p className="text-lg font-black text-white">{form.responsesCount}</p>
               </div>
               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Created</p>
                  <p className="text-xs font-black text-slate-400 mt-1.5">{new Date(form.createdAt).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
               <button 
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
               >
                 <Activity className="w-4 h-4" /> Open Dashboard
               </button>
               <button 
                 onClick={() => handleCopyLink(form)}
                 className={cn(
                   "px-4 py-3 rounded-xl transition-all border font-bold text-xs uppercase flex items-center gap-2",
                   copiedId === form.id 
                     ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                     : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
                 )}
                 title="Copy secure form fill URL"
               >
                 {copiedId === form.id ? 'Copied!' : <ExternalLink className="w-4 h-4" />}
               </button>
            </div>
          </motion.div>
        ))}

        {/* Create Placeholder */}
        <button 
          onClick={() => onNavigate('create')}
          className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:text-blue-500 transition-all">
             <Plus className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] group-hover:text-slate-300">Create Another Form</span>
        </button>
      </div>
    </div>
  );
}
