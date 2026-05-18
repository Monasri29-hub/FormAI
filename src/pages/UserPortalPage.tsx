import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  FolderOpen, 
  Clock, 
  Smile, 
  Heart, 
  BrainCircuit, 
  LineChart,
  LogOut,
  ChevronRight,
  ClipboardList,
  Sparkles,
  Award
} from 'lucide-react';
import { useForms } from '../context/FormContext';
import { Page } from '../types';

interface UserPortalPageProps {
  onNavigate: (page: Page | any) => void;
}

export default function UserPortalPage({ onNavigate }: UserPortalPageProps) {
  const { user, forms, logout, fetchUserSubmissions, setSelectedFormId } = useForms();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load user submissions log on mount
  useEffect(() => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    const loadHistory = async () => {
      try {
        const data = await fetchUserSubmissions(user.id);
        setHistory(data || []);
      } catch (err) {
        console.error('Failed loading user submission logs', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user]);

  const handleFillForm = (formId: string) => {
    setSelectedFormId(formId);
    onNavigate('fill');
  };

  const handleLogout = () => {
    logout();
    onNavigate('auth');
  };

  if (!user) return null;

  // Filter public/active forms
  const activeForms = forms.filter(f => f.status === 'active');

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'negative': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'mixed': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion?.toLowerCase()) {
      case 'happy': return '😊';
      case 'excited': return '🎉';
      case 'satisfied': return '👍';
      case 'thoughtful': return '🧠';
      case 'bored': return '😴';
      case 'stressed': return '😰';
      default: return '😐';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-white/5 pb-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ClipboardList className="text-white w-5.5 h-5.5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            SmartPulse <span className="text-blue-400 font-bold">UserPortal</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-white">{user.name}</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Member Client</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/10 px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 backdrop-blur-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-slate-900/60 p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
                <Award className="w-3 h-3" />
                Active Account
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Welcome, {user.name}!
              </h1>
              <p className="text-sm text-slate-400 font-bold mt-1.5">
                Explore outstanding forms in the community, share your opinions, and view instant AI profiles.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center min-w-[120px]">
                <p className="text-2xl font-black text-blue-400">{history.length}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Forms Submitted</p>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center min-w-[120px]">
                <p className="text-2xl font-black text-indigo-400">{activeForms.length}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Available Forms</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Active Forms to Fill */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-2">Available Public Forms</h2>
            
            {activeForms.length === 0 ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 text-center">
                <FolderOpen className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No active public forms</p>
                <p className="text-xs text-slate-600 font-bold mt-1">Check back later for newly published templates!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeForms.map((form) => (
                  <motion.div 
                    key={form.id}
                    whileHover={{ y: -4 }}
                    className="bg-slate-900/60 border border-white/5 hover:border-blue-500/20 rounded-2xl p-5 transition-all flex flex-col justify-between h-[180px]"
                  >
                    <div>
                      <h3 className="text-base font-black text-white truncate">{form.title}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1.5 line-clamp-2 leading-relaxed">{form.description || 'No description provided.'}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-3">
                      <span className="text-[10px] text-slate-500 font-bold">{form.questions.length} Questions</span>
                      <button 
                        onClick={() => handleFillForm(form.id)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2 px-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        Start Form
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Submission History Logs */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-2">My Submissions & AI Profiling</h2>

            {isLoadingHistory ? (
              <div className="h-64 flex items-center justify-center bg-slate-900/20 border border-white/5 rounded-3xl">
                <span className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-10 text-center">
                <ClipboardList className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-base font-bold text-white mb-2">No submission history yet</h3>
                <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                  Start opinionating by selecting any available active public form on the left. Once filled, your deep AI sentiment profile will be cataloged here!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {history.map((resp) => (
                  <motion.div 
                    key={resp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 rounded-3xl p-6 transition-all space-y-5"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {forms.find(f => f.id === resp.formId)?.title || resp.formTitle || 'Untitled Smart Form'}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3" />
                          Submitted {new Date(resp.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* Captured Emotion & Sentiment */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-200 border border-white/5">
                          <span>{getEmotionEmoji(resp.emotion)}</span>
                          {resp.emotion}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getSentimentBadgeColor(resp.analysis?.sentiment)}`}>
                          {resp.analysis?.sentiment || 'Neutral'}
                        </span>
                      </div>
                    </div>

                    {/* AI Insights & Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest">
                        <BrainCircuit className="w-4 h-4" />
                        AI Response Summary
                      </div>
                      <p className="text-xs text-slate-300 font-bold leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">
                        "{resp.analysis?.summary || 'Your response was successfully saved. Complete deep cognitive analytics will be rendered dynamically.'}"
                      </p>
                    </div>

                    {/* Personality Tags & Analytics bars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Personality tags */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Assessed Behavioral Traits</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(resp.analysis?.personality || ['Respondent']).map((trait: string, idx: number) => (
                            <span 
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/5 text-blue-300 border border-blue-500/10"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Confidence and Engagement meters */}
                      <div className="space-y-3">
                        {/* Engagement */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                            <span>Engagement Intensity</span>
                            <span className="text-indigo-400 font-bold">{resp.analysis?.engagementScore || 80}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${resp.analysis?.engagementScore || 80}%` }} />
                          </div>
                        </div>

                        {/* Sincerity/Confidence */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                            <span>Opinion Confidence</span>
                            <span className="text-blue-400 font-bold">{resp.analysis?.confidence || 75}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${resp.analysis?.confidence || 75}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
