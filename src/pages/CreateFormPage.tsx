import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Settings, 
  Sparkles, 
  ChevronRight,
  GripVertical,
  MousePointer2,
  ListFilter,
  Star,
  ToggleLeft,
  Search,
  Wand2,
  Edit2,
  Check,
  CheckSquare,
  Hash,
  Layout,
  MessageCircle,
  Lightbulb,
  Mail,
  RefreshCcw,
  Copy as CopyIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Question, QuestionType, Form, Page, Template } from '../types';
import AIChatbot from '../components/chatbot/AIChatbot';
import { getAISuggestion } from '../lib/aiHelpers';
import { useForms } from '../context/FormContext';
import { Copy, Share2, Mail as MailIcon, Linkedin, Loader2, AlertCircle } from 'lucide-react';

interface CreateFormPageProps {
  onNavigate: (page: Page) => void;
  template?: Template | null;
  onClearTemplate?: () => void;
}

const SUGGESTIONS = [
  { topic: 'Student Feedback', questions: ['What did you enjoy most?', 'Rate your learning experience', 'Which subject needs improvement?', 'Any additional suggestions?'] },
  { topic: 'Customer Satisfaction', questions: ['How likely are you to recommend us?', 'What feature was most useful?', 'How was the support quality?', 'Where did we fail to meet expectations?'] },
  { topic: 'Event Feedback', questions: ['Rate the overall organization', 'Which session was most valuable?', 'How was the networking opportunity?', 'Suggestions for next year?'] }
];

