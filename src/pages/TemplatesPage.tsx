import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Layout, Sparkles, User, FileText, 
  Briefcase, MessageSquare, GraduationCap, Rocket, Zap,
  CheckCircle2, Plus, ArrowRight, Eye, RefreshCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Page, Template, Question } from '../types';

interface TemplatesPageProps {
  onNavigate: (page: Page) => void;
  onSelectTemplate: (template: Template) => void;
}

const ALL_TEMPLATES: Template[] = [
  // Plain Templates
  {
    id: 'student-reg',
    name: 'Student Registration',
    description: 'Standard enrollment form for courses or institutional clubs.',
    category: 'plain',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Full Name', required: true },
      { id: '2', type: 'email', title: 'Institutional Email', required: true },
      { id: '3', type: 'text', title: 'Major / Department', required: true },
      { id: '4', type: 'text', title: 'Current Year of Study', required: true },
      { id: '5', type: 'text', title: 'GPA / Previous Grade', required: false }
    ],
    theme: {
      primaryColor: '#0ea5e9',
      accentColor: '#6366f1',
      bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-sky-900/40 to-slate-950'
    }
  },
  {
    id: 'event-reg',
    name: 'Event Registration',
    description: 'Ticketing and attendee management for community events.',
    category: 'plain',
    image: 'https://images.unsplash.com/photo-1505373633560-822490d1b402?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Attendee Full Name', required: true },
      { id: '2', type: 'email', title: 'Contact Email', required: true },
      { id: '3', type: 'text', title: 'Organization / Company', required: true },
      { id: '4', type: 'text', title: 'Dietary Requirements', required: false },
      { id: '5', type: 'multiple-choice', title: 'How did you hear about us?', required: true, options: ['Social Media', 'Search Engine', 'Friend', 'Ad'] }
    ],
    theme: {
      primaryColor: '#10b981',
      accentColor: '#14b8a6',
      bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-emerald-900/40 to-slate-950'
    }
  },
  {
    id: 'feedback-plain',
    name: 'Feedback Form',
    description: 'Clean survey for customer or service performance feedback.',
    category: 'plain',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'rating', title: 'How easy was it to use our service?', required: true },
      { id: '2', type: 'rating', title: 'Overall product satisfaction', required: true },
      { id: '3', type: 'text', title: 'What is the one thing we should improve?', required: true },
      { id: '4', type: 'rating', title: 'Likelihood to recommend to a friend', required: true }
    ],
    theme: {
      primaryColor: '#f43f5e',
      accentColor: '#ec4899',
      bannerImage: 'https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-rose-900/40 to-slate-950'
    }
  },
  {
    id: 'survey-plain',
    name: 'Survey Form',
    description: 'Basic multiple choice survey for general demographics.',
    category: 'plain',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Age Group', required: true },
      { id: '2', type: 'multiple-choice', title: 'Current Employment Status', required: true, options: ['Full-time', 'Part-time', 'Self-employed', 'Student', 'Unemployed'] },
      { id: '3', type: 'multiple-choice', title: 'Preferred Contact Method', required: true, options: ['Email', 'SMS', 'Phone Call'] },
      { id: '4', type: 'text', title: 'Primary Interests', required: false }
    ],
    theme: {
      primaryColor: '#f59e0b',
      accentColor: '#f97316',
      bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-amber-900/40 to-slate-950'
    }
  },
  {
    id: 'job-app',
    name: 'Job Application',
    description: 'Candidate screening form for hiring and talent acquisition.',
    category: 'plain',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Full Name', required: true },
      { id: '2', type: 'email', title: 'Email Address', required: true },
      { id: '3', type: 'text', title: 'Portfolio / LinkedIn Profile', required: true },
      { id: '4', type: 'text', title: 'Expected Monthly Salary (USD)', required: true },
      { id: '5', type: 'text', title: 'Available Start Date', required: true }
    ],
    theme: {
      primaryColor: '#64748b',
      accentColor: '#3b82f6',
      bannerImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-slate-800/40 to-slate-950'
    }
  },
  // Designed Templates
  {
    id: 'hackathon-designed',
    name: 'Hackathon Registration',
    description: 'High-energy template for dev events and coding challenges.',
    category: 'designed',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Primary Handle / Name', required: true },
      { id: '2', type: 'email', title: 'Development Email', required: true },
      { id: '3', type: 'text', title: 'College / Organization Name', required: true },
      { id: '4', type: 'text', title: 'Branch / Specialization', required: true },
      { id: '5', type: 'text', title: 'Technical Skills (Languages, Frameworks)', required: true },
      { id: '6', type: 'multiple-choice', title: 'Previous Hackathon Experience', required: true, options: ['None', '1-2', '3-5', 'Pro (6+)'] },
      { id: '7', type: 'rating', title: 'Expected Team Size', required: true },
      { id: '8', type: 'multiple-choice', title: 'Preferred Domain', required: true, options: ['Web3', 'AI/ML', 'HealthTech', 'FinTech', 'DevTools'] },
      { id: '9', type: 'text', title: 'What do you expect to achieve?', required: false }
    ],
    theme: {
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      bannerImage: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f2?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-blue-950 via-violet-950/40 to-slate-950'
    }
  },
  {
    id: 'college-admission',
    name: 'College Admission Form',
    description: 'Academic focused design for professional universities.',
    category: 'designed',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Full Applicant Name', required: true },
      { id: '2', type: 'email', title: 'Student Email', required: true },
      { id: '3', type: 'text', title: 'High School Name', required: true },
      { id: '4', type: 'text', title: 'SAT / ACT / Grade Score', required: true },
      { id: '5', type: 'text', title: 'List key extracurricular achievements', required: true },
      { id: '6', type: 'text', title: 'Statement of Purpose (Brief)', required: true }
    ],
    theme: {
      primaryColor: '#4f46e5',
      accentColor: '#3b82f6',
      bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-indigo-950 via-blue-950/40 to-slate-950'
    }
  },
  {
    id: 'startup-pitch',
    name: 'Startup Pitch Form',
    description: 'Bold, investor-ready template for incubators and VCs.',
    category: 'designed',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Startup Name', required: true },
      { id: '2', type: 'text', title: 'One Sentence Pitch', required: true },
      { id: '3', type: 'text', title: 'Company Website / Deck URL', required: true },
      { id: '4', type: 'rating', title: 'Core Team Size', required: true },
      { id: '5', type: 'multiple-choice', title: 'Current Funding Stage', required: true, options: ['Ideation', 'MVP / Pre-seed', 'Seed', 'Series A+'] },
      { id: '6', type: 'text', title: 'What exact problem are you solving?', required: true }
    ],
    theme: {
      primaryColor: '#d97706',
      accentColor: '#fbbf24',
      bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-amber-950 via-yellow-950/20 to-slate-950'
    }
  },
  {
    id: 'corp-feedback-designed',
    name: 'Corporate Feedback Form',
    description: 'Strategic internal review form for corporate environments.',
    category: 'designed',
    image: 'https://images.unsplash.com/photo-1497215842964-2229243e5101?auto=format&fit=crop&q=80&w=800',
    questions: [
      { id: '1', type: 'text', title: 'Department Name', required: true },
      { id: '2', type: 'text', title: 'Reporting Manager', required: true },
      { id: '3', type: 'rating', title: 'Work-Life Balance Satisfaction', required: true },
      { id: '4', type: 'text', title: 'Identify primary productivity blockers', required: true },
      { id: '5', type: 'text', title: 'Primary goals for next quarter', required: true }
    ],
    theme: {
      primaryColor: '#0891b2',
      accentColor: '#2563eb',
      bannerImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      bgGradient: 'from-cyan-950 via-blue-950/20 to-slate-950'
    }
  }
];

