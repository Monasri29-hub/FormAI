import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  BrainCircuit, 
  BarChart3, 
  MessageSquareText, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Frown,
  LineChart,
  Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import { COMPARISON_DATA, MOCK_STATS } from '../constants';
import { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SmartPulse <span className="text-blue-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button 
              onClick={() => {
                onNavigate('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-white hover:text-white transition-all hover:scale-105 active:scale-95 border-b-2 border-blue-500 pb-1"
            >
              Home
            </button>
            <a href="#features" className="hover:text-white transition-all hover:scale-105 active:scale-95">Features</a>
            <button 
              onClick={() => onNavigate('templates')} 
              className={cn(
                "transition-all hover:scale-105 active:scale-95",
                "hover:text-white"
              )}
            >
              Templates
            </button>
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              Analytics
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('auth')}
              className="text-slate-400 hover:text-white text-sm font-bold transition-all cursor-pointer px-4 py-2 hover:scale-[1.03] active:scale-95"
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate('fill')}
              className="btn-secondary"
            >
              Watch Demo
            </button>
            <button 
              onClick={() => onNavigate('create')}
              className="btn-primary"
            >
              Create Form
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              Introducing SmartPulse 2.0
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6">
              Forms that <span className="gradient-text">understand</span> people.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't just collect answers. SmartPulse AI uses behavior science to predict user fatigue, detect spam, and provide actionable insights in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onNavigate('create')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full text-lg font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative px-4"
          >
            <div className="max-w-5xl mx-auto glass-dark p-2 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-brand-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Mockup" 
                className="w-full rounded-[2.2rem] shadow-inner"
              />
              
              {/* Floating Cards */}
              <div className="absolute top-10 -right-10 hidden lg:block">
                <div className="glass p-4 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <BrainCircuit className="text-green-500 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">AI Insight</p>
                      <p className="text-sm font-medium">91% Predicted Success</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 -left-10 hidden lg:block">
                <div className="glass p-4 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center">
                      <ShieldAlert className="text-rose-500 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Alert</p>
                      <p className="text-sm font-medium">High Drop-off at Q.4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-bold font-display mb-2">{stat.value}</p>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section id="features" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Why SmartPulse AI is different</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We've reimagined how feedback is gathered and analyzed using the latest AI behavioral models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="glass-card">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Frown className="text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Emotion Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Detect user frustration or confusion in real-time. Understand the "why" behind the numbers.</p>
            </div>
            <div className="glass-card">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert className="text-amber-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Spam Shield</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our AI flags "aaaa" or repeated patterns instantly, ensuring your data is clean and actionable.</p>
            </div>
            <div className="glass-card">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="text-indigo-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Predictive Insights</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Know exactly where users will drop off before you even launch. Optimize for maximum engagement.</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 p-6 font-bold tracking-tight border-b border-white/10">
              <div>System Feature</div>
              <div className="text-slate-500">Google Forms</div>
              <div className="text-blue-400">SmartPulse AI</div>
            </div>
            {COMPARISON_DATA.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 p-6 text-sm border-b last:border-0 border-white/5 items-center hover:bg-white/[0.02]">
                <div className="font-semibold text-slate-300">{row.feature}</div>
                <div className="text-slate-500 flex items-center gap-2">
                   {row.google}
                </div>
                <div className="text-slate-200 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="text-blue-500 w-4 h-4 flex-shrink-0" />
                  {row.pulse}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-brand-500 w-6 h-6" />
              <span className="text-xl font-bold font-display tracking-tight">SmartPulse <span className="text-brand-400">AI</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">Empowering creators with feedback tools that actually think.</p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-sm uppercase tracking-widest text-slate-300">Product</p>
              <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Analytics</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-sm uppercase tracking-widest text-slate-300">Company</p>
              <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">About</a>
              <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-xs text-slate-600">
          © 2026 SmartPulse AI. Built with intelligence.
        </div>
      </footer>
    </div>
  );
}
