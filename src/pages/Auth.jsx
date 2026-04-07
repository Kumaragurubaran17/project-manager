import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe, Plus, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: window.location.origin
            }
        });
        if (error) throw error;
        setMessage({ type: 'success', content: 'Check your email for the confirmation link!' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Brand Section (Left) */}
      <section className="hidden md:flex flex-col flex-1 bg-[#1A1C2E] p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
               <Plus className="w-6 h-6 text-white rotate-45" />
             </div>
             <span className="text-2xl font-display font-extrabold tracking-tight text-white">Zenith</span>
           </div>

           <div className="mt-auto max-w-sm">
             <h2 className="text-4xl font-display font-bold text-white leading-tight mb-6">
                Accelerate your team's workflow with precision.
             </h2>
             <p className="text-slate-400 font-medium leading-relaxed mb-8">
                The all-in-one platform for high-performance teams to design, develop, and deliver world-class products.
             </p>
             
             <div className="flex -space-x-3 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    className="w-10 h-10 rounded-full border-2 border-[#1A1C2E] shadow-sm transform hover:-translate-y-1 transition-transform" 
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-primary border-2 border-[#1A1C2E] flex items-center justify-center text-[10px] font-bold text-white">
                  +12k
                </div>
             </div>
             <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest pl-1">
                Trusted by 500+ global enterprises
             </p>
           </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full" />
      </section>

      {/* Auth Section (Right) */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight mb-2">
               {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-muted-foreground font-medium">
               {isLogin ? 'Enter your credentials to access your workspace.' : 'Get started for free and invite your team.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm text-sm">
                <Globe className="w-4 h-4" />
                Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm text-sm">
                <Globe className="w-4 h-4" />
                Github
            </button>
          </div>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Or use email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl p-4 pl-12 text-sm font-bold transition-all outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center pr-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl p-4 pl-12 text-sm font-bold transition-all outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {message.content && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                        "p-4 rounded-xl flex items-center gap-3 text-xs font-bold",
                        message.type === 'error' ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    )}
                >
                  {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {message.content}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#1A1C2E] hover:bg-black text-white font-bold rounded-2xl shadow-xl hover:shadow-black/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm font-bold text-muted-foreground">
             {isLogin ? "Don't have an account?" : 'Already have an account?'}
             <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline ml-1.5"
             >
                {isLogin ? 'Sign up' : 'Log in'}
             </button>
          </p>

          <div className="pt-8 text-center">
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-loose">
                By continuing, you agree to Zenith's <br />
                <button className="text-slate-400 hover:text-slate-600">Terms of Service</button> and <button className="text-slate-400 hover:text-slate-600">Privacy Policy</button>.
             </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
