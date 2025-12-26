import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login', onSuccess }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password Strength State
  const [passStrength, setPassStrength] = useState(0);

  const { login, register } = useAuth();

  useEffect(() => {
    if (view === 'register') {
      calculateStrength(password);
    }
  }, [password, view]);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) {
        setPassStrength(0);
        return;
    }
    if (pass.length > 6) score += 1;
    if (pass.length > 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPassStrength(score);
  };

  const getStrengthLabel = () => {
    switch (passStrength) {
        case 0: return { text: 'خیلی کوتاه', color: 'bg-slate-700', width: 'w-1/4' };
        case 1: return { text: 'ضعیف', color: 'bg-red-500', width: 'w-1/4' };
        case 2: return { text: 'متوسط', color: 'bg-orange-500', width: 'w-2/4' };
        case 3: return { text: 'خوب', color: 'bg-yellow-400', width: 'w-3/4' };
        case 4: return { text: 'بسیار امن', color: 'bg-green-500', width: 'w-full' };
        default: return { text: '', color: 'bg-slate-700', width: 'w-0' };
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
      } else {
        if (!name) throw new Error('لطفا نام خود را وارد کنید');
        if (passStrength < 2) throw new Error('رمز عبور باید حداقل متوسط باشد (شامل عدد یا حروف خاص).');
        await register(email, password, name);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 rounded-[2rem] shadow-[0_0_50px_rgba(20,184,166,0.15)] w-full max-w-md overflow-hidden relative border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Mesh */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#0d9488 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Header Graphic */}
        <div className="relative h-32 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
             <div className="absolute inset-0 bg-teal-500/5"></div>
             <div className="w-24 h-24 bg-teal-500/10 rounded-full absolute -top-12 -left-12 blur-2xl"></div>
             <div className="w-24 h-24 bg-blue-500/10 rounded-full absolute -bottom-12 -right-12 blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-teal-400 border border-slate-700 shadow-xl mb-2 group">
                    {view === 'login' ? (
                        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    ) : (
                        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    )}
                </div>
                <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                    {view === 'login' ? 'ورود ایمن' : 'ثبت نام ورزشکار'}
                </h2>
             </div>

             <button 
                onClick={onClose} 
                className="absolute top-4 left-4 text-slate-500 hover:text-white transition-colors p-2"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        </div>

        <div className="p-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {view === 'register' && (
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-400 mb-1 mr-1 uppercase tracking-wider">نام ورزشکار</label>
                <div className="relative">
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 focus:bg-slate-900 transition-all text-sm placeholder:text-slate-700"
                    placeholder="نام کامل"
                    />
                    <div className="absolute left-3 top-3.5 text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                </div>
              </div>
            )}
            
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 mr-1 uppercase tracking-wider">ایمیل معتبر</label>
              <div className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 focus:bg-slate-900 transition-all text-sm placeholder:text-slate-700 text-left font-mono"
                    placeholder="name@example.com"
                    dir="ltr"
                />
                <div className="absolute left-3 top-3.5 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 mr-1 uppercase tracking-wider">رمز عبور</label>
              <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 focus:bg-slate-900 transition-all text-sm placeholder:text-slate-700 text-left font-mono"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <div className="absolute left-3 top-3.5 text-slate-600">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
              </div>
              
              {/* Password Strength Meter */}
              {view === 'register' && password && (
                  <div className="mt-3 transition-all duration-300">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-slate-500">قدرت رمز عبور:</span>
                          <span className={`text-[10px] font-bold ${
                              passStrength < 2 ? 'text-red-400' : 
                              passStrength < 4 ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                              {strengthInfo.text}
                          </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ease-out ${strengthInfo.color}`} style={{ width: strengthInfo.text === 'خیلی کوتاه' ? '10%' : strengthInfo.width }}></div>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1 text-right">شامل عدد و حروف خاص باشد.</p>
                  </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 text-red-400 text-xs rounded-xl border border-red-500/30 flex items-center gap-2 animate-pulse">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-900 font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                  <>
                    {view === 'login' ? 'ورود به سیستم' : 'ایجاد حساب کاربری'}
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
             <div className="flex items-center justify-center gap-4 mb-4 opacity-50">
                 <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider">
                    <svg className="w-3 h-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span>رمزنگاری 256-bit</span>
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider">
                    <svg className="w-3 h-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>حریم خصوصی امن</span>
                 </div>
             </div>
             
            {view === 'login' ? (
              <p className="text-slate-500 text-sm">
                حساب کاربری ندارید؟{' '}
                <button onClick={() => setView('register')} className="text-teal-400 font-bold hover:text-teal-300 transition-colors">
                  ثبت‌نام کنید
                </button>
              </p>
            ) : (
              <p className="text-slate-500 text-sm">
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <button onClick={() => setView('login')} className="text-teal-400 font-bold hover:text-teal-300 transition-colors">
                  وارد شوید
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;