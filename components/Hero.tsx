import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col w-full bg-slate-950 text-white overflow-hidden font-sans">
      
      {/* --- LIVE TICKER (MARQUEE) --- */}
      <div className="bg-teal-600 py-3 overflow-hidden relative z-20 border-b-4 border-slate-900 shadow-xl">
        <div className="whitespace-nowrap animate-marquee flex gap-12 items-center text-sm font-black text-slate-900 uppercase tracking-widest italic">
            <span>MOKAMEL FIT PRO</span><span>//</span>
            <span>تغذیه حرفه‌ای</span><span>//</span>
            <span>آنالیز هوشمند</span><span>//</span>
            <span>موتور قدرتمند ساسکا</span><span>//</span>
            <span>هایپرتروفی</span><span>//</span>
            <span>افزایش قدرت</span><span>//</span>
            <span>بر پایه علم</span><span>//</span>
            <span>MOKAMEL FIT PRO</span><span>//</span>
            <span>تغذیه حرفه‌ای</span><span>//</span>
            <span>آنالیز هوشمند</span><span>//</span>
            <span>موتور قدرتمند ساسکا</span><span>//</span>
        </div>
      </div>

      {/* --- SECTION 1: HERO (THE ARENA) --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-10">
        
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(#0d9488 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
             }}>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-pulse-slow delay-700"></div>

        {/* Live Status Badge */}
        <div className="mb-8 inline-flex items-center gap-3 px-5 py-2 bg-slate-900/60 backdrop-blur-md border border-teal-500/30 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.2)] animate-fade-in-up hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,1)]"></span>
            </span>
            <span className="text-teal-400 font-mono text-xs font-bold tracking-[0.1em] uppercase">طراحی شده توسط هوش مصنوعی ساسکا</span>
        </div>

        <h1 className="text-6xl md:text-[7rem] font-black mb-4 leading-[0.85] tracking-tighter animate-fade-in-up delay-100 z-10 drop-shadow-2xl italic">
            <span className="block text-white relative z-10">MOKAMEL</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-white to-teal-400 bg-300% animate-gradient relative z-10">
                FIT PRO
            </span>
        </h1>

        <p className="text-xl md:text-3xl text-slate-300 max-w-3xl mb-12 leading-relaxed font-bold animate-fade-in-up delay-200 z-10 tracking-tight">
            اولین پلتفرم <span className="text-teal-400 inline-block border-b-2 border-teal-500/50 pb-1">مهندسی بدن</span> بر پایه هوش مصنوعی.
            <br className="hidden md:block"/>
            <span className="text-slate-400 font-medium text-lg md:text-2xl mt-2 block">
                محاسبه دقیق کد بیولوژیک + استراتژی مکمل بدون آزمون و خطا
            </span>
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg md:max-w-none justify-center animate-fade-in-up delay-300 z-10">
            <button
                onClick={onStart}
                className="group relative px-14 py-6 bg-teal-600 hover:bg-teal-500 text-white font-black text-xl rounded-xl skew-x-[-12deg] transition-all hover:scale-105 shadow-[0_0_30px_rgba(20,184,166,0.4)] border border-teal-400/20"
            >
                <div className="skew-x-[12deg] flex items-center gap-3 uppercase tracking-wider">
                    شروع آنالیز حرفه‌ای
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
            </button>
            <button
                onClick={() => document.getElementById('concept-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-14 py-6 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-white text-slate-300 hover:text-white font-black text-xl rounded-xl skew-x-[-12deg] transition-all backdrop-blur-sm"
            >
                <div className="skew-x-[12deg] uppercase tracking-wider">
                    چطور کار می‌کند؟
                </div>
            </button>
        </div>

        {/* Floating Stats Card (Visual Decor) */}
        <div className="absolute hidden lg:block right-16 top-1/3 bg-slate-900/90 backdrop-blur border border-slate-700/50 p-5 rounded-2xl rotate-6 animate-float shadow-2xl z-0 max-w-[220px]">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-mono uppercase tracking-wider">
                <span>ریکاوری عضلانی</span>
                <span className="text-teal-400 font-bold">▲ 100%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-2">
                <div className="bg-gradient-to-r from-teal-600 to-teal-400 w-[98%] h-full rounded-full"></div>
            </div>
            <div className="text-[10px] text-slate-500 text-right">بهینه‌سازی هوشمند</div>
        </div>
        
        <div className="absolute hidden lg:block left-16 bottom-1/3 bg-slate-900/90 backdrop-blur border border-slate-700/50 p-5 rounded-2xl -rotate-6 animate-float delay-1000 shadow-2xl z-0">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 text-white flex items-center justify-center shadow-lg">
                    <span className="font-black italic text-xl">Id</span>
                </div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">هویت زیستی</div>
                    <div className="font-black text-white text-xl italic">SASKA-X</div>
                </div>
             </div>
        </div>
      </section>

      {/* --- SECTION 2: THE METRIC (Body Code) --- */}
      <section id="concept-section" className="py-28 bg-slate-900 relative border-t border-slate-800">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-20">
                
                {/* Visual Representation of Body Code */}
                <div className="flex-1 relative w-full max-w-lg">
                    <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-950 p-1.5 rounded-[2rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 border border-slate-700 group">
                        <div className="bg-slate-950 rounded-[1.8rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs font-mono text-teal-500 uppercase tracking-widest font-bold">آنالیز زنده</span>
                                </div>
                                <div className="text-slate-700">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.59-4.18M5.55 17.55l-1 1-1 1" /></svg>
                                </div>
                            </div>

                            <div className="text-center mb-10">
                                <div className="text-slate-500 text-xs font-bold tracking-[0.4em] mb-4 uppercase">شناسه بیولوژیک شما</div>
                                <div className="text-5xl md:text-6xl font-mono font-black text-white tracking-wider flex justify-center gap-1">
                                    <span>MFP</span><span className="text-teal-500 animate-pulse">-</span><span>89</span><span className="text-teal-500 animate-pulse">-</span><span>X</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-teal-500/30 transition-colors">
                                    <div className="text-[9px] text-slate-500 mb-2 uppercase font-bold tracking-wider">متابولیسم</div>
                                    <div className="font-black text-teal-400 text-sm">سریع</div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors">
                                    <div className="text-[9px] text-slate-500 mb-2 uppercase font-bold tracking-wider">تیپ</div>
                                    <div className="font-black text-blue-400 text-sm">مزومورف</div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-purple-500/30 transition-colors">
                                    <div className="text-[9px] text-slate-500 mb-2 uppercase font-bold tracking-wider">سطح</div>
                                    <div className="font-black text-purple-400 text-sm">حرفه‌ای</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-teal-500 blur-[100px] opacity-10 -z-10"></div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-right">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 italic uppercase leading-none">
                        کد بدن <span className="text-teal-500">MokamelFitPro</span> چیست؟
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl leading-loose mb-10 text-justify font-light">
                        در متدولوژی MokamelFitPro، "حدس زدن" منسوخ شده است. موتور هوش مصنوعی ما (Saska AI) با آنالیز ۱۰ فاکتور حیاتی، اثر انگشت بیولوژیک بدن شما را استخراج می‌کند. این کد، نقشه راه دقیقی برای ترکیب مکمل‌هایی است که دقیقاً برای سوخت و ساز بدن <span className="text-white font-bold border-b border-teal-500">شما</span> طراحی شده است.
                    </p>
                    <ul className="space-y-6">
                        {[
                            "تحلیل سرعت متابولیسم پایه (BMR)",
                            "شناسایی حفره‌های ریکاوری عضلانی",
                            "تنظیم دوز دقیق مکمل (Micro-Dosing)"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-5 text-slate-300 group">
                                <div className="w-10 h-10 rounded-xl bg-teal-500/5 flex items-center justify-center text-teal-500 font-bold border border-teal-500/20 group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors text-lg italic">
                                    {idx + 1}
                                </div>
                                <span className="text-lg font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
      </section>

      {/* --- SECTION 3: COMPARISON (Dark vs Light) --- */}
      <section className="py-28 bg-slate-950 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
              <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic">تفاوت در <span className="text-teal-500">علم</span> است</h2>
                  <p className="text-slate-500 text-xl font-light">چرا روش‌های سنتی دیگر پاسخگو نیستند؟</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Old Way */}
                  <div className="p-10 rounded-[2rem] border border-slate-800 bg-slate-900/50 backdrop-blur-sm grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-500 group">
                      <div className="text-5xl mb-6 text-slate-600 group-hover:text-red-500 transition-colors">
                         <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </div>
                      <h3 className="text-2xl font-black text-slate-300 mb-6 uppercase italic">روش سنتی و عمومی</h3>
                      <ul className="text-slate-500 space-y-5 text-base font-mono text-right">
                          <li className="flex items-center gap-3 justify-end">
                              فشار به کبد و کلیه
                              <span className="text-red-900 bg-red-500/10 p-1 rounded">✖</span>
                          </li>
                          <li className="flex items-center gap-3 justify-end">
                              هزینه برای مکمل‌های ناکارآمد
                              <span className="text-red-900 bg-red-500/10 p-1 rounded">✖</span>
                          </li>
                          <li className="flex items-center gap-3 justify-end">
                              استپ وزنی و عضلانی
                              <span className="text-red-900 bg-red-500/10 p-1 rounded">✖</span>
                          </li>
                      </ul>
                  </div>

                  {/* Saska Way */}
                  <div className="p-10 rounded-[2rem] border-2 border-teal-600 bg-slate-900 relative overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.15)] transform md:-translate-y-6 group">
                      <div className="absolute top-0 right-0 bg-teal-600 text-white text-xs font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest italic">Mokamel Fit Pro</div>
                      <div className="text-5xl mb-6 text-teal-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-6 uppercase italic">متد هوشمند MFP</h3>
                      <ul className="text-slate-300 space-y-5 text-base font-mono text-right">
                          <li className="flex items-center gap-3 justify-end">
                              <span className="text-white font-bold">جذب حداکثری مواد مغذی</span>
                              <span className="text-teal-400 bg-teal-500/10 p-1 rounded">✔</span>
                          </li>
                          <li className="flex items-center gap-3 justify-end">
                              <span className="text-white font-bold">تضمین سلامت اندام‌ها</span>
                              <span className="text-teal-400 bg-teal-500/10 p-1 rounded">✔</span>
                          </li>
                          <li className="flex items-center gap-3 justify-end">
                              <span className="text-white font-bold">رشد پایدار و علمی</span>
                              <span className="text-teal-400 bg-teal-500/10 p-1 rounded">✔</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* --- SECTION 4: PROCESS (Circuit) --- */}
      <section className="py-28 bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-4">
              <h2 className="text-4xl md:text-6xl font-black text-center text-white mb-24 uppercase italic">چرخه <span className="text-teal-500">تکامل</span></h2>
              
              <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 hidden md:block z-0"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                      {[
                          { step: "01", title: "ورود اطلاعات", desc: "ثبت مشخصات بیومتریک", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /> },
                          { step: "02", title: "پردازش هوشمند", desc: "تحلیل توسط هسته ساسکا", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /> },
                          { step: "03", title: "تولید کد بدن", desc: "صدور شناسه اختصاصی", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /> },
                          { step: "04", title: "دریافت برنامه", desc: "اجرای استراتژی نهایی", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /> }
                      ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center group">
                              <div className="w-28 h-28 rounded-3xl bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-teal-400 mb-8 shadow-2xl group-hover:border-teal-500 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] group-hover:scale-110 transition-all duration-300 relative transform rotate-45 group-hover:rotate-0">
                                  <svg className="w-10 h-10 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      {item.icon}
                                  </svg>
                                  <span className="absolute -bottom-6 bg-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full font-mono font-bold border border-slate-700 group-hover:text-teal-400 group-hover:border-teal-500/50 transform -rotate-45 group-hover:rotate-0 transition-all duration-300">
                                      مرحله {item.step}
                                  </span>
                              </div>
                              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide italic">{item.title}</h3>
                              <p className="text-slate-500 text-sm max-w-[180px] font-medium">{item.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* --- SECTION 5: FINAL CALL TO ACTION --- */}
      <section className="py-32 px-4 relative overflow-hidden">
          {/* Background Image/Effect */}
          <div className="absolute inset-0 bg-teal-700 z-0">
             <div className="absolute inset-0 bg-slate-900 opacity-90 mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
              <h2 className="text-5xl md:text-8xl font-black text-white mb-10 uppercase italic leading-none">
                  حدس نزنید.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-white">تکامل یابید.</span>
              </h2>
              <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                  بدن شما آزمایشگاه نیست. همین حالا کد اختصاصی <span className="font-bold text-white">MokamelFitPro</span> را دریافت کنید و مسیر حرفه‌ای را شروع کنید.
              </p>
              
              <button
                  onClick={onStart}
                  className="bg-white text-slate-900 px-16 py-6 font-black text-xl rounded-full hover:bg-teal-400 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transform duration-200 uppercase tracking-widest italic"
              >
                  شروع آنالیز رایگان
              </button>
              
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-xs font-bold font-mono uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>آنالیز رایگان</span>
                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>داده‌های امن</span>
                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>نتیجه فوری</span>
              </div>
          </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translateY(0px) rotate(6deg); }
            50% { transform: translateY(-20px) rotate(6deg); }
            100% { transform: translateY(0px) rotate(6deg); }
        }
        .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient {
            animation: gradient 5s ease infinite;
            background-size: 200% auto;
        }
      `}</style>

    </div>
  );
};

export default Hero;