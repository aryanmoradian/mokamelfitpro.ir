import React, { useRef, useState } from 'react';
import { analyzeImage } from '../services/geminiService';

const Tools: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const analysis = await analyzeImage(
            base64String, 
            "Analyze this image. If it is food, estimate calories and macros. If it is a physique, estimate body fat percentage. Respond in Persian."
        );
        setResult(analysis);
      } catch (error) {
        setResult("خطا در پردازش تصویر.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto border-t border-slate-200 pt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">ابزارهای هوشمند ساسکا</h3>
      
      <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-slate-500 mb-4">آپلود عکس غذا یا بدن برای آنالیز سریع</p>
        
        <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
        />
        
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2 mx-auto border border-slate-200"
            disabled={loading}
        >
            {loading ? (
                <span>در حال پردازش...</span>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    اسکن هوشمند
                </>
            )}
        </button>

        {result && (
            <div className="mt-4 text-right bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-200">
                {result}
            </div>
        )}
      </div>
    </div>
  );
};

export default Tools;