export default function TemplatesPage({ onNavigate, onSelectTemplate }: TemplatesPageProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const handleUseTemplate = () => {
    if (previewTemplate) {
      onSelectTemplate(previewTemplate);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:inline">SmartPulse <span className="text-blue-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="hover:text-white transition-all underline-offset-8"
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('saved-forms')} 
              className="hover:text-white transition-all"
            >
              Saved Forms
            </button>
            <button 
              onClick={() => onNavigate('templates')} 
              className="text-white hover:text-white transition-all border-b-2 border-blue-500 pb-1"
            >
              Templates
            </button>
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="hover:text-white transition-all"
            >
              Analytics
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('create')}
              className="text-xs font-black uppercase text-slate-500 hover:text-white tracking-widest transition-colors"
            >
              Skip to Blank
            </button>
            <button 
              onClick={() => onNavigate('create')}
              className="btn-primary py-2 px-4 text-xs"
            >
              Create Form
            </button>
          </div>
        </div>
      </nav>

      {/* Template Gallery Area */}
      <div className="bg-slate-900/10 flex-1 overflow-y-auto scrollbar-hide py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Start with a template</h2>
            <p className="text-slate-500 text-sm font-medium">Choose a template to quickly build your SmartPulse AI form</p>
          </div>

          <div className="relative group/gallery">
            <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide scroll-smooth snap-x">
               {/* Blank Card */}
               <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => onNavigate('create')}
                className="flex flex-col gap-3 text-left min-w-[200px] snap-start"
              >
                <div className="aspect-[4/5] bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all relative overflow-hidden group/blank">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover/blank:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-slate-500 group-hover/blank:text-blue-500 transition-colors" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 py-2.5 bg-white/5 backdrop-blur-md border-t border-white/5 text-[10px] font-black uppercase text-center text-slate-500">
                    Blank Form
                  </div>
                </div>
                <span className="text-sm font-bold text-white pl-1">New Blank Canvas</span>
              </motion.button>

              {ALL_TEMPLATES.map((t) => (
                <motion.button 
                  key={t.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setPreviewTemplate(t)}
                  className="flex flex-col gap-3 text-left min-w-[200px] snap-start"
                >
                  <div className={cn(
                    "aspect-[4/5] bg-slate-950 border rounded-2xl overflow-hidden transition-all relative group/item",
                    t.category === 'designed' ? "border-blue-500/10 hover:border-blue-500/40" : "border-white/5 hover:border-white/20"
                  )}>
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110 opacity-40 group-hover/item:opacity-60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    
                    {/* Category Label */}
                    <div className={cn(
                      "absolute top-3 right-3 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] z-10",
                      t.category === 'designed' ? "bg-blue-600 text-white" : "bg-white/10 text-white border border-white/10"
                    )}>
                      {t.category}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center z-20">
                      <div className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30">
                         View Template
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 py-2.5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 text-[10px] font-black uppercase text-center text-slate-500 group-hover/item:text-blue-400">
                      Form Preview
                    </div>
                  </div>
                  <div className="pl-1">
                    <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">AI Optimized</p>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Scroll Indicators */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity cursor-pointer text-slate-500 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity cursor-pointer text-slate-500 hover:text-white">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Overlay */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col"
            style={{ 
              ['--template-primary' as any]: previewTemplate.theme?.primaryColor || '#3b82f6',
              ['--template-accent' as any]: previewTemplate.theme?.accentColor || '#8b5cf6'
            }}
          >
            {/* Decorative Background Elements */}
            <div className={cn("absolute inset-0 bg-linear-to-b opacity-20 pointer-events-none", previewTemplate.theme?.bgGradient)} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--template-primary)]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--template-accent)]/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <nav className="border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setPreviewTemplate(null)}
                    className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Previewing</p>
                    <h2 className="text-lg font-black text-white">{previewTemplate.name}</h2>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setPreviewTemplate(null)}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-black uppercase text-slate-400 hover:text-white transition-all flex items-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Change Template
                  </button>
                  <button 
                    onClick={handleUseTemplate}
                    className="px-8 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center gap-2"
                    style={{ 
                      backgroundColor: 'var(--template-primary)',
                      boxShadow: `0 10px 25px -5px ${previewTemplate.theme?.primaryColor}40`
                    }}
                  >
                    Use Template <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide relative z-10">
               <div className="max-w-3xl mx-auto space-y-10">
                  {/* Visual Header Banner */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                    <img 
                      src={previewTemplate.theme?.bannerImage} 
                      alt="Banner" 
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&q=80&w=1200';
                      }}
                    />
                    
                    <div className="absolute inset-0 z-20 p-10 flex flex-col justify-end">
                       <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-[0.2em]">
                             {previewTemplate.category}
                          </span>
                          <div className="flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-[var(--template-primary)]" />
                             <span className="text-[10px] font-black text-[var(--template-primary)] uppercase tracking-widest">Premium Intelligence</span>
                          </div>
                       </div>
                       <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
                          {previewTemplate.name}
                       </h1>
                       <p className="text-slate-300 font-medium leading-relaxed max-w-xl text-lg">
                          {previewTemplate.description}
                       </p>
                    </div>

                    {/* Floating Accent Shapes */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--template-primary)]/20 blur-3xl rounded-full z-0" />
                  </motion.div>

                  {/* Form Questions Preview */}
                  <div className="space-y-6 opacity-80 select-none pb-20">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-px bg-white/10 flex-1" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Form Structure</span>
                       <div className="h-px bg-white/10 flex-1" />
                    </div>

                    {previewTemplate.questions.map((q, i) => (
                      <motion.div 
                        key={q.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group glass-card !p-8 border-white/5 hover:border-[var(--template-primary)]/30 transition-all duration-500 hover:translate-x-1"
                      >
                         <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[var(--template-primary)]/10 group-hover:border-[var(--template-primary)]/20 transition-all">
                                  <span className="text-sm font-black text-[var(--template-primary)]">{i + 1}</span>
                               </div>
                               <div>
                                  <h3 className="text-xl font-bold text-white group-hover:text-[var(--template-primary)] transition-colors leading-tight">
                                    {q.title}
                                    {q.required && <span className="text-red-500 ml-1">*</span>}
                                  </h3>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                                    Type: {q.type.replace('-', ' ')}
                                  </p>
                               </div>
                            </div>
                            <div className="hidden md:block">
                                <CheckCircle2 className="w-5 h-5 text-slate-800" />
                            </div>
                         </div>
                         
                         {/* Visual Placeholder for Inputs */}
                         <div className="space-y-3">
                            {['multiple-choice', 'checkbox'].includes(q.type) ? (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {(q.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, idx) => (
                                     <div key={idx} className="h-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center px-4 gap-3">
                                        <div className="w-4 h-4 rounded-full border border-white/20" />
                                        <span className="text-xs text-slate-500">{opt}</span>
                                     </div>
                                  ))}
                               </div>
                            ) : q.type === 'rating' ? (
                               <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map(n => (
                                     <div key={n} className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-600 text-xs font-bold">{n}</div>
                                  ))}
                               </div>
                            ) : (
                               <div className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center px-6">
                                  <span className="text-xs text-slate-700 italic">User answer will be displayed here...</span>
                               </div>
                            )}
                         </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Completion Promo */}
                  <div className="text-center py-20 border-t border-white/5">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Built with SmartPulse AI 2.0</p>
                      <button 
                        onClick={handleUseTemplate}
                        className="px-12 py-5 rounded-full text-white font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl"
                        style={{ 
                          backgroundColor: 'var(--template-primary)',
                          boxShadow: `0 20px 40px -10px ${previewTemplate.theme?.primaryColor}60`
                        }}
                      >
                        Start Editing Template
                      </button>
                  </div>
               </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