export default function CreateFormPage({ onNavigate, template, onClearTemplate }: CreateFormPageProps) {
  const { addForm, generateFormFromLink } = useForms();
  const [title, setTitle] = useState(template?.name || 'Untitled Form');
  const [description, setDescription] = useState(template?.description || '');
  const [questions, setQuestions] = useState<Question[]>(
    template?.questions?.length ? template.questions : [{ id: '1', type: 'text', title: 'Enter your name', required: true }]
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [linkInput, setLinkInput] = useState('');
  const [isGeneratingFromLink, setIsGeneratingFromLink] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const handleGenerateFromLink = async () => {
    if (!linkInput.trim()) return;
    setIsGeneratingFromLink(true);
    setGenerationError(null);
    setGenerationSuccess(false);
    try {
      let formattedUrl = linkInput.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      const data = await generateFormFromLink(formattedUrl);
      if (data && data.questions && data.questions.length > 0) {
        setTitle(data.title);
        setDescription(data.description);
        setQuestions(data.questions);
        setGenerationSuccess(true);
        setLinkInput('');
        setTimeout(() => setGenerationSuccess(false), 4000);
      } else {
        throw new Error("No questions returned from link generator");
      }
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate questions. Please ensure the link is reachable.");
    } finally {
      setIsGeneratingFromLink(false);
    }
  };
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [newQuestionId, setNewQuestionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLElement>(null);
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (template) {
      setTitle(template.name);
      setDescription(template.description);
      if (template.questions.length > 0) {
        setQuestions(template.questions);
      }
    }
  }, [template]);

  useEffect(() => {
    if (newQuestionId && questionRefs.current[newQuestionId]) {
      questionRefs.current[newQuestionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setEditingId(newQuestionId);
      setNewQuestionId(null);
    }
  }, [questions, newQuestionId]);

  const [savedForm, setSavedForm] = useState<Form | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const handleSave = () => {
    const formId = Math.random().toString(36).substr(2, 6);
    const secureUrl = `${window.location.origin}/?fill=${formId}`;
    const newForm: Form = {
      id: formId,
      title,
      description,
      questions,
      createdAt: new Date().toISOString(),
      responsesCount: 0,
      status: 'active',
      shareUrl: secureUrl
    };
    addForm(newForm);
    setSavedForm(newForm);
  };

  const copyLink = () => {
    if (savedForm) {
      navigator.clipboard.writeText(savedForm.shareUrl);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const text = `Please fill this SmartPulse AI form:\n${savedForm?.shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(savedForm?.shareUrl || '')}`, '_blank');
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=Please fill out ${title}&body=Link: ${savedForm?.shareUrl}`;
  };

  const addQuestion = (type: QuestionType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newQuestion: Question = {
      id,
      type,
      title: type === 'rating' ? 'Rate your experience' : 'New Question',
      required: false,
      options: type === 'multiple-choice' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    };
    setQuestions([...questions, newQuestion]);
    setNewQuestionId(id);
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const index = questions.findIndex(q => q.id === id);
    const newQuestion = { ...question, id: newId };
    
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions);
    setNewQuestionId(newId);
  };

  const toggleCollapse = (id: string) => {
    const newCollapsed = new Set(collapsedIds);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedIds(newCollapsed);
  };

  const handleImprove = (id: string, title: string) => {
    const suggestion = getAISuggestion(title);
    updateQuestion(id, { aiSuggestion: suggestion });
  };

  const applyImprovement = (id: string) => {
    const q = questions.find(question => question.id === id);
    if (q?.aiSuggestion) {
      updateQuestion(id, { 
        title: q.aiSuggestion.improvedWording,
        type: q.aiSuggestion.suggestedType,
        aiSuggestion: undefined 
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addFromSuggestion = (text: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newQuestion: Question = {
      id,
      type: text.includes('Rate') ? 'rating' : 'text',
      title: text,
      required: false
    };
    setQuestions([...questions, newQuestion]);
    setNewQuestionId(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-lg focus:outline-none border-b border-transparent focus:border-blue-500 w-48 md:w-64"
              placeholder="Form Title"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary hidden md:flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <div className="flex flex-col items-end relative">
            <button 
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save & Launch
            </button>
            {savedForm && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 right-0 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl z-50 w-80 space-y-4"
              >
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Form Published!</p>
                   <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-xl">
                      <span className="text-xs text-blue-400 truncate flex-1 font-bold">{savedForm.shareUrl}</span>
                      <button onClick={copyLink} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                         {isCopying ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                      </button>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={shareWhatsApp} className="flex-1 p-2 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white rounded-xl transition-all border border-green-600/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                   </button>
                   <button onClick={shareLinkedIn} className="flex-1 p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl transition-all border border-blue-600/20 flex items-center justify-center">
                      <Linkedin className="w-4 h-4" />
                   </button>
                   <button onClick={shareEmail} className="flex-1 p-2 bg-white/5 hover:bg-white text-slate-400 hover:text-slate-950 rounded-xl transition-all border border-white/10 flex items-center justify-center">
                      <MailIcon className="w-4 h-4" />
                   </button>
                </div>
                <button onClick={() => setSavedForm(null)} className="w-full py-2 text-[10px] font-black text-slate-600 border-t border-white/5 mt-2 hover:text-white transition-colors">CLOSE</button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="hidden lg:flex w-72 border-r border-white/5 p-6 flex-col gap-6 overflow-y-auto shrink-0 bg-slate-950/20">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Question Types</h3>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => addQuestion('text')} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <MousePointer2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Short Text</span>
              </button>
              <button onClick={() => addQuestion('multiple-choice')} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <ListFilter className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Multiple Choice</span>
              </button>
              <button onClick={() => addQuestion('rating')} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Rating Scale</span>
              </button>
              <button onClick={() => addQuestion('checkbox')} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Checkbox List</span>
              </button>
              <button onClick={() => addQuestion('email')} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Email Input</span>
              </button>
              <button onClick={() => addQuestion('yes-no')} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                  <ToggleLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Yes / No</span>
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Prediction</span>
              </div>
              <p className="text-[11px] text-blue-200/60 leading-relaxed mb-3">
                Expected completion rate with current questions:
              </p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-blue-400">72%</span>
                <span className="text-[10px] text-blue-400/50 mb-1 font-bold tracking-tight">OPTIMAL</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Builder Area */}
        <section ref={scrollAreaRef} className="flex-1 bg-slate-900/30 overflow-y-auto p-6 md:p-12 scrollbar-hide">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {/* Selected Template Banner */}
            {template && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 backdrop-blur-sm border"
                style={{ 
                  backgroundColor: `${template.theme?.primaryColor || '#2563eb'}08`,
                  borderColor: `${template.theme?.primaryColor || '#2563eb'}20`
                }}
              >
                <div className="flex items-center gap-4">
                   <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl"
                    style={{ 
                      backgroundColor: template.theme?.primaryColor || '#2563eb',
                      boxShadow: `0 10px 25px -5px ${template.theme?.primaryColor || '#2563eb'}40`
                    }}
                   >
                      <Layout className="w-6 h-6" />
                   </div>
                   <div className="text-center sm:text-left">
                      <p 
                        className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
                        style={{ color: template.theme?.primaryColor || '#60a5fa' }}
                      >
                        Selected Template
                      </p>
                      <h4 className="text-lg font-black text-white leading-none">{template.name}</h4>
                   </div>
                </div>
                <button 
                  onClick={() => onNavigate('templates')}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> Change Template
                </button>
              </motion.div>
            )}

            {/* AI Link Form Scraper Widget */}
            <div className="glass-card bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-purple-950/20 border-blue-500/20 p-6 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
              
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Form Builder from Website Link</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Paste any event website, documentation link, or product page. SmartPulse AI will fetch the contents and use Qwen-3-32b to automatically design a contextual feedback/registration form.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateFromLink()}
                  placeholder="https://example.com/your-event-or-page"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder:text-slate-600"
                />
                <button
                  onClick={handleGenerateFromLink}
                  disabled={isGeneratingFromLink || !linkInput.trim()}
                  className="btn-primary shrink-0 py-3 px-6 text-xs flex items-center justify-center gap-2 relative overflow-hidden group/btn disabled:opacity-50"
                >
                  {isGeneratingFromLink ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-white group-hover/btn:rotate-12 transition-transform" />
                      <span>Analyze & Build</span>
                    </>
                  )}
                </button>
              </div>
              
              {generationError && (
                <p className="text-[10px] font-bold text-red-400 mt-2.5 flex items-center gap-1.5 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" /> {generationError}
                </p>
              )}
              {generationSuccess && (
                <p className="text-[10px] font-bold text-emerald-400 mt-2.5 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Contextual questions compiled successfully! View questions below.
                </p>
              )}
            </div>

            {/* Form Info Card */}
            <div className="glass-card !border-l-4" style={{ borderLeftColor: template?.theme?.primaryColor || '#3b82f6' }}>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-transparent text-slate-300 font-medium resize-none focus:outline-none placeholder:text-slate-600"
                placeholder="Enter a brief description for your respondents..."
              />
            </div>

            {/* Questions List */}
            <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="flex flex-col gap-6">
              {questions.map((q, index) => (
                <Reorder.Item 
                  key={q.id} 
                  value={q}
                  ref={(el) => questionRefs.current[q.id] = el as any}
                >
                  <motion.div 
                    layout
                    initial={newQuestionId === q.id ? { scale: 0.95, opacity: 0 } : false}
                    animate={newQuestionId === q.id ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    className={cn(
                      "glass-card transition-all group relative overflow-hidden",
                      editingId === q.id ? "ring-2 border-transparent shadow-2xl" : "hover:border-white/20",
                      collapsedIds.has(q.id) ? "py-4" : ""
                    )}
                    style={{ 
                      borderColor: editingId === q.id ? (template?.theme?.primaryColor || '#3b82f6') : undefined,
                      boxShadow: editingId === q.id ? `0 20px 40px -10px ${template?.theme?.primaryColor || '#3b82f6'}30` : undefined,
                      backgroundColor: newQuestionId === q.id ? `${template?.theme?.primaryColor || '#3b82f6'}10` : undefined
                    }}
                  >
                    {/* Interaction Overlay for Collapsed State */}
                    {collapsedIds.has(q.id) && editingId !== q.id && (
                      <div 
                        className="absolute inset-0 z-10 cursor-pointer"
                        onClick={() => toggleCollapse(q.id)}
                      />
                    )}

                    {/* Drag Handle */}
                    <div className="absolute left-2 top-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-20">
                      <GripVertical className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="flex flex-col gap-6 pl-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400">
                              {index + 1}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {q.type.replace('-', ' ')}
                            </span>
                            {q.required && <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Required</span>}
                          </div>

                          <div className="relative group/title">
                            <input 
                              value={q.title}
                              disabled={editingId !== q.id && !collapsedIds.has(q.id)}
                              autoFocus={newQuestionId === q.id}
                              onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                              className={cn(
                                "w-full bg-transparent font-bold text-xl focus:outline-none mb-1 text-white pr-10 border-b border-transparent transition-all",
                                editingId === q.id ? "border-blue-500/50 pb-2" : "cursor-default",
                                collapsedIds.has(q.id) ? "text-lg truncate" : ""
                              )}
                            />
                            {editingId !== q.id && !collapsedIds.has(q.id) && (
                              <button 
                                onClick={() => setEditingId(q.id)}
                                className="absolute right-0 top-1.5 opacity-0 group-hover/title:opacity-100 transition-opacity p-1 text-slate-500 hover:text-white"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {!collapsedIds.has(q.id) && (
                            <>
                              {q.description && <p className="text-xs text-slate-500 font-medium">{q.description}</p>}

                              {/* Options if applicable */}
                              {(q.type === 'multiple-choice' || q.type === 'checkbox') && q.options && (
                                <div className="space-y-2 mt-6 ml-1">
                                  {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                      <div className="w-4 h-4 rounded-md border border-white/20 shrink-0" />
                                      <span className="text-sm text-slate-400 font-medium italic">{opt}</span>
                                    </div>
                                  ))}
                                  <button className="text-[10px] text-blue-400 font-bold hover:underline flex items-center gap-1.5 uppercase tracking-widest mt-4">
                                    <Plus className="w-3.5 h-3.5" /> Add Option
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 relative z-20">
                          <button 
                            onClick={() => toggleCollapse(q.id)}
                            className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            title={collapsedIds.has(q.id) ? "Expand" : "Collapse"}
                          >
                            {collapsedIds.has(q.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                          </button>
                          <button 
                            onClick={() => duplicateQuestion(q.id)}
                            className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                            title="Duplicate"
                          >
                            <CopyIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => removeQuestion(q.id)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => editingId === q.id ? setEditingId(null) : setEditingId(q.id)}
                            className={cn(
                              "p-2 rounded-xl transition-all",
                              editingId === q.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-600 hover:text-white hover:bg-white/5"
                            )}
                            title={editingId === q.id ? "Save" : "Edit"}
                          >
                            {editingId === q.id ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* AI Suggestions Row */}
                      {!collapsedIds.has(q.id) && (
                        <div className="pt-4 border-t border-white/5">
                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-3 h-3 text-yellow-400/50" />
                              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Smart Recommendations</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {['text', 'rating', 'multiple-choice'].map((type) => (
                                <button 
                                  key={type}
                                  onClick={() => updateQuestion(q.id, { type: type as QuestionType })}
                                  className={cn(
                                    "px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all",
                                    q.type === type ? "bg-blue-500 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"
                                  )}
                                >
                                  {type === 'text' ? <MessageCircle className="w-2.5 h-2.5 inline mr-1" /> : type === 'rating' ? <Star className="w-2.5 h-2.5 inline mr-1" /> : <ListFilter className="w-2.5 h-2.5 inline mr-1" />}
                                  {type === 'multiple-choice' ? 'MCQ' : type}
                                </button>
                              ))}
                              <button 
                                onClick={() => updateQuestion(q.id, { required: !q.required })}
                                className={cn(
                                  "px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all",
                                  q.required ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-slate-500"
                                )}
                              >
                                Required
                              </button>
                              <button 
                                onClick={() => handleImprove(q.id, q.title)}
                                className="px-2 py-1 bg-white/5 text-blue-400 rounded-md text-[9px] font-bold uppercase hover:bg-blue-500/10 transition-all flex items-center gap-1"
                              >
                                <Wand2 className="w-2.5 h-2.5" /> AI Improve
                              </button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {q.aiSuggestion && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 relative group/suggest"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">AI Optimization Available</p>
                                    <p className="text-sm text-white font-medium mb-3">"{q.aiSuggestion.improvedWording}"</p>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => applyImprovement(q.id)}
                                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                      >
                                        Apply Fix <Check className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={() => updateQuestion(q.id, { aiSuggestion: undefined })}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-[10px] font-bold uppercase hover:text-white"
                                      >
                                        Dismiss
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <button 
              onClick={() => addQuestion('text')}
              className="py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all text-sm font-bold uppercase tracking-widest mb-20"
            >
              <Plus className="w-5 h-5" /> Add Question
            </button>
          </div>
        </section>

        {/* AI Sidebar Chatbot */}
        <aside className="hidden xl:flex w-96 border-l border-white/10 bg-slate-950/50 backdrop-blur-md overflow-hidden sticky top-0 h-full">
          <AIChatbot onGenerateQuestions={(qs) => setQuestions(qs)} />
        </aside>
      </main>
    </div>
  );
}
