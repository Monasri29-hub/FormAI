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
  ArrowLeft, 
  Zap, 
  Users, 
  Clock, 
  Percent, 
  Search,
  ShieldAlert,
  BrainCircuit,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Frown,
  AlertCircle,
  ThumbsUp,
  LineChart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Page } from '../types';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

const RESPONSE_DATA = [
  { day: 'Mon', responses: 120, quality: 85 },
  { day: 'Tue', responses: 180, quality: 90 },
  { day: 'Wed', responses: 450, quality: 75 },
  { day: 'Thu', responses: 300, quality: 88 },
  { day: 'Fri', responses: 600, quality: 82 },
  { day: 'Sat', responses: 400, quality: 95 },
  { day: 'Sun', responses: 250, quality: 92 },
];

const DROP_OFF_DATA = [
  { question: 'Name', dropoff: 5 },
  { question: 'Rating', dropoff: 12 },
  { question: 'Enjoyment', dropoff: 25 },
  { question: 'Improvements', dropoff: 68 }, // Problem question
  { question: 'Rec. Us', dropoff: 4 },
];

const EMOTION_DATA = [
  { name: 'Happy', value: 45, color: '#10b981' },
  { name: 'Neutral', value: 30, color: '#0ea5e9' },
  { name: 'Confused', value: 15, color: '#f59e0b' },
  { name: 'Frustrated', value: 10, color: '#ef4444' },
];

