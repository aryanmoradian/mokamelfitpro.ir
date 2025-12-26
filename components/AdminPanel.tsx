import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { User, SystemLog } from '../types';

interface AdminPanelProps {
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'logs'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Protect Admin Route
  if (!user || user.role !== 'admin') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="bg-red-900/10 border border-red-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center max-w-md relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="text-5xl mb-4 animate-pulse">🚫</div>
                <h2 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-widest">دسترسی غیرمجاز</h2>
                <p className="text-slate-400 mb-6 font-mono text-sm">شما مجوز ورود به مرکز فرماندهی ساسکا را ندارید.</p>
                <button onClick={onExit} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">بازگشت به پایگاه</button>
            </div>
        </div>
    );
  }

  useEffect(() => {
    loadData();
    // Auto refresh logs every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const loadData = async () => {
    const systemStats = await adminService.getSystemStats();
    const systemUsers = await adminService.getAllUsers();
    setStats(systemStats);
    setUsers(systemUsers);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.history[0]?.bodyCode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- SUB-COMPONENTS ---
  const StatCard = ({ title, value, icon, color, subtext }: any) => (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-teal-500/30 transition-all">
        <div className={`absolute top-0 right-0 w-1 h-full ${color}`}></div>
        <div className="flex justify-between items-start">
            <div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</div>
                <div className="text-3xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-right">{value}</div>
                {subtext && <div className="text-[10px] text-slate-600 mt-2 font-mono">{subtext}</div>}
            </div>
            <div className={`text-2xl opacity-50 ${color.replace('bg-', 'text-')}`}>
                {icon}
            </div>
        </div>
    </div>
  );

  const UserDetailModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
      const lastPlan = user.history[0];
      const [showPassword, setShowPassword] = useState(false);
      const [newPassword, setNewPassword] = useState('');
      const [isResetting, setIsResetting] = useState(false);

      const handlePasswordReset = async () => {
        if(!newPassword.trim()) return;
        setIsResetting(true);
        try {
            await adminService.resetUserPassword(user.id, newPassword);
            alert('رمز عبور کاربر با موفقیت تغییر کرد.');
            setNewPassword('');
            loadData(); // Reload to update list if needed
        } catch (error) {
            alert('خطا در تغییر رمز عبور');
        } finally {
            setIsResetting(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border border-teal-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                        <h3 className="font-bold text-white uppercase tracking-wider">پرونده دیجیتال کاربر</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold text-white border border-slate-700">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-teal-400 font-mono text-sm">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-slate-500 text-xs">رمز عبور فعلی:</span>
                                <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-xs flex items-center gap-2">
                                    <span className={showPassword ? 'text-white' : 'text-slate-500 blur-sm select-none'}>
                                        {(user as any).password || '******'}
                                    </span>
                                    <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-white">
                                        {showPassword ? (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">تغییر رمز عبور (Admin Force Reset)</h4>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="رمز عبور جدید..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                            />
                            <button 
                                onClick={handlePasswordReset}
                                disabled={!newPassword || isResetting}
                                className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs disabled:opacity-50 transition-colors"
                            >
                                {isResetting ? '...' : 'تغییر'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase block">تاریخ عضویت</span>
                            <span className="text-white font-mono text-sm">{new Date(user.joinedAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase block">تعداد تست</span>
                            <span className="text-white font-mono text-sm">{user.history.length}</span>
                        </div>
                    </div>

                    {lastPlan ? (
                        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/50">
                            <h4 className="text-teal-500 font-bold text-sm mb-4 border-b border-slate-800 pb-2 flex justify-between">
                                <span>آخرین آنالیز</span>
                                <span className="font-mono">{lastPlan.bodyCode}</span>
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                                <div><span className="block text-[10px] text-slate-500">سن</span><span className="text-white font-bold">{lastPlan.userData?.age}</span></div>
                                <div><span className="block text-[10px] text-slate-500">قد</span><span className="text-white font-bold">{lastPlan.userData?.height}</span></div>
                                <div><span className="block text-[10px] text-slate-500">وزن</span><span className="text-white font-bold">{lastPlan.userData?.weight}</span></div>
                                <div><span className="block text-[10px] text-slate-500">کالری</span><span className="text-white font-bold">{lastPlan.calories}</span></div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400"><span className="text-slate-500">هدف:</span> {lastPlan.goal}</p>
                                <p className="text-xs text-slate-400"><span className="text-slate-500">مکمل‌ها:</span> {lastPlan.supplements.map(s => s.name).join('، ')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            هنوز هیچ تستی انجام نشده است.
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
                    <button className="text-red-500 text-xs hover:underline">مسدود سازی کاربر</button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col" dir="rtl">
        {/* Top Command Bar */}
        <header className="bg-slate-900/90 backdrop-blur border-b border-teal-900/30 h-16 flex justify-between items-center px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(13,148,136,0.5)]">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div>
                    <h1 className="font-black text-white uppercase tracking-wider text-sm">مرکز فرماندهی <span className="text-teal-500">ساسکا</span></h1>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        سیستم آنلاین | سطح دسترسی: <span className="text-red-400">فوق امنیتی</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <span className="hidden md:block text-xs font-mono text-slate-500">{user.email}</span>
                <button onClick={onExit} className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-red-500/50 px-3 py-1.5 rounded bg-slate-900">
                    خروج
                    <svg className="w-4 h-4 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-20 md:w-64 bg-slate-900 border-l border-slate-800 flex flex-col items-center md:items-stretch py-6 gap-2">
                {[
                    { id: 'dashboard', label: 'داشبورد', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
                    { id: 'users', label: 'کاربران', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
                    { id: 'logs', label: 'لاگ سیستم', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full px-4 py-3 flex items-center justify-center md:justify-start gap-3 transition-all relative group ${
                            activeTab === item.id 
                            ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-500' 
                            : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                        <span className="hidden md:inline text-sm font-bold tracking-wide">{item.label}</span>
                        {activeTab === item.id && <div className="absolute inset-0 bg-teal-400 opacity-5 blur-md"></div>}
                    </button>
                ))}
            </aside>

            {/* Main Viewport */}
            <main className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                
                {activeTab === 'dashboard' && stats && (
                    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="کاربران کل" value={stats.totalUsers} icon="👥" color="bg-blue-500" subtext="پایگاه داده اصلی" />
                            <StatCard title="تست‌های انجام شده" value={stats.totalTests} icon="🧬" color="bg-purple-500" subtext="پردازش‌های هوش مصنوعی" />
                            <StatCard title="هدایت به واتساپ" value={stats.whatsappClicks} icon="💬" color="bg-green-500" subtext="لیدهای فروش" />
                            <StatCard title="نرخ تبدیل" value={`${stats.conversionRate}%`} icon="📈" color="bg-amber-500" subtext="بازدهی سیستم" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Live Logs Feed */}
                            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
                                <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-300 text-sm uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                        فید زنده فعالیت‌ها
                                    </h3>
                                    <span className="text-[10px] font-mono text-slate-600">REAL-TIME MONITORING</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs custom-scrollbar">
                                    {stats.logs.map((log: SystemLog) => (
                                        <div key={log.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded transition-colors border-l-2 border-transparent hover:border-teal-500">
                                            <span className="text-slate-500 w-16">{new Date(log.timestamp).toLocaleTimeString('fa-IR')}</span>
                                            <span className={`font-bold w-24 ${
                                                log.type === 'REGISTER' ? 'text-blue-400' :
                                                log.type === 'WHATSAPP_CLICK' ? 'text-green-400' :
                                                log.type === 'LOGIN' ? 'text-amber-400' : 'text-purple-400'
                                            }`}>[{log.type}]</span>
                                            <span className="text-slate-300 truncate flex-1">{log.details}</span>
                                            <span className="text-slate-600">{log.userId?.substring(0,6)}...</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Health */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-300 text-sm uppercase mb-6">وضعیت سلامت سرور</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                                            <span>ظرفیت دیتابیس</span>
                                            <span className="text-teal-400">12%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-teal-500 w-[12%] h-full rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                                            <span>تأخیر API (هوش مصنوعی)</span>
                                            <span className="text-green-400">45ms</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-green-500 w-[80%] h-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
                                        <div className="text-3xl">🛡️</div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold uppercase">پروتکل امنیتی</div>
                                            <div className="text-sm text-white font-mono">TLS 1.3 ENCRYPTED</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <span className="text-teal-500">///</span> پایگاه داده کاربران
                            </h2>
                            <div className="relative w-full md:w-96">
                                <input 
                                    type="text" 
                                    placeholder="جستجو بر اساس نام، ایمیل یا کد بدن..." 
                                    className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-teal-500 transition-colors pl-10 text-sm font-mono"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                            <table className="w-full text-right">
                                <thead className="bg-slate-950 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-800 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">کاربر</th>
                                        <th className="px-6 py-4">اطلاعات تماس</th>
                                        <th className="px-6 py-4">آخرین فعالیت</th>
                                        <th className="px-6 py-4 text-center">وضعیت کد</th>
                                        <th className="px-6 py-4 text-center">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-teal-500 border border-slate-700">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-white">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{u.email}</td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="flex flex-col">
                                                    <span>{new Date(u.joinedAt).toLocaleDateString('fa-IR')}</span>
                                                    <span className="text-[10px] text-slate-600 font-mono">ID: {u.id.substring(0,8)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {u.history.length > 0 ? (
                                                    <span className="bg-teal-900/30 text-teal-400 px-2 py-1 rounded border border-teal-500/20 font-mono text-xs font-bold">
                                                        {u.history[0].bodyCode}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedUser(u)}
                                                    className="text-xs bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 px-3 py-1.5 rounded transition-colors border border-slate-700"
                                                >
                                                    پرونده
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-slate-500">
                                                داده‌ای مطابق جستجو یافت نشد.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* LOGS TAB - Simplified reuse of Dashboard Log View but Full Page */}
                {activeTab === 'logs' && stats && (
                     <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[80vh]">
                        <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm uppercase">لاگ کامل سیستم</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs custom-scrollbar">
                            {stats.logs.map((log: SystemLog) => (
                                <div key={log.id} className="flex gap-4 p-2 hover:bg-slate-800 border-b border-slate-800/50">
                                    <span className="text-slate-500 min-w-[150px]">{log.timestamp}</span>
                                    <span className="text-teal-500 font-bold min-w-[120px]">{log.type}</span>
                                    <span className="text-slate-300">{log.details}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </main>
        </div>

        {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default AdminPanel;