import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Trash2, RotateCcw, 
  Search, Filter, AlertTriangle, Fingerprint, Activity,
  Check, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useForms } from '../context/FormContext';

export default function SpamFilterPage() {
  const { responses } = useForms();
  const spamResponses = responses.filter(r => r.isSpam || r.analysis.spamRisk > 70);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-slate-950 flex flex-col scrollbar-hide">
      <header className="mb-12 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <ShieldAlert className="text-rose-400 w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Spam Shield</h1>
           </div>
           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Monitoring live traffic for behavioral anomalies and bot patterns</p>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Integrity</span>
              <span className="text-2xl font-black text-emerald-400">98.4%</span>
           </div>
           <div className="w-px h-10 bg-white/10" />
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Blocked Today</span>
              <span className="text-2xl font-black text-rose-500">{spamResponses.length}</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
         {/* Queue */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-lg font-black text-white px-2">Verification Queue</h2>
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500/50 w-64"
                      placeholder="Search queue..."
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {spamResponses.length === 0 ? (
                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-10 text-center space-y-4">
                     <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                     <h3 className="text-base font-bold text-white">Database Integrity Pristine</h3>
                     <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                        No spam signatures, keyboard mash anomalies, or bot patterns have been detected. All response logs pass deep AI cognitive integrity validation.
                     </p>
                  </div>
                ) : (
                   spamResponses.map((r, i) => (
                  <motion.div 
                    key={r.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-rose-500/[0.02] hover:border-rose-500/20 transition-all"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 font-black text-xl border border-rose-500/20">
                           {r.userName.charAt(0)}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-white uppercase text-sm">{r.userName}</h3>
                              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[8px] font-black tracking-[0.2em]">{r.analysis.spamRisk}% RISK</span>
                           </div>
                           <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Behavioral Anomaly</span>
                              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> High Velocity</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 transition-all hover:text-white" title="Approve">
                           <Check className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 transition-all hover:text-white" title="Reject">
                           <X className="w-5 h-5" />
                        </button>
                     </div>
                   </motion.div>
                )))}
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-6">
            <div className="glass-card flex flex-col gap-8">
               <h2 className="text-xl font-black text-white mb-2">Automated Rules</h2>
               <div className="space-y-4">
                  {[
                    { label: 'Duplication Detection', desc: 'Identifies same user profiles', status: 'Active', icon: Fingerprint, color: 'text-blue-400' },
                    { label: 'Keyboard Mash Filter', desc: 'Blocks random text patterns', status: 'Active', icon: ShieldAlert, color: 'text-rose-400' },
                    { label: 'Velocity Threshold', desc: 'Max 3 submissions per IP/min', status: 'Active', icon: Activity, color: 'text-amber-400' },
                  ].map((rule, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <rule.icon className={cn("w-5 h-5", rule.color)} />
                       </div>
                       <div>
                          <div className="flex items-center justify-between mb-1">
                             <span className="text-[10px] font-black text-white uppercase tracking-tighter">{rule.label}</span>
                             <span className="text-[8px] font-bold text-emerald-400 uppercase">ON</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-tight">{rule.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-6 rounded-3xl bg-blue-600 flex flex-col items-center text-center gap-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-transparent opacity-50" />
                  <ShieldCheck className="w-12 h-12 text-white relative z-10 animate-pulse" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-1">Global Protection</h3>
                    <p className="text-xs text-blue-100 font-bold uppercase tracking-widest opacity-80">AI Behavioral Shield is Active</p>
                  </div>
                  <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] relative z-10 hover:scale-105 transition-transform shadow-2xl">Re-Verify All</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