import { useForms } from '../context/FormContext';

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { forms, selectedFormId, responses } = useForms();
  const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const runDemo = () => {
    setIsDemoRunning(true);
    setTimeout(() => setIsDemoRunning(false), 3000);
  };

  return (
    <>
      {/* Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide bg-slate-950">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Form Performance</h1>
            <p className="text-slate-500 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
              <Users className="w-4 h-4" /> Monitoring <span className="text-blue-400 font-black">"{currentForm?.title || 'Student Experience Survey'}"</span> live
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('analysis')}
              className="btn-primary gap-2 flex items-center py-3 px-6 text-xs shadow-xl shadow-blue-500/20"
            >
              <LineChart className="w-4 h-4" /> Full Analysis
            </button>
            <div className="flex items-center gap-4 p-1 glass bg-white/5 rounded-2xl border border-white/5">
              <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-white/10 text-white">7 Days</button>
              <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">30 Days</button>
            </div>
          </div>
        </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Responses', value: responses.length.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+5%' },
              { label: 'Completion Rate', value: '84.2%', icon: Percent, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+12%' },
              { label: 'Engagement Score', value: '89/100', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+2%' },
              { label: 'Avg. Fill Time', value: '2.5m', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '-10s' },
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
                  <span className="text-[10px] font-bold text-emerald-400">{stat.trend}</span>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold font-display tracking-tight text-white">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Trend Chart */}
            <div className="lg:col-span-2 glass-card">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-xl mb-1 text-white">Response Velocity</h3>
                  <p className="text-xs text-slate-500">Live submission tracking across 7 days</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responses</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality</span></div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={RESPONSE_DATA}>
                    <defs>
                      <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="responses" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorResp)" />
                    <Area type="monotone" dataKey="quality" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="glass-card flex flex-col bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/20 shadow-indigo-500/5">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <BrainCircuit className="text-indigo-400 w-5 h-5" />
                </div>
                <h3 className="font-bold text-white tracking-tight text-xl">Behavior Engine</h3>
              </div>

              <div className="space-y-6 flex-1">
                 {/* Success Prediction */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                     <Sparkles className="w-12 h-12 text-blue-400" />
                  </div>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-4">Success Prediction</p>
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                        <circle className="text-blue-500" strokeWidth="6" strokeDasharray={176} strokeDashoffset={176 - (176 * 62) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">62%</div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 mb-1">+29% potential gain</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Reach <span className="text-white font-bold tracking-widest">91% SUCCESS</span> with AI recommended updates.</p>
                    </div>
                  </div>
                </div>

                {/* Question Drop-off Prediction */}
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3 text-red-400">
                    <div className="flex items-center gap-2 italic uppercase font-bold tracking-tighter"><AlertCircle className="w-4 h-4" /><span className="text-xs">Drop-off Warning</span></div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-red-500/20 rounded-full border border-red-500/30">CRITICAL</span>
                  </div>
                  <p className="text-[11px] text-red-100 font-medium leading-relaxed mb-1">
                    Question 4 is causing significant friction.
                  </p>
                  <p className="text-[10px] text-red-300/70 lowercase italic leading-relaxed">Reason: Cognitive load too high for mobile users.</p>
                </div>

                {/* Auto Improvement */}
                <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                   <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-400"><TrendingDown className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-widest">Smart Fixes</span></div>
                    <span className="text-[9px] font-bold text-indigo-300 animate-pulse">OPTIMIZING...</span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      'Simplify phrasing of Question 3',
                      'Shift identifier fields to section end',
                      'Enable partial auto-save for long entries'
                    ].map((tip, i) => (
                      <li key={i} className="text-[10px] text-slate-300 flex items-start gap-2 font-medium hover:text-white transition-colors cursor-default">
                        <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Emotion Distri */}
            <div className="lg:col-span-1 glass-card overflow-hidden">
              <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Emotion Sentiment</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={EMOTION_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" animationDuration={2000}>
                      {EMOTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 border-t border-white/5 pt-4">
                {EMOTION_DATA.map((e, i) => (
                  <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} /><span className="text-[10px] text-slate-400 font-bold uppercase">{e.name}</span></div><span className="text-[10px] font-bold text-white">{e.value}%</span></div>
                ))}
              </div>
            </div>

            {/* Drop-off Heatmap */}
            <div className="lg:col-span-2 glass-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500">Funnel Friction</h3>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] font-bold text-red-400">Live Alert</span></div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DROP_OFF_DATA} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="question" type="category" stroke="#64748b" fontSize={10} width={80} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="dropoff" radius={[0, 10, 10, 0]} animationDuration={1500}>
                      {DROP_OFF_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.dropoff > 50 ? '#ef4444' : '#3b82f6'} fillOpacity={entry.dropoff > 50 ? 0.8 : 0.4} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] font-medium border-t border-white/5 pt-4">
                <span className="text-slate-500">Status: Auto-Fixing Q.4...</span>
                <span className="text-blue-400 font-bold">Suggested Update Found</span>
              </div>
            </div>

            {/* Spam Detection */}
            <div className="lg:col-span-1 glass-card bg-slate-900/40">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-rose-400 w-4 h-4" />
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500">Spam Shield</h3>
                </div>
                <div className="text-[10px] font-extrabold text-blue-400">98.4% CLARITY</div>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'aaaaa', reason: 'Pattern: Repeated', id: 'User 422' },
                  { text: '123456789', reason: 'Pattern: Numeric', id: 'User 398' },
                  { text: 'test test test', reason: 'Pattern: Triple', id: 'User 385' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white/[0.03] rounded-xl border border-white/5 group hover:bg-rose-500/5 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-500">{item.id}</span>
                      <span className="text-[8px] font-bold text-rose-400 uppercase">Blocked</span>
                    </div>
                    <p className="text-xs font-mono text-slate-300 mb-1">"{item.text}"</p>
                    <p className="text-[9px] text-slate-500 italic opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Trigger: {item.reason}</p>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-[10px] font-extrabold text-slate-600 hover:text-blue-400 transition-colors uppercase tracking-widest mt-6 border-t border-white/5 pt-4">View Integrity Report</button>
            </div>
          </div>
        </main>

      {/* Floating Demo Overlay */}
      {isDemoRunning && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
        >
          <div className="glass p-12 rounded-[4rem] flex flex-col items-center gap-6 shadow-[0_0_100px_rgba(14,165,233,0.3)] border-brand-500/30">
            <div className="relative">
              <RefreshCw className="w-20 h-20 text-brand-500 animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold font-display mb-2">Simulating Live Traffic</h2>
              <p className="text-slate-400 text-sm">Feeding 50 fresh responses into AI behavioral engine...</p>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold"><ThumbsUp className="w-3 h-3" /> VALIDATING</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-[10px] font-bold"><BrainCircuit className="w-3 h-3" /> ANALYZING EMOTION</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold"><ShieldAlert className="w-3 h-3" /> FILTERING SPAM</div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
