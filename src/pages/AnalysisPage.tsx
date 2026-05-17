import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Download, FileDown, Search, Filter, 
  User, Mail, Clock, Brain, MessageSquare, 
  Smile, ShieldCheck, Zap, MoreVertical,
  ChevronRight, TrendingUp, Heart, Star,
  LineChart, PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useForms } from '../context/FormContext';
import { MOCK_RESPONSES, MOCK_GROUP_ANALYSIS } from '../dummyData/mockResponses';
import { 
  SentimentBarChart, 
  ParticipationAreaChart, 
  PersonalityPieChart 
} from '../components/charts/ResponsiveCharts';
import { FormResponse, Page, GroupAnalysis } from '../types';

interface AnalysisPageProps {
  onNavigate: (page: Page) => void;
}

export default function AnalysisPage({ onNavigate }: AnalysisPageProps) {
  const { selectedFormId, fetchGroupAnalysis, forms, responses } = useForms();
  const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses'>('overview');
  const [groupAnalysis, setGroupAnalysis] = useState<GroupAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  // Fetch active aggregate analysis on form selection
  useEffect(() => {
    if (!selectedFormId) return;
    setIsAnalysisLoading(true);
    fetchGroupAnalysis(selectedFormId)
      .then(data => {
        setGroupAnalysis(data);
        setIsAnalysisLoading(false);
      })
      .catch(err => {
        console.error('Error fetching group metrics:', err);
        setIsAnalysisLoading(false);
      });
  }, [selectedFormId]);

  // Reset inspected response on selected form switch
  useEffect(() => {
    setSelectedResponse(null);
  }, [selectedFormId]);

  const activeAnalysis = groupAnalysis || MOCK_GROUP_ANALYSIS;

  // Real live metrics calculation
  const totalVolume = responses.length;
  
  const avgSentiment = responses.length > 0
    ? activeAnalysis.avgSentimentScore
    : 0;

  const avgEngagement = responses.length > 0
    ? Math.round(responses.reduce((acc, curr) => acc + (curr.analysis.engagementScore || 0), 0) / responses.length)
    : 0;

  const spamCount = responses.filter(r => r.isSpam).length;
  const integrity = responses.length > 0
    ? Math.round(((responses.length - spamCount) / responses.length) * 100)
    : 100;

  const filteredResponses = responses.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tight text-white">Full Intelligence Analysis</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
              {currentForm?.title || 'Form'} • {totalVolume} {totalVolume === 1 ? 'Response' : 'Responses'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary gap-2 flex items-center bg-white/5 border-white/10 text-xs font-bold py-2.5">
            <FileDown className="w-4 h-4" /> Download Report
          </button>
          <button className="btn-primary gap-2 flex items-center text-xs font-bold py-2.5 px-6">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto scrollbar-hide">
        {/* Navigation Tabs */}
        <div className="flex gap-1 p-1 glass bg-white/5 rounded-2xl w-fit mb-10">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === 'overview' ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Overall Insights
          </button>
          <button 
            onClick={() => setActiveTab('responses')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === 'responses' ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Individual Responses
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Volume', value: totalVolume.toString(), icon: MessageSquare, color: 'text-blue-400', sub: 'Submissions gathered' },
                  { label: 'Avg Sentiment', value: `${avgSentiment}%`, icon: Smile, color: 'text-green-400', sub: avgSentiment > 70 ? 'Highly positive tone' : 'Neutral/Balanced tone' },
                  { label: 'Engage Score', value: `${avgEngagement}/100`, icon: Zap, color: 'text-amber-400', sub: 'Calculated response quality' },
                  { label: 'Integrity Rate', value: `${integrity}%`, icon: ShieldCheck, color: 'text-indigo-400', sub: `${spamCount} spam filter anomalies` }
                ].map((stat, i) => (
                  <div key={i} className="glass-card flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                      </div>
                      <TrendingUp className="text-emerald-400 w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                      <p className="text-3xl font-extrabold text-white tracking-tighter mb-1">{stat.value}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card">
                  <div className="flex items-center gap-2 mb-8">
                    <LineChart className="text-blue-400 w-5 h-5" />
                    <h2 className="text-lg font-bold">Participation Trends</h2>
                  </div>
                  {activeAnalysis.participationTrends && activeAnalysis.participationTrends.length > 0 ? (
                    <ParticipationAreaChart data={activeAnalysis.participationTrends} />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-600 font-semibold text-sm">Awaiting trends data.</div>
                  )}
                </div>
                
                <div className="glass-card">
                  <div className="flex items-center gap-2 mb-8">
                    <PieChartIcon className="text-purple-400 w-5 h-5" />
                    <h2 className="text-lg font-bold">Personality Distribution</h2>
                  </div>
                  {activeAnalysis.personalityDistribution && Object.keys(activeAnalysis.personalityDistribution).length > 0 ? (
                    <PersonalityPieChart data={Object.entries(activeAnalysis.personalityDistribution).map(([name, value]) => ({ name, value }))} />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-600 font-semibold text-sm">Awaiting traits calculation.</div>
                  )}
                </div>
              </div>

              {/* AI Insights and Heatmaps */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card bg-gradient-to-br from-indigo-950/30 to-blue-950/30">
                  <div className="flex items-center gap-2 mb-8">
                    <Brain className="text-indigo-400 w-6 h-6 animate-pulse" />
                    <h2 className="text-xl font-extrabold tracking-tight">AI Group Insights (Qwen)</h2>
                  </div>
                  <div className="space-y-4">
                    {activeAnalysis.aiInsights && activeAnalysis.aiInsights.map((insight, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card">
                  <h2 className="text-lg font-bold mb-8">Engagement Heatmap</h2>
                  <div className="space-y-3">
                    {activeAnalysis.engagementHeatmap && activeAnalysis.engagementHeatmap.slice(0, 5).map((row, i) => (
                      <div key={i} className="flex gap-2 h-8">
                        {row.map((cell, j) => (
                          <div 
                            key={j} 
                            className="flex-1 rounded-sm border border-white/5" 
                            style={{ 
                              backgroundColor: `rgba(59, 130, 246, ${cell / 100})`,
                            }}
                            title={`Engagement: ${cell}%`}
                          />
                        ))}
                      </div>
                    ))}
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-4">
                      <span>Morning</span>
                      <span>Mid-day</span>
                      <span>Evening</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="responses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)]"
            >
              {/* Response List */}
              <div className="w-full lg:w-96 flex flex-col gap-4 overflow-hidden">
                <div className="glass-dark p-2 rounded-2xl flex items-center gap-3">
                  <Search className="w-4 h-4 text-slate-500 ml-2" />
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="bg-transparent border-none focus:outline-none text-sm w-full py-2 placeholder:text-slate-600"
                  />
                  <Filter className="w-4 h-4 text-slate-500 mr-2 cursor-pointer hover:text-white" />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {filteredResponses.length > 0 ? (
                    filteredResponses.map((r) => (
                      <button 
                        key={r.id}
                        onClick={() => setSelectedResponse(r)}
                        className={cn(
                          "w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between",
                          selectedResponse?.id === r.id 
                            ? "bg-blue-600/10 border-blue-500/50 shadow-xl shadow-blue-500/5 scale-[1.02]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-sm",
                            r.isSpam ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-blue-500/10 border-blue-400/20 text-blue-400"
                          )}>
                            {r.userName ? r.userName.charAt(0) : 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{r.userName || 'Anonymous'}</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate w-40">{r.userEmail || 'anonymous@example.com'}</p>
                          </div>
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform",
                          selectedResponse?.id === r.id ? "translate-x-1 text-blue-400" : "text-slate-600 group-hover:text-slate-400"
                        )} />
                      </button>
                    ))
                  ) : (
                    <div className="text-center p-8 text-slate-600 text-xs font-semibold">No responses matched search criteria.</div>
                  )}
                </div>
              </div>

              {/* Detailed View */}
              <div className="flex-1 glass-card overflow-y-auto scrollbar-hide">
                {selectedResponse ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={selectedResponse.id}
                    className="space-y-10"
                  >
                    {/* Person Intro */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl shadow-blue-500/30">
                          {selectedResponse.userName ? selectedResponse.userName.charAt(0) : 'A'}
                        </div>
                        <div>
                          <h2 className="text-4xl font-extrabold tracking-tighter text-white mb-1">{selectedResponse.userName}</h2>
                          <div className="flex items-center gap-4 text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedResponse.userEmail}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {selectedResponse.completionTime}s completion</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedResponse.isSpam && <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-widest animate-pulse">SPAM DETECTED</span>}
                        <button className="btn-secondary !p-2"><MoreVertical className="w-5 h-5" /></button>
                      </div>
                    </div>

                    {/* AI Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                        <div className="flex items-center gap-2 text-blue-400 mb-4">
                          <Brain className="w-5 h-5 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-widest">Qwen Cognitive Profile</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{selectedResponse.analysis.summary}"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2 tracking-widest">Sentiment vibe</span>
                          <div className="flex items-center gap-2">
                            <Smile className="text-green-400 w-5 h-5" />
                            <span className="text-lg font-bold text-white capitalize">{selectedResponse.analysis.sentiment}</span>
                          </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2 tracking-widest">Confidence Index</span>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-white">{selectedResponse.analysis.confidence}%</div>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${selectedResponse.analysis.confidence}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500" /> Behavioral Personality Traits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedResponse.analysis.personality.map((p, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">{p}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" /> Focal Topics of Interest
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedResponse.analysis.interestAreas.map((ia, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">{ia}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Answers */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Raw Response Data</h4>
                      <div className="space-y-6">
                        {Object.entries(selectedResponse.answers).map(([id, val], i) => {
                          const matchingQuestion = currentForm?.questions?.find(q => q.id === id);
                          return (
                            <div key={id} className="relative pl-6 border-l border-white/10 group">
                              <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                              <p className="text-[10px] font-extrabold text-slate-600 uppercase mb-1 tracking-tight">
                                {matchingQuestion ? matchingQuestion.title : `Question (ID: ${id})`}
                              </p>
                              <p className="text-white font-medium">{String(val)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <User className="text-slate-700 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No Response Selected</h3>
                    <p className="text-slate-600 text-sm max-w-xs">Select a participant from the list to view their behavioral profile and AI analysis.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
