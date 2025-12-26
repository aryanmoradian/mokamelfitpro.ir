import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlanResult } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  onViewPlan: (plan: PlanResult) => void;
  onNewAssessment: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewPlan, onNewAssessment }) => {
  const { user, logout, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'profile'>('overview');
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Password Change State
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState('');

  if (!user) return null;

  const latestPlan = user.history.length > 0 ? user.history[0] : null;

  const handleCopyCode = () => {
    if (latestPlan) {
      navigator.clipboard.writeText(latestPlan.bodyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsappClick = () => {
    adminService.logEvent('WHATSAPP_CLICK', user.id, 'Clicked from Dashboard');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عمل غیرقابل بازگشت است و تمام داده‌های شما پاک خواهد شد.");
    if (confirmDelete) {
        setIsDeleting(true);
        try {
            await deleteAccount();
        } catch (e) {
            alert("خطا در حذف حساب کاربری");
            setIsDeleting(false);
        }
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
        setPassMessage('لطفا تمام فیلدها را پر کنید.');
        return;
    }
    if (newPassword !== confirmPassword) {
        setPassMessage('رمز عبور و تکرار آن مطابقت ندارند.');
        return;
    }
    try {
        await authService.updatePassword(user.id, newPassword);
        setPassMessage('رمز عبور با موفقیت تغییر کرد.');
        setTimeout(() => {
            setIsChangingPass(false);
            setPassMessage('');
            setNewPassword('');
            setConfirmPassword('');
        }, 1500);
    } catch (e) {
        setPassMessage('خطا در تغییر رمز عبور.');
    }
  };

  const getWhatsappLink = (plan: PlanResult | null) => {
    const baseMessage = "سلام، کد اختصاصی بدن خودم رو دریافت کردم و برای راهنمایی پیام دادم";
    const codePart = plan ? ` (کد: ${plan.bodyCode})` : "";
    const fullMessage = `${baseMessage}${codePart}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
  };

  // --- SUB-COMPONENTS ---

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative flex-1 py-4 text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2 overflow-hidden group ${
        activeTab === id 
          ? 'text-teal-400 bg-slate-900' 
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
      }`}
    >
      {/* Active Indicator Line */}
      {activeTab === id && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
      )}
      <div className={`transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="uppercase tracking-widest text-xs md:text-sm">{label}</span>
    </button>
  );

  const StatCard = ({ label, value, unit, color, icon }: { label: string, value: string | number, unit: string, color: string, icon?: string }) => (
    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all duration-300">
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${color} opacity-10 rounded-bl-[4rem] group-hover:opacity-20 transition-opacity`}></div>
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">{label}</span>
            {icon && <span className="text-lg opacity-80">{icon}</span>}
        </div>
        <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">{value}</span>
            <span className="text-xs text-teal-500 font-mono font-bold">{unit}</span>
        </div>
    </div>
  );

  // --- TAB CONTENT: OVERVIEW ---
  const renderOverview = () => {
    if (!latestPlan) {
      return (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-[0_0_30px_rgba(15,23,42,0.5)] border border-slate-700">📊</div>
          <h3 className="text-2xl font-black text-white mb-2 uppercase italic">داده‌ای یافت نشد</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm font-mono">
            // خطا: پروفایل ناقص است<br/>
            // برای تولید کد بدن، اولین آنالیز را شروع کنید.
          </p>
          <button onClick={onNewAssessment} className="group relative px-8 py-4 bg-teal-600 hover:bg-teal-500 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 uppercase tracking-widest flex items-center gap-2">
                شروع آنالیز
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>
        </div>
      );
    }

    const macroData = [
        { name: 'پروتئین', value: latestPlan.macros.protein, color: '#0ea5e9' },
        { name: 'کربوهیدرات', value: latestPlan.macros.carbs, color: '#10b981' },
        { name: 'چربی', value: latestPlan.macros.fats, color: '#f59e0b' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Status Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-teal-400 font-bold border border-slate-700">
                        {user.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-950 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white leading-none mb-1">{user.name}</h2>
                    <div className="text-[10px] text-teal-500 font-mono tracking-wider uppercase border border-teal-500/20 px-1.5 py-0.5 rounded bg-teal-500/10 w-fit">
                        سطح ۱ ورزشکاری
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                    <span>آخرین همگام‌سازی:</span>
                    <span className="text-slate-300">{latestPlan.date ? new Date(latestPlan.date).toLocaleDateString('fa-IR') : 'امروز'}</span>
                </div>
                <div className="w-px h-4 bg-slate-700"></div>
                <div className="flex items-center gap-2">
                    <span>وضعیت:</span>
                    <span className="text-green-400">بهینه</span>
                </div>
            </div>
        </div>

        {/* Digital ID Card (Saska ID) */}
        <div className="relative group perspective-1000">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-slate-950 rounded-[1.4rem] p-6 md:p-8 border border-slate-800 shadow-2xl overflow-hidden">
                {/* ID Card Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            <span className="text-[10px] font-mono tracking-[0.2em] text-teal-500 uppercase">شناسه پزشکی امن</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl md:text-5xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                                {latestPlan.bodyCode}
                            </span>
                            <button 
                                onClick={handleCopyCode}
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 hover:border-teal-500 flex items-center justify-center text-slate-400 hover:text-white transition-all group/copy"
                            >
                                {copied ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 group-hover/copy:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                            </button>
                        </div>
                        <div className="mt-4 flex gap-3">
                             <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-mono">الگوریتم: {latestPlan.algorithmVersion}</span>
                             <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-mono">امنیت: رمزنگاری شده</span>
                        </div>
                    </div>

                    <a 
                        href={getWhatsappLink(latestPlan)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleWhatsappClick}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] flex items-center justify-center gap-3 border border-green-400/30 group/btn"
                    >
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-green-600"></span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </div>
                        <div className="flex flex-col items-start text-left">
                             <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Secure Uplink</span>
                             <span className="text-sm font-black uppercase tracking-wide">دریافت مکمل‌ها</span>
                        </div>
                    </a>
                </div>
            </div>

            <div className="absolute -top-3 -left-3 text-slate-800 opacity-20 transform -rotate-12">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.59-4.18M5.55 17.55l-1 1-1 1" /></svg>
            </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="هدف" value={latestPlan.goal || 'تناسب اندام'} unit="" color="from-purple-600 to-purple-900" icon="🎯" />
            <StatCard label="وزن" value={latestPlan.userData?.weight || '-'} unit="kg" color="from-slate-600 to-slate-900" />
            <StatCard label="انرژی" value={latestPlan.calories} unit="کالری" color="from-amber-600 to-amber-900" />
            <StatCard label="پروتئین" value={latestPlan.macros.protein} unit="گرم" color="from-blue-600 to-blue-900" />
        </div>

        {/* Nutrition Visual + Supplements Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Macro Chart */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-6 rounded-2xl md:col-span-1 flex flex-col items-center justify-center relative">
                 <h4 className="text-xs font-bold text-slate-400 mb-6 w-full text-right uppercase tracking-wider border-b border-slate-800 pb-2">توزیع درشت‌مغذی‌ها</h4>
                 <div className="w-40 h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={macroData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                dataKey="value"
                                stroke="none"
                            >
                                {macroData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-white">100%</span>
                    </div>
                 </div>
                 <div className="flex justify-between w-full mt-6 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>PRO</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>CARB</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>FAT</span>
                 </div>
            </div>

            {/* Top Supplements */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-6 rounded-2xl md:col-span-2 relative">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">پروتکل‌های فعال (مکمل‌ها)</h4>
                    <button onClick={() => onViewPlan(latestPlan)} className="text-[10px] bg-slate-800 hover:bg-teal-900 text-teal-400 px-2 py-1 rounded border border-slate-700 transition-colors">
                        مشاهده گزارش کامل
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {latestPlan.supplements.slice(0, 4).map((sup, i) => (
                        <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4 group hover:border-teal-500/30 transition-all">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border shadow-inner ${
                                sup.category === 'Protein' ? 'bg-blue-900/20 border-blue-500/20 text-blue-400' :
                                sup.category === 'Recovery' ? 'bg-purple-900/20 border-purple-500/20 text-purple-400' :
                                sup.category === 'Performance' ? 'bg-orange-900/20 border-orange-500/20 text-orange-400' :
                                'bg-green-900/20 border-green-500/20 text-green-400'
                            }`}>
                                {sup.category === 'Protein' ? '🥩' : sup.category === 'Recovery' ? '🌙' : sup.category === 'Performance' ? '⚡' : '💊'}
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-200 text-sm group-hover:text-teal-400 transition-colors">{sup.name}</h5>
                                <p className="text-[10px] text-slate-500 font-mono">{sup.category.toUpperCase()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Motivation / Tip */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex gap-4 items-center">
             <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-xs md:text-sm text-blue-300 leading-relaxed font-mono">
                 نکته سیستم: شاخص‌های بیومتریک پویا هستند. اگر وزن بدن شما بیش از ۳ کیلوگرم تغییر کرد، برای دقت دوز مصرفی مجدداً اسکن انجام دهید.
             </p>
        </div>
      </div>
    );
  };

  // --- TAB CONTENT: HISTORY ---
  const renderHistory = () => (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            گزارش‌های آنالیز
        </h3>
        <span className="text-[10px] text-slate-600 font-mono">مجموع رکوردها: {user.history.length}</span>
      </div>

      {user.history.length === 0 ? (
        <p className="text-slate-500 text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 font-mono text-sm">داده‌های تاریخی موجود نیست.</p>
      ) : (
        <div className="space-y-3">
            {user.history.map((plan, idx) => (
                <div key={idx} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col md:flex-row justify-between items-center gap-4 group">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl flex flex-col items-center justify-center text-slate-500 font-mono border border-slate-800 shrink-0 shadow-inner">
                            <span className="text-[8px] font-bold uppercase text-slate-600">شناسه لاگ</span>
                            <span className="text-sm font-bold text-teal-500">#{user.history.length - idx}</span> 
                        </div>
                        <div>
                            <div className="font-mono font-bold text-white tracking-wide group-hover:text-teal-400 transition-colors">{plan.bodyCode}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1 font-mono">
                                <span>{plan.date ? new Date(plan.date).toLocaleDateString('fa-IR') : 'N/A'}</span>
                                <span className="text-slate-700">|</span>
                                <span>{plan.calories} کالری</span>
                                {plan.userData?.weight && (
                                    <>
                                    <span className="text-slate-700">|</span>
                                    <span>{plan.userData.weight} کیلوگرم</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        {plan.goal && (
                            <span className="px-3 py-2 bg-slate-950 text-slate-400 text-[10px] rounded-lg border border-slate-800 hidden md:block uppercase tracking-wider">
                                {plan.goal}
                            </span>
                        )}
                        <button 
                            onClick={() => onViewPlan(plan)}
                            className="px-4 py-2 bg-teal-900/20 text-teal-400 border border-teal-500/30 rounded-lg text-xs font-bold hover:bg-teal-500 hover:text-slate-900 transition-all flex-1 md:flex-none text-center uppercase tracking-wide"
                        >
                            مشاهده فایل
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );

  // --- TAB CONTENT: PROFILE ---
  const renderProfile = () => (
    <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur rounded-3xl p-8 border border-slate-800 text-center relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <div className="w-24 h-24 bg-gradient-to-tr from-teal-600 to-slate-700 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(20,184,166,0.2)] border-4 border-slate-800 relative z-10">
                {user.name.charAt(0)}
            </div>
            
            <h3 className="text-2xl font-black text-white mb-1 relative z-10">{user.name}</h3>
            <div className="relative z-10 inline-block">
                 <p className="text-slate-400 mb-8 font-mono bg-slate-950 border border-slate-800 px-3 py-1 rounded text-xs">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10 text-right relative z-10">
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                     <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">تاریخ عضویت</span>
                     <span className="font-bold text-slate-200 font-mono text-sm">{new Date(user.joinedAt).toLocaleDateString('fa-IR')}</span>
                 </div>
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                     <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">تعداد اسکن‌ها</span>
                     <span className="font-bold text-slate-200 font-mono text-sm">{user.history.length}</span>
                 </div>
            </div>
            
            <div className="max-w-xs mx-auto space-y-3 relative z-10">
                {!isChangingPass ? (
                    <button 
                        onClick={() => setIsChangingPass(true)}
                        className="w-full py-3 bg-slate-800 text-slate-400 rounded-xl font-bold border border-slate-700 hover:border-teal-500 hover:text-teal-400 transition-colors text-xs uppercase tracking-wider"
                    >
                        تغییر رمز عبور
                    </button>
                ) : (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 animate-slide-up">
                        <input 
                            type="password"
                            placeholder="رمز عبور جدید"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded mb-2 border border-slate-800 focus:outline-none focus:border-teal-500"
                        />
                        <input 
                            type="password"
                            placeholder="تکرار رمز عبور"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded mb-2 border border-slate-800 focus:outline-none focus:border-teal-500"
                        />
                        {passMessage && <p className={`text-[10px] mb-2 ${passMessage.includes('موفقیت') ? 'text-green-500' : 'text-red-500'}`}>{passMessage}</p>}
                        <div className="flex gap-2">
                            <button 
                                onClick={handleChangePassword} 
                                className="flex-1 bg-teal-600 text-white py-2 rounded text-xs font-bold"
                            >
                                ذخیره
                            </button>
                            <button 
                                onClick={() => { setIsChangingPass(false); setPassMessage(''); }}
                                className="flex-1 bg-slate-800 text-slate-400 py-2 rounded text-xs font-bold"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                )}

                <div className="h-px bg-slate-800 w-full my-4"></div>
                <button 
                onClick={logout}
                className="w-full py-3 bg-slate-900 text-slate-400 rounded-xl font-bold hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-slate-800"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                خروج از حساب
                </button>
                <button 
                onClick={handleDeleteAccount}
                className="w-full py-3 bg-red-900/10 border border-red-900/30 text-red-500 rounded-xl font-bold hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
                disabled={isDeleting}
                >
                   {isDeleting ? 'در حال حذف...' : 'حذف حساب کاربری (دائمی)'}
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Dashboard Tabs */}
      <div className="flex bg-slate-950/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-1 mb-8 sticky top-24 z-30">
        <TabButton 
            id="overview" 
            label="نمای کلی" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} 
        />
        <TabButton 
            id="history" 
            label="سوابق" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
        />
        <TabButton 
            id="profile" 
            label="پروفایل" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
        />
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default Dashboard;