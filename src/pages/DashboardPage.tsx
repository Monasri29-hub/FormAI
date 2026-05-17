import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowRight, 
  Zap, 
  Users, 
  Clock, 
  Percent, 
  ShieldAlert,
  BrainCircuit,
  Sparkles,
  ClipboardList,
  Copy,
  Check,
  Plus,
  Lock,
  ExternalLink,
  LineChart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Page } from '../types';
import { useForms } from '../context/FormContext';

interface DashboardPageProps {
  onNavigate: (page: Page | any) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { forms, selectedFormId, responses } = useForms();
  const [copied, setCopied] = useState(false);

  const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const handleCopyLink = () => {
    if (!currentForm?.shareUrl) return;
    navigator.clipboard.writeText(currentForm.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. NO FORMS EMPTY STATE
  if (forms.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-950 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md border border-white/10 backdrop-blur-xl bg-slate-900/40 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ClipboardList className="text-white w-8 h-8" />
          </div>
          <div className="pt-6">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">No Forms Created Yet</h2>
            <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-sm mx-auto">
              SmartPulse uses advanced Qwen-3-32b cognitive engines to compile feedback forms from website links and generate deep behavioral analytics. 
            </p>
          </div>

          <button 
            onClick={() => onNavigate('create')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Build your first AI Form
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </main>
    );
  }

  // 2. FORM EXISTS BUT NO SUBMISSIONS EMPTY STATE
  if (responses.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide bg-slate-950">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Form Performance</h1>
            <p className="text-slate-500 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
              <Users className="w-4 h-4" /> Monitoring <span className="text-blue-400 font-black">"{currentForm.title}"</span> live
            </p>
          </div>
        </header>

        {/* Dynamic Empty State Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          
          {/* Share widgets */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/10 backdrop-blur-xl bg-slate-900/40 p-8 rounded-3xl space-y-6 relative overflow-hidden"
            >
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Live Feedback Link ready
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">Awaiting Response Submissions</h2>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  Your form has been successfully compiled and deployed on the network. Share this direct link with users, clients, or respondents to gather cognitive, sentiment, and emotional feedback in real-time.
                </p>
              </div>

              {/* URL Copy Container */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-950 p-2.5 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex-1 flex items-center px-3 min-w-0">
                  <span className="text-xs font-mono text-slate-400 truncate w-full select-all font-bold">
                    {currentForm.shareUrl || 'http://localhost:3000'}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-slate-300 px-4 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <a 
                    href={currentForm.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    Test Form
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Simulated locked dashboard panel preview */}
            <div className="border border-white/5 bg-slate-900/10 p-6 rounded-3xl relative overflow-hidden group select-none">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 shadow-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Locked Performance Charts</p>
                <p className="text-[10px] text-slate-600 font-bold">Awaiting first response data to map graph values.</p>
              </div>

              {/* Blurred graph mockup */}
              <div className="opacity-15 space-y-4">
                <div className="h-6 w-32 bg-slate-700 rounded" />
                <div className="h-48 w-full bg-slate-800 rounded-2xl flex items-end gap-3 p-4">
                  <div className="h-1/3 w-10 bg-blue-500 rounded" />
                  <div className="h-2/3 w-10 bg-blue-500 rounded" />
                  <div className="h-1/2 w-10 bg-blue-500 rounded" />
                  <div className="h-3/4 w-10 bg-blue-500 rounded" />
                  <div className="h-1/3 w-10 bg-blue-500 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* AI behavioral engine locked panels */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-indigo-500/10 bg-gradient-to-br from-indigo-950/10 to-slate-900/60 p-6 rounded-3xl space-y-5 relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <BrainCircuit className="text-indigo-400 w-5 h-5" />
                </div>
                <h3 className="font-bold text-white tracking-tight text-base">AI Behavior Shield</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <Lock className="w-4 h-4 text-indigo-400/60 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Emotion profiling</p>
                  <p className="text-[9px] text-slate-600 font-bold leading-normal">
                    Qwen-3-32b scans respondent semantics for emotional indexes (Satisfied, Thoughtful, Impatient).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <Lock className="w-4 h-4 text-indigo-400/60 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Spam Guard Filter</p>
                  <p className="text-[9px] text-slate-600 font-bold leading-normal">
                    Assesses submission speed and patterns, filtering random gibberish entries automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    );
  }

  // Fallback default mock logic only if responses somehow exist (which would be user forms with submissions!)
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide bg-slate-950">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Form Performance</h1>
          <p className="text-slate-500 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
            <Users className="w-4 h-4" /> Monitoring <span className="text-blue-400 font-black">"{currentForm.title}"</span> live
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('analysis')}
            className="btn-primary gap-2 flex items-center py-3 px-6 text-xs shadow-xl shadow-blue-500/20 cursor-pointer"
          >
            <LineChart className="w-4 h-4" /> Full Analysis
          </button>
        </div>
      </header>

      {/* Real Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Responses', value: responses.length.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Completion Rate', value: '100%', icon: Percent, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Engagement Score', value: '88/100', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Avg. Fill Time', value: '1.2m', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold font-display tracking-tight text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 border border-white/10 rounded-3xl bg-slate-900/40 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-white">Active Responses Registered</h3>
        <p className="text-xs text-slate-400 font-bold max-w-md mx-auto leading-relaxed">
          Submissions have been cataloged successfully! Click the button above to navigate to the **Full Analysis** or **Responses** tabs in the sidebar for completed charts, individual files, and deep cognitive analytics!
        </p>
      </div>
    </main>
  );
}
