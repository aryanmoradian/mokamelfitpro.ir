import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';
import { StaticPageType } from './StaticPages';

interface FooterProps {
  onPageClick?: (page: StaticPageType) => void;
}

const Footer: React.FC<FooterProps> = ({ onPageClick }) => {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 mt-20 border-t-2 border-teal-900/50 relative overflow-hidden">
      {/* Background Tech Mesh */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
            style={{ 
                backgroundImage: 'linear-gradient(0deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px' 
            }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & System Status */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-slate-900 rounded-lg flex items-center justify-center text-white font-black text-2xl italic transform -skew-x-12 shadow-[0_0_15px_rgba(20,184,166,0.5)] border border-teal-500/30">
                M
              </div>
              <div>
                 <span className="block text-2xl font-black text-white tracking-tighter italic leading-none uppercase">MOKAMEL <span className="text-teal-600">FIT PRO</span></span>
                 <span className="text-[0.6rem] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Engineered by Saska AI</span>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed font-mono opacity-70 border-l-2 border-slate-800 pl-3">
              // آنالیز هوشمند بیومتریک<br/>
              // بهینه‌سازی شده برای هایپرتروفی<br/>
              // تاسیس ۲۰۲۴
            </p>

            {/* Live Indicators */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">وضعیت سیستم</div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">موتور هوش مصنوعی</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 font-mono">آنلاین</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">پایگاه داده MFP</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 font-mono">متصل</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm border-b border-teal-900/30 pb-2 w-fit">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                  <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-slate-600 group-hover:bg-teal-500 transition-colors"></span>
                      شروع آنالیز
                  </button>
              </li>
              <li>
                  <button onClick={() => onPageClick?.('faq')} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-slate-600 group-hover:bg-teal-500 transition-colors"></span>
                      سوالات متداول
                  </button>
              </li>
              <li>
                  <button onClick={() => onPageClick?.('about')} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-slate-600 group-hover:bg-teal-500 transition-colors"></span>
                      درباره ما
                  </button>
              </li>
              <li>
                  <button onClick={() => onPageClick?.('contact')} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-slate-600 group-hover:bg-teal-500 transition-colors"></span>
                      تماس با پشتیبانی
                  </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm border-b border-teal-900/30 pb-2 w-fit">قوانین و مقررات</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                  <button onClick={() => onPageClick?.('disclaimer')} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="text-red-500 text-xs">[!]</span>
                      سلب مسئولیت پزشکی
                  </button>
              </li>
              <li>
                  <button onClick={() => onPageClick?.('terms')} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-slate-600 group-hover:bg-teal-500 transition-colors"></span>
                      شرایط استفاده
                  </button>
              </li>
              <li>
                  <button onClick={() => onPageClick?.('privacy')} className="hover:text-teal-400 hover:pl-2 transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-slate-600 group-hover:bg-teal-500 transition-colors"></span>
                      حریم خصوصی
                  </button>
              </li>
            </ul>
          </div>

          {/* Direct Line CTA */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm border-b border-teal-900/30 pb-2 w-fit">ارتباط مستقیم</h4>
            <p className="text-xs text-slate-500 mb-4 font-mono">
                اتصال امن به متخصصین مکمل و تغذیه.
            </p>
            <a 
              href={whatsappLink}
              target="_blank" 
              rel="noreferrer"
              className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-4 rounded-none skew-x-[-10deg] transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] border border-green-400/30"
            >
              <div className="skew-x-[10deg] flex items-center gap-3">
                  <svg className="w-6 h-6 animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span className="font-bold tracking-widest uppercase text-sm">شروع گفتگو</span>
              </div>
            </a>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                <span>کارشناسان آنلاین</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-mono">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-right">
              <span>© 2026 MOKAMEL FIT PRO. تمامی حقوق محفوظ است.</span>
              <span className="hidden md:block text-slate-800">|</span>
              <span className="text-slate-500">طراحی و توسعه توسط آریان مرادیان</span>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
              <span>امن و رمزنگاری شده</span>
              <span>•</span>
              <span>موتور ساسکا نسخه ۳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;