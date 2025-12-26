import React, { useState } from 'react';
import { PlanResult, Supplement } from '../types';
import { WHATSAPP_NUMBER, QUESTIONS } from '../constants';
import { adminService } from '../services/adminService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface PlanDisplayProps {
  plan: PlanResult;
  onReset: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onReset }) => {
  const { user, savePlan } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // State for supplement accordion expansion
  const [expandedSupplements, setExpandedSupplements] = useState<Record<string, boolean>>({});

  const whatsappMessage = `سلام، کد اختصاصی بدن خودم رو دریافت کردم (کد: ${plan.bodyCode}) و برای راهنمایی پیام دادم`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleWhatsappClick = () => {
    adminService.logEvent('WHATSAPP_CLICK', user?.id, 'Clicked from Plan Results');
  };

  const toggleSupplement = (name: string) => {
    setExpandedSupplements(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const macroData = [
    { name: 'پروتئین', value: plan.macros.protein, color: '#0ea5e9' }, // Sky Blue
    { name: 'کربوهیدرات', value: plan.macros.carbs, color: '#10b981' }, // Emerald
    { name: 'چربی', value: plan.macros.fats, color: '#f59e0b' }, // Amber
  ];

  const groupedSupplements = (plan.supplements || []).reduce((acc, sup) => {
    if (!acc[sup.category]) acc[sup.category] = [];
    acc[sup.category].push(sup);
    return acc;
  }, {} as Record<string, Supplement[]>);

  const getCategoryColor = (cat: string) => {
    switch(cat) {
        case 'Protein': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
        case 'Recovery': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
        case 'Performance': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
        case 'Health': return 'text-green-400 border-green-500/30 bg-green-500/10';
        default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
        case 'Protein': return 'عضله‌سازی و پروتئین';
        case 'Recovery': return 'ریکاوری و بازسازی';
        case 'Performance': return 'افزایش عملکرد و قدرت';
        case 'Health': return 'سلامت عمومی و مفاصل';
        default: return cat;
    }
  };

  const getPriorityLabel = (p: string) => {
      switch(p) {
          case 'High': return { text: 'حیاتی', color: 'bg-red-500 text-white' };
          case 'Medium': return { text: 'مهم', color: 'bg-amber-500 text-slate-900' };
          case 'Low': return { text: 'اختیاری', color: 'bg-slate-600 text-slate-200' };
          default: return { text: 'معمولی', color: 'bg-slate-600' };
      }
  };

  const handleSave = async () => {
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    setSaveLoading(true);
    await savePlan(plan);
    setSaveLoading(false);
    setIsSaved(true);
  };

  const vitaminsList: string[] = Array.isArray(plan.vitamins) ? (plan.vitamins as string[]) : [];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-slide-up pb-40" dir="rtl">
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialView="register"
        onSuccess={() => handleSave()}
      />

      {/* --- HERO: BODY CODE DISPLAY --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-1 relative overflow-hidden mb-8 shadow-2xl">
        {/* Animated Scanner Line */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent,rgba(20,184,166,0.1),transparent)] animate-scan pointer-events-none z-0"></div>
        
        <div className="bg-slate-950/90 rounded-[1.3rem] p-6 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/30 px-3 py-1 rounded text-green-400 text-xs font-mono mb-4 animate-pulse">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    محاسبه تکمیل شد
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">گزارش آنالیز بدن</h2>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">الگوریتم: {plan.algorithmVersion}</p>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black px-8 py-6 rounded-lg border border-slate-800 flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-2">شناسه اختصاصی بدن</span>
                    <span className="font-mono text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 select-all cursor-pointer hover:text-teal-400 transition-colors">
                        {plan.bodyCode}
                    </span>
                </div>
            </div>
            
             <button
                onClick={handleSave}
                disabled={isSaved || saveLoading}
                className={`w-full md:w-auto px-6 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                    isSaved 
                    ? 'bg-green-900/20 border-green-500/50 text-green-400' 
                    : 'bg-slate-800 border-slate-700 text-white hover:border-teal-500 hover:text-teal-400'
                }`}
             >
                {isSaved ? 'در دیتابیس ذخیره شد' : 'ذخیره در پروفایل'}
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* CHART SECTION */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-lg">
             <span className="text-teal-500 text-xl">⚡</span>
             تفکیک درشت‌مغذی‌ها
          </h3>
          <div className="flex flex-col items-center">
            <div className="w-full h-56 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', textAlign: 'right', fontFamily: 'Vazirmatn' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${value} گرم`, 'مقدار']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-white">{plan.calories}</span>
                  <span className="text-slate-500 text-[10px] uppercase tracking-widest">کالری روزانه</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-6">
                {[
                    { label: 'پروتئین', val: plan.macros.protein, color: 'text-sky-500' },
                    { label: 'کربوهیدرات', val: plan.macros.carbs, color: 'text-emerald-500' },
                    { label: 'چربی', val: plan.macros.fats, color: 'text-amber-500' }
                ].map(m => (
                    <div key={m.label} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                        <span className={`block ${m.color} font-bold text-[10px] uppercase mb-1`}>{m.label}</span>
                        <span className="text-xl font-mono text-white">{m.val}g</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* AI STRATEGY SECTION */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col">
            <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-lg">
                <span className="text-blue-500 text-xl">🧠</span>
                پروتکل استراتژی هوش مصنوعی
            </h3>
            <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-sm leading-relaxed text-slate-300 overflow-y-auto max-h-[300px] custom-scrollbar text-justify" style={{lineHeight: '1.8'}}>
                <p className="whitespace-pre-wrap">{plan.explanation}</p>
            </div>
        </div>
      </div>

      {/* SUPPLEMENTS GRID - REVAMPED */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white mb-6 uppercase italic flex items-center gap-3">
            <span className="text-teal-500">//</span> انبار مکمل‌های هوشمند (Smart Inventory)
        </h3>
        
        <div className="space-y-6">
            {Object.entries(groupedSupplements).map(([category, items]) => (
                <div key={category} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                    {/* Category Header */}
                    <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-800/50 ${
                        category === 'Protein' ? 'bg-blue-900/10' :
                        category === 'Recovery' ? 'bg-purple-900/10' :
                        category === 'Performance' ? 'bg-orange-900/10' : 'bg-green-900/10'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm border border-white/10 ${
                                category === 'Protein' ? 'bg-blue-600 text-white' :
                                category === 'Recovery' ? 'bg-purple-600 text-white' :
                                category === 'Performance' ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'
                            }`}>
                                {category === 'Protein' ? '🥩' : category === 'Recovery' ? '🌙' : category === 'Performance' ? '⚡' : '💊'}
                            </div>
                            <span className="font-bold text-white text-lg">{getCategoryLabel(category)}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 hidden md:block">{(items as Supplement[]).length} آیتم فعال</span>
                    </div>
                    
                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
                        {(items as Supplement[]).map((item, idx) => {
                            const isExpanded = expandedSupplements[item.name];
                            const priorityInfo = getPriorityLabel(item.priority);
                            
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => toggleSupplement(item.name)}
                                    className={`relative bg-slate-950 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
                                        isExpanded 
                                            ? 'border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.15)] col-span-1 md:col-span-2' 
                                            : 'border-slate-800 hover:border-slate-600'
                                    }`}
                                >
                                    {/* Priority Badge */}
                                    <div className={`absolute top-0 left-0 text-[10px] px-2 py-1 rounded-br-lg font-bold border-r border-b border-slate-900/30 ${priorityInfo.color}`}>
                                        اولویت: {priorityInfo.text}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3 pt-4 md:pt-2">
                                            <h5 className="font-bold text-white text-lg group-hover:text-teal-400 transition-colors flex items-center gap-2">
                                                {item.name}
                                                {isExpanded ? (
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                )}
                                            </h5>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono flex items-center gap-1">
                                                🕒 {item.usage}
                                            </span>
                                        </div>
                                        
                                        <p className="text-xs text-slate-400 leading-snug mb-3 text-justify">
                                            {item.reason}
                                        </p>

                                        {/* Expanded Content - Deep Dive */}
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-slate-800 animate-fade-in">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 relative overflow-hidden group/card">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                                                        <span className="text-[10px] text-teal-500 font-bold uppercase block mb-1">دوز دقیق مصرفی (Dosage)</span>
                                                        <span className="text-white font-mono text-sm font-bold">{item.dosage || 'طبق دستور روی محصول'}</span>
                                                    </div>
                                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                                        <span className="text-[10px] text-blue-500 font-bold uppercase block mb-1">مکانیزم اثر (علمی)</span>
                                                        <span className="text-slate-300 text-xs leading-relaxed">{item.mechanism || 'بهبود عملکرد از طریق مسیرهای متابولیک'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Tech Line Decor */}
                                    <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-teal-500 to-transparent transition-all duration-500 ${isExpanded ? 'w-full' : 'w-0 group-hover:w-1/3'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            
             {/* Micro-Nutrients */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    ریزمغذی‌ها و ویتامین‌ها (Micronutrients)
                </div>
                <div className="flex flex-wrap gap-2">
                    {vitaminsList.map((vit, idx) => (
                        <span key={idx} className="bg-indigo-900/20 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg text-sm font-bold hover:bg-indigo-900/40 transition-colors cursor-default">
                            {vit}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Data Params Expander */}
       {plan.answers && (
        <div className="mb-8 bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
             <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full font-bold text-slate-400 hover:text-white transition-colors text-sm"
             >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    مشاهده پارامترهای ورودی
                </div>
                <svg className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
             </button>
             
             {showDetails && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-right">
                    {QUESTIONS.map(q => (
                        <div key={q.id} className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase">{q.text}</span>
                            <span className="text-sm font-mono text-white">
                                {plan.answers?.[q.id] || '---'}
                            </span>
                        </div>
                    ))}
                </div>
             )}
        </div>
       )}

       {/* Medical Disclaimer */}
       <div className="mb-32 p-4 bg-red-900/10 border border-red-500/20 rounded-xl text-justify">
            <p className="text-xs text-red-400/80 leading-relaxed font-mono">
                [!] سلب مسئولیت سیستم: این خروجی توسط کامپیوتر و بر اساس مدل‌های آماری تولید شده است و به منزله مشاوره پزشکی نیست. قبل از تغییر رژیم غذایی یا مصرف مکمل، حتماً با پزشک متخصص مشورت کنید.
            </p>
       </div>

       {/* Sticky Action Bar */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-xl border-t border-teal-900/30 z-40 flex justify-center">
            <div className="w-full max-w-4xl flex gap-3 md:gap-4">
                 <button 
                    onClick={onReset}
                    className="w-1/3 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors text-sm uppercase tracking-wider"
                >
                    شروع مجدد
                </button>
                <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleWhatsappClick}
                    className="w-2/3 py-4 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] text-sm md:text-base uppercase tracking-widest clip-path-slant"
                >
                    <span className="animate-pulse">●</span> دریافت پک مکمل از واتساپ
                </a>
            </div>
       </div>

      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PlanDisplay;