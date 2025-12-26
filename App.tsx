import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Hero from './components/Hero';
import Assessment from './components/Assessment';
import PlanDisplay from './components/PlanDisplay';
import ChatAssistant from './components/ChatAssistant';
import Tools from './components/Tools';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import StaticPages, { StaticPageType } from './components/StaticPages'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserAnswers, PlanResult } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { QUESTIONS } from './constants';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'hero' | 'assessment' | 'loading' | 'results' | 'dashboard' | 'admin' | 'static'>('hero');
  const [staticPage, setStaticPage] = useState<StaticPageType>('privacy');
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const startAssessment = () => setView('assessment');

  const goToStaticPage = (page: StaticPageType) => {
    setStaticPage(page);
    setView('static');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = async (answers: UserAnswers, phoneNumber: string) => {
    setView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Convert answers to detailed string for AI
    const answerString = Object.entries(answers)
      .map(([id, ans]) => {
        const questionText = QUESTIONS.find(q => q.id === Number(id))?.text || `Question ${id}`;
        return `${questionText}: ${ans}`;
      })
      .join('\n');

    try {
      const result = await generateFitnessPlan(answerString);
      
      const fullPlan: PlanResult = {
        ...result,
        answers: answers,
        phoneNumber: phoneNumber // Store the phone number in the plan result
      };

      setPlan(fullPlan);
      setView('results');
    } catch (error) {
      console.error("Assessment Error:", error);
      alert("متاسفانه خطایی در ارتباط با سرور رخ داد. لطفا اتصال اینترنت خود را بررسی کنید و دوباره دکمه تلاش را بزنید.");
      setView('hero');
    }
  };

  const handleViewPlan = (selectedPlan: PlanResult) => {
    setPlan(selectedPlan);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden relative font-sans flex flex-col">
      
      {/* Sporty Header / Navbar */}
      {view !== 'admin' && (
      <nav className="w-full h-24 px-4 md:px-8 flex justify-between items-center relative z-50 bg-slate-950/90 backdrop-blur-md border-b border-teal-500/10 sticky top-0 shadow-2xl transition-all duration-300">
        {/* Neon Line at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50"></div>

        <div className="flex items-center gap-8">
            {/* Brand Section */}
            <div 
                className="flex items-center gap-4 group cursor-pointer select-none" 
                onClick={() => setView('hero')}
            >
                <div className="relative">
                    {/* Logo Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-2xl italic transform -skew-x-12 border border-teal-400/30 shadow-[0_0_15px_rgba(13,148,136,0.3)] group-hover:shadow-[0_0_25px_rgba(13,148,136,0.6)] group-hover:scale-105 transition-all duration-300">
                        M
                    </div>
                    {/* Live Indicator */}
                    <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-slate-950"></span>
                    </div>
                </div>
                
                <div className="flex flex-col justify-center">
                    <div className="text-3xl font-black text-white tracking-tighter italic leading-none group-hover:text-teal-400 transition-colors uppercase font-sans">
                        MOKAMEL <span className="text-teal-500">FIT PRO</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 opacity-70">
                        <span className="w-1 h-1 bg-teal-500 rounded-full"></span>
                        <div className="text-[0.6rem] font-bold font-mono text-slate-400 tracking-[0.1em] uppercase">
                            Powered by <span className="text-teal-400">SASKA AI</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FIT PRO FAMILY MEGA MENU --- */}
            <div className="hidden xl:block relative group z-50">
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-300 hover:text-white transition-all border border-transparent hover:border-slate-700 hover:bg-slate-900/80 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <div className="w-6 h-6 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-lg flex items-center justify-center text-white shadow-inner border border-white/10">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">اکوسیستم فیت پرو</span>
                    <svg className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Dropdown Content */}
                <div className="absolute top-full right-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                         <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">خانواده بزرگ فیت پرو</span>
                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                         </div>
                         <div className="p-2 space-y-1 relative z-10">
                             
                             {/* Link 1: Fit Pro */}
                             <a href="https://fit_pro.ir" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition-colors group/item border border-transparent hover:border-slate-800/50">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 group-hover/item:scale-105 transition-transform duration-300">
                                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                                 </div>
                                 <div>
                                     <div className="font-bold text-slate-200 text-sm group-hover/item:text-blue-400 transition-colors">فیت پرو</div>
                                     <div className="text-[10px] text-slate-500 leading-tight mt-1">اکوسیستم جامع ورزشکاران</div>
                                 </div>
                             </a>

                             {/* Link 2: Fit Pro Magazine */}
                             <a href="https://fitpromagazine.ir" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition-colors group/item border border-transparent hover:border-slate-800/50">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-800 flex items-center justify-center shadow-lg shadow-pink-500/20 border border-white/10 group-hover/item:scale-105 transition-transform duration-300">
                                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                 </div>
                                 <div>
                                     <div className="font-bold text-slate-200 text-sm group-hover/item:text-pink-400 transition-colors">مجله فیت پرو</div>
                                     <div className="text-[10px] text-slate-500 leading-tight mt-1">جدیدترین مقالات علمی دنیا</div>
                                 </div>
                             </a>

                             {/* Link 3: Mokamel Pro */}
                             <a href="https://mokamelpro.ir" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition-colors group/item border border-transparent hover:border-slate-800/50">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-white/10 group-hover/item:scale-105 transition-transform duration-300">
                                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                 </div>
                                 <div>
                                     <div className="font-bold text-slate-200 text-sm group-hover/item:text-amber-400 transition-colors">مکمل پرو (عمده)</div>
                                     <div className="text-[10px] text-slate-500 leading-tight mt-1">خرید مکمل اصل و تضمینی</div>
                                 </div>
                             </a>

                             {/* Link 4: Mokamel Fit Pro (Current) */}
                             <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-900/10 border border-teal-500/20">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-teal-500/20 border border-white/10">
                                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                                 </div>
                                 <div>
                                     <div className="font-bold text-teal-400 text-sm">مکمل فیت پرو</div>
                                     <div className="text-[10px] text-teal-200/60 leading-tight mt-1">دستیار هوشمند شما (هم‌اکنون)</div>
                                 </div>
                             </div>

                         </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-4 md:gap-6">
            
            {/* Social Media Hub */}
            <div className="hidden lg:flex items-center gap-3 pl-6 ml-2 border-l border-slate-800/50">
                 <a 
                    href="https://instagram.com/mokamel_fitpro" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-[1px] hover:scale-110 transition-transform shadow-lg shadow-purple-500/20"
                    title="اینستاگرام مکمل فیت پرو"
                 >
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.229-.148-4.771-1.664-4.919-4.919-.059-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </div>
                 </a>

                 <a 
                    href="https://chat.whatsapp.com/JkWkKSmtesJ1QID0bgNry7" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all hover:scale-110 shadow-lg shadow-green-500/20"
                    title="گروه آموزشی واتساپ"
                 >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414zM12.04 2C6.48 2 2 6.48 2 12.04C2 13.82 2.46 15.53 3.29 17.06L2 22L7.08 20.67C8.55 21.5 10.26 22 12.04 22C17.6 22 22 17.52 22 12.04C22 6.48 17.52 2 12.04 2Z"/></svg>
                 </a>
            </div>

            {view !== 'hero' && (
                <button 
                    onClick={() => setView('hero')} 
                    className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group"
                >
                    <span className="w-2 h-2 bg-slate-600 rounded-full group-hover:bg-teal-500 transition-colors"></span>
                    Home Base
                </button>
            )}
            
            {user ? (
                <div className="flex items-center gap-3">
                    {user.role === 'admin' && (
                        <button 
                            onClick={() => setView('admin')}
                            className="hidden md:block bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all"
                        >
                            Admin Mode
                        </button>
                    )}
                    <button 
                    onClick={() => setView('dashboard')}
                    className={`flex items-center gap-3 pl-1 pr-4 py-1 rounded-full transition-all border ${
                        view === 'dashboard' 
                        ? 'bg-slate-800 border-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                    }`}
                    >
                        <div className="w-8 h-8 bg-gradient-to-tr from-teal-600 to-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/10">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold font-mono truncate max-w-[100px] hidden md:block uppercase tracking-wider">
                            {user.name}
                        </span>
                    </button>
                </div>
            ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="group relative px-6 py-2 bg-transparent overflow-hidden rounded transform transition-transform hover:scale-105"
                >
                   {/* Button Background Shape */}
                   <div className="absolute inset-0 w-full h-full bg-slate-800 border border-slate-700 transform skew-x-[-12deg] group-hover:bg-teal-600 group-hover:border-teal-400 transition-all duration-300"></div>
                   
                   <span className="relative z-10 font-black text-xs text-white uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all italic">
                      Login System
                      <svg className="w-3 h-3 text-teal-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </span>
                </button>
            )}
        </div>
      </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-grow w-full">
        
        {view === 'admin' ? (
            <AdminPanel onExit={() => setView('dashboard')} />
        ) : view === 'static' ? (
            <StaticPages page={staticPage} onBack={() => setView('hero')} />
        ) : (
            <>
                {view === 'hero' && (
                <>
                    <Hero onStart={startAssessment} />
                    <Tools />
                </>
                )}

                {view === 'assessment' && (
                <div className="container mx-auto px-4 py-8">
                    <Assessment 
                        onComplete={handleAssessmentComplete} 
                        onCancel={() => setView('hero')} 
                        onLegalClick={(page) => goToStaticPage(page as StaticPageType)}
                    />
                </div>
                )}

                {view === 'loading' && (
                <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 border-t-4 border-l-4 border-teal-500/30 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-4 border-b-4 border-teal-500 rounded-full animate-spin-reverse"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-teal-500 animate-pulse font-black text-xl italic">
                            MFP
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-wider">
                        ANALYZING <span className="text-teal-500">BIOMETRICS</span>
                    </h2>
                    <p className="text-slate-500 font-mono text-sm max-w-md mx-auto typing-effect">
                        &gt; Connecting to neural network...<br/>
                        &gt; Processing metabolic rate...<br/>
                        &gt; Generating body code...
                    </p>
                </div>
                )}

                {view === 'results' && plan && (
                <div className="container mx-auto px-4 py-8">
                    <PlanDisplay 
                        plan={plan} 
                        onReset={() => {
                            setPlan(null);
                            setView('dashboard');
                            if (!user) setView('hero');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                    />
                </div>
                )}

                {view === 'dashboard' && user && (
                    <Dashboard 
                        onViewPlan={handleViewPlan} 
                        onNewAssessment={startAssessment} 
                    />
                )}
            </>
        )}

      </main>

      {view !== 'admin' && <Footer onPageClick={goToStaticPage} />}

      {/* Floating Chat (Hide on Admin) */}
      {view !== 'admin' && <ChatAssistant />}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialView="login" 
      />
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </div>

      <style>{`
        .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(<App />);

export default App;