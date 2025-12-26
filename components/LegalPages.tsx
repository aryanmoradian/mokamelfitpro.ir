import React from 'react';

interface LegalPagesProps {
  page: 'terms' | 'privacy' | 'disclaimer';
  onBack: () => void;
}

const LegalPages: React.FC<LegalPagesProps> = ({ page, onBack }) => {
  const renderContent = () => {
    switch (page) {
      case 'disclaimer':
        return (
          <>
            <h1 className="text-3xl font-black text-slate-800 mb-6 border-b border-slate-200 pb-4">سلب مسئولیت پزشکی (Medical Disclaimer)</h1>
            <div className="space-y-6 text-slate-700 leading-relaxed text-justify">
              <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded-lg">
                <p className="font-bold text-red-800 mb-2">هشدار مهم:</p>
                <p className="text-sm">اطلاعات ارائه شده توسط سیستم هوشمند ساسکا (Saska AI) صرفاً جهت اطلاع‌رسانی و آموزش عمومی است و نباید به عنوان جایگزین مشاوره پزشکی حرفه‌ای، تشخیص یا درمان در نظر گرفته شود.</p>
              </div>
              <p>
                ۱. <b>عدم جایگزینی پزشک:</b> تمامی پیشنهادات مکمل، رژیم غذایی و تمرینی که توسط این هوش مصنوعی ارائه می‌شود، بر اساس الگوریتم‌های عمومی و داده‌های ورودی شماست. این سیستم وضعیت بالینی، آزمایش‌های خون و بیماری‌های پنهان شما را بررسی نمی‌کند. لذا قبل از شروع هرگونه برنامه جدید، حتماً با پزشک متخصص یا متخصص تغذیه مشورت کنید.
              </p>
              <p>
                ۲. <b>ریسک استفاده:</b> استفاده از پیشنهادات این سیستم با مسئولیت کامل کاربر انجام می‌شود. ساسکا و تیم توسعه‌دهنده هیچ‌گونه مسئولیتی در قبال عوارض احتمالی ناشی از مصرف مکمل‌ها، انجام تمرینات یا تغییر رژیم غذایی ندارند.
              </p>
              <p>
                ۳. <b>بیماری‌های خاص:</b> اگر باردار هستید، شیر می‌دهید، داروی خاصی مصرف می‌کنید یا بیماری زمینه‌ای (مانند دیابت، فشار خون، مشکلات کلیوی و کبدی) دارید، استفاده از پیشنهادات این سیستم بدون تایید پزشک اکیداً ممنوع است.
              </p>
            </div>
          </>
        );
      case 'privacy':
        return (
          <>
            <h1 className="text-3xl font-black text-slate-800 mb-6 border-b border-slate-200 pb-4">سیاست حفظ حریم خصوصی (Privacy Policy)</h1>
            <div className="space-y-6 text-slate-700 leading-relaxed text-justify">
              <p>
                ساسکا (Saska AI) متعهد به حفظ حریم خصوصی کاربران است. این سند توضیح می‌دهد که ما چگونه اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم.
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-4">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li>اطلاعات حساب کاربری (نام، ایمیل).</li>
                <li>داده‌های فیزیکی (سن، قد، وزن، جنسیت) جهت محاسبه متابولیسم.</li>
                <li>پاسخ‌های شما به پرسشنامه سلامتی و سبک زندگی.</li>
                <li>لاگ‌های سیستمی جهت بهبود عملکرد و امنیت.</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mt-4">۲. نحوه استفاده از اطلاعات</h3>
              <p>
                اطلاعات شما صرفاً برای تولید برنامه شخصی‌سازی شده، محاسبه کد بدن و بهبود دقت الگوریتم هوش مصنوعی استفاده می‌شود. ما اطلاعات سلامت شما را به اشخاص ثالث، شرکت‌های تبلیغاتی یا بیمه‌ها نمی‌فروشیم.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-4">۳. امنیت داده‌ها</h3>
              <p>
                ما از پروتکل‌های استاندارد امنیتی برای ذخیره‌سازی داده‌ها استفاده می‌کنیم. با این حال، انتقال اطلاعات در اینترنت هرگز ۱۰۰٪ امن نیست. رمز عبور شما به صورت رمزنگاری شده ذخیره نمی‌شود (در نسخه دمو)، لذا از رمزهای عبور حیاتی خود در این سامانه استفاده نکنید.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-4">۴. حقوق شما (حذف حساب)</h3>
              <p>
                شما حق دارید هر زمان که بخواهید، درخواست حذف کامل حساب کاربری و تمامی داده‌های مرتبط با آن را بدهید. این گزینه در پنل کاربری بخش پروفایل موجود است.
              </p>
            </div>
          </>
        );
      case 'terms':
        return (
          <>
             <h1 className="text-3xl font-black text-slate-800 mb-6 border-b border-slate-200 pb-4">قوانین و شرایط استفاده (Terms of Service)</h1>
             <div className="space-y-6 text-slate-700 leading-relaxed text-justify">
              <p>
                با استفاده از وب‌سایت و خدمات ساسکا، شما موافقت خود را با شرایط زیر اعلام می‌دارید:
              </p>
              <p>
                ۱. <b>شرایط سنی:</b> استفاده از خدمات ساسکا برای افراد زیر ۱۸ سال تنها با نظارت والدین یا قیم قانونی مجاز است.
              </p>
              <p>
                ۲. <b>دقت اطلاعات:</b> شما متعهد می‌شوید که اطلاعات ورودی (وزن، قد، سن و...) را با صداقت و دقت وارد کنید. نتایج سیستم مستقیماً به دقت ورودی‌های شما وابسته است.
              </p>
              <p>
                ۳. <b>مالکیت معنوی:</b> کلیه حقوق مادی و معنوی الگوریتم، برند ساسکا، محتوا و طراحی سایت متعلق به تیم توسعه‌دهنده ساسکا می‌باشد. کپی‌برداری غیرمجاز پیگرد قانونی دارد.
              </p>
              <p>
                ۴. <b>خرید مکمل:</b> ساسکا صرفاً یک سیستم مشاوره هوشمند است. فرآیند خرید مکمل از طریق واتساپ و توسط تامین‌کنندگان مستقل انجام می‌شود. ساسکا مسئولیتی در قبال تاخیر ارسال پست یا مشکلات لجستیکی فروشندگان ندارد، هرچند ما تلاش می‌کنیم تنها تامین‌کنندگان معتبر را معرفی کنیم.
              </p>
              <p>
                ۵. <b>تغییرات:</b> ما حق داریم در هر زمان قوانین و شرایط استفاده را تغییر دهیم. ادامه استفاده شما از سایت به منزله پذیرش تغییرات است.
              </p>
             </div>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-bold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        بازگشت
      </button>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
        {renderContent()}
      </div>
    </div>
  );
};

export default LegalPages;