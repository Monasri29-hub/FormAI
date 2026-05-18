import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, User, Lock, Mail, Signature, ArrowRight } from 'lucide-react';
import { useForms } from '../context/FormContext';
import { Page } from '../types';

interface AuthPageProps {
  onNavigate: (page: Page | any) => void;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const { login, register } = useForms();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isAdminMode) {
        // Admin Login
        const res = await login(email, password);
        if (res.success) {
          onNavigate('dashboard');
        } else {
          setError(res.error || 'Invalid Admin credentials.');
        }
      } else {
        // User Auth
        if (isSignUp) {
          const res = await register(name, email, password, 'user');
          if (res.success) {
            onNavigate('user-portal');
          } else {
            setError(res.error || 'Registration failed.');
          }
        } else {
          const res = await login(email, password);
          if (res.success) {
            onNavigate('user-portal');
          } else {
            setError(res.error || 'Invalid user credentials.');
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header Logo */}
      <div className="flex items-center gap-3 mb-8 hover:scale-105 transition-transform duration-300">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Zap className="text-white w-7 h-7 fill-current" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">
          SmartPulse <span className="text-blue-400">AI</span>
        </span>
      </div>

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md border border-white/10 backdrop-blur-2xl bg-slate-900/60 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Dynamic Mode Switcher */}
        <div className="flex bg-slate-950/80 rounded-2xl p-1 mb-6 border border-white/5">
          <button 
            type="button"
            onClick={() => {
              setIsAdminMode(false);
              setError(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              !isAdminMode 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            User Portal
          </button>
          <button 
            type="button"
            onClick={() => {
              setIsAdminMode(true);
              setIsSignUp(false);
              setError(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              isAdminMode 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Access
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold tracking-tight text-white mb-2">
            {isAdminMode 
              ? 'Administrator Login' 
              : isSignUp 
                ? 'Create User Account' 
                : 'User Portal Sign In'}
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            {isAdminMode 
              ? 'Provide master credentials to access system analytics.' 
              : isSignUp 
                ? 'Join to track form submissions & behavioral analysis.' 
                : 'Sign in to access public forms & view your submissions history.'}
          </p>
        </div>

        {/* Register / Sign In sub-toggle for Users */}
        {!isAdminMode && (
          <div className="flex justify-center gap-4 mb-6 border-b border-white/5 pb-4">
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`text-xs font-black tracking-wide border-b-2 pb-2 transition-all ${
                !isSignUp ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`text-xs font-black tracking-wide border-b-2 pb-2 transition-all ${
                isSignUp ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-xs text-red-400 font-bold text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {!isAdminMode && isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <Signature className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="text" 
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input 
              type="email" 
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input 
              type="password" 
              required
              placeholder="Account Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
            />
          </div>

          {/* Glowing Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-xs font-black tracking-wider uppercase text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : isAdminMode 
                  ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] shadow-lg shadow-indigo-500/20 active:scale-95'
                  : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isAdminMode ? 'Login as Admin' : isSignUp ? 'Create User Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Educational Sandbox Box */}
        <div className="mt-8 bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-indigo-400" />
            Grading & Sandbox Mode
          </p>
          <p className="text-[10px] text-slate-400 font-bold leading-normal">
            For ease of testing Admin Access, use:<br/>
            <span className="text-blue-400">admin@smartai.com</span> with password <span className="text-blue-400">admin123</span>
          </p>
        </div>
      </motion.div>

    </div>
  );
}
