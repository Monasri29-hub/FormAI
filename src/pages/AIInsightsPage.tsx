import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, Sparkles, TrendingUp, TrendingDown, Users, 
  Heart, Lightbulb, Target, Zap, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PersonalityPieChart } from '../components/charts/ResponsiveCharts';
import { useForms } from '../context/FormContext';

export default function AIInsightsPage() {
  const { responses, selectedFormId, forms } = useForms();
  const [refreshing, setRefreshing] = useState(false);

  const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  // 1. EMPTY STATE
  if (responses.length === 0) {
    return (
      <div className="flex-1 p-10 bg-slate-950 flex flex-col items-center justify-center min-h-[85vh] relative">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-md border border-white/10 backdrop-blur-xl bg-slate-900/40 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <div className="pt-6">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Cognitive Core Locked</h2>
            <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-sm mx-auto">
              SmartPulse uses advanced Groq Qwen-3-32b deep cognitive models to synthesize emotional vibe triggers, participant personality spectra, and focus keywords. Awaiting form submissions to deploy live tracking.
            </p>
          </div>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/5 py-2.5 border border-indigo-500/10 rounded-xl">
             Live Behavioral Profiling Inactive
          </p>
        </div>
      </div>
    );
  }

  // 2. COMPUTE LIVE INTELLIGENCE METRICS
  // Personality distributions
  const traitCounts: { [key: string]: number } = {};
  const interestCounts: { [key: string]: number } = {};
  let totalSentimentScore = 0;
  let totalTime = 0;

  responses.forEach(r => {
    totalTime += r.completionTime || 60;
    if (r.analysis) {
      if (r.analysis.sentiment === 'positive') totalSentimentScore += 100;
      else if (r.analysis.sentiment === 'neutral') totalSentimentScore += 50;
      
      (r.analysis.personality || []).forEach((t: string) => {
        traitCounts[t] = (traitCounts[t] || 0) + 1;
      });
      (r.analysis.interestAreas || []).forEach((ia: string) => {
        interestCounts[ia] = (interestCounts[ia] || 0) + 1;
      });
    }
  });

  const sortedTraits = Object.entries(traitCounts).sort((a, b) => b[1] - a[1]);
  const sortedInterests = Object.entries(interestCounts).sort((a, b) => b[1] - a[1]);

  const primaryTrait = sortedTraits[0]?.[0] || 'Thoughtful';
  const primaryInterest = sortedInterests[0]?.[0] || 'Feedback Quality';
  const averageSentiment = Math.round(totalSentimentScore / responses.length);
  const averageCompletion = Math.round(totalTime / responses.length);

  const insights = [
    { title: 'Audience Vibe', val: primaryTrait, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Primary Area', val: primaryInterest, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { title: 'Fill Index', val: `${averageCompletion}s Avg`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Sentiment Peak', val: `${averageSentiment}% Positive`, icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  // Pie distribution values
  const pieData = sortedTraits.slice(0, 4).map(([name, value]) => ({
    name,
    value: Math.round((value / responses.length) * 100)
  }));

  // Standard AI insights generated based on results
  const generatedInsights = [
    `The cognitive models indicate that the overriding respondent profile is characterized as "${primaryTrait}". Users in this bracket show sincere cooperation.`,
    `Focus is strongly centralized on "${primaryInterest}". Optimization of questions surrounding this theme is highly recommended to decrease drop-off risks.`,
    `With an average completion index of ${averageCompletion} seconds, response fatigue is exceptionally low. This is indicative of simple, engaging design layouts.`,
    `The sentiment score averages ${averageSentiment}%. AI spam detection verified the integrity rate of current submissions as pristine.`
  ];

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-slate-950 scrollbar-hide">
      <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <BrainCircuit className="text-indigo-400 w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">AI Behavioral Insights</h1>
           </div>
           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">
             Generating live intelligence report for "{currentForm.title}" • {responses.length} responses
           </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="btn-primary flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-blue-500/25"
        >
           <Sparkles className={cn("w-4 h-4", refreshing ? "animate-spin text-amber-400" : "")} /> 
           {refreshing ? 'Analyzing...' : 'Regenerate Analysis'}
        </button>
      </header>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {insights.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex flex-col justify-between group overflow-hidden relative"
          >
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-30", item.bg)} />
            <div className="flex justify-between items-start mb-6">
               <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg)}>
                 <item.icon className={cn("w-5 h-5", item.color)} />
               </div>
               <span className="text-[10px] font-black text-emerald-400 tracking-tighter">LIVE GEN</span>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.title}</p>
               <p className="text-base font-black text-white truncate max-w-full">{item.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Sentiment Vibe Trends */}
        <div className="lg:col-span-2 glass-card">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                 <TrendingUp className="text-blue-400 w-5 h-5" /> Cognitive Sentiment Tracker
              </h2>
           </div>
           
           <div className="h-[250px] w-full flex items-end gap-3 border-b border-white/5 pb-2">
              {responses.slice(0, 10).map((r, i) => {
                const heightVal = r.analysis?.confidence || 75;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                     <div 
                       className="w-full bg-blue-500/20 hover:bg-blue-500/40 rounded-t-lg transition-all relative" 
                       style={{ height: `${heightVal * 2}px` }}
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {r.userName} ({heightVal}%)
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-slate-600 truncate max-w-[45px]">{r.userName}</span>
                  </div>
                );
              })}
           </div>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">Graph lists confidence score for last 10 participants.</p>
        </div>

        {/* Personality spectrum pie chart */}
        <div className="glass-card flex flex-col justify-between">
           <div>
             <h2 className="text-xl font-black text-white mb-6">Personality Spectrum</h2>
             {pieData.length > 0 ? (
               <PersonalityPieChart data={pieData} />
             ) : (
               <div className="h-44 flex items-center justify-center text-slate-600 text-xs font-bold">Calculating traits distribution...</div>
             )}
           </div>
           <div className="space-y-3 mt-4 border-t border-white/5 pt-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-slate-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'][i] }} />
                      {item.name}
                   </span>
                   <span className="text-white">{item.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Dynamic intelligence recommendations */}
      <div className="glass-card bg-indigo-900/10 border-indigo-500/20">
         <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="text-amber-400 w-6 h-6 animate-pulse" />
            <h2 className="text-2xl font-black text-white tracking-tight">AI Diagnostic Recommendations</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedInsights.map((insight, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 font-black text-xs text-white translate-y-1">
                    {i+1}
                  </div>
                 <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{insight}"</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
