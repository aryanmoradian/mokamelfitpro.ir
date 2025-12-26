import React, { useState, useEffect, useRef } from 'react';
import { BASE_QUESTIONS } from '../constants';
import { UserAnswers, InterviewStep } from '../types';
import { generateNextQuestion } from '../services/geminiService';

interface AssessmentProps {
  onComplete: (answers: UserAnswers, phoneNumber: string) => void;
  onCancel: () => void;
  onLegalClick?: (page: 'terms' | 'privacy' | 'disclaimer') => void;
}

const MAX_DYNAMIC_QUESTIONS = 5; // AI asks 5 deep questions after base data

const Assessment: React.FC<AssessmentProps> = ({ onComplete, onCancel, onLegalClick }) => {
  // State: 'verification' -> 'base_questions' -> 'ai_interview'
  const [view, setView] = useState<'verification' | 'base_questions' | 'ai_interview'>('verification');
  
  // Verification State
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('saska_phone') || '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Base Questions State (Static)
  const [currentBaseStep, setCurrentBaseStep] = useState(0);
  const [baseAnswers, setBaseAnswers] = useState<UserAnswers>(
    localStorage.getItem('saska_base') ? JSON.parse(localStorage.getItem('saska_base')!) : {}
  );

  // AI Interview State (Dynamic)
  const [interviewHistory, setInterviewHistory] = useState<InterviewStep[]>([]);
  const [currentAiQuestion, setCurrentAiQuestion] = useState<{ text: string, options?: string[] } | null>(null);
  const [currentAiAnswer, setCurrentAiAnswer] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Auto-save logic
  useEffect(() => {
    localStorage.setItem('saska_base', JSON.stringify(baseAnswers));
  }, [baseAnswers]);

  const validateIranianPhone = (phone: string) => {
    const regex = /^09[0-9]{9}$/;
    return regex.test(phone);
  };

  const handleStart = () => {
    if (!validateIranianPhone(phoneNumber)) {
      setPhoneError('شماره موبایل نامعتبر است.');
      return;
    }
    if (!acceptedTerms) {
      setPhoneError('پذیرش قوانین الزامی است.');
      return;
    }
    setPhoneError('');
    localStorage.setItem('saska_phone', phoneNumber);
    setView('base_questions');
  };

  // --- BASE QUESTIONS HANDLERS ---
  const handleBaseAnswer = (value: string) => {
    const question = BASE_QUESTIONS[currentBaseStep];
    setBaseAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNextBase = () => {
    const question = BASE_QUESTIONS[currentBaseStep];
    if (!baseAnswers[question.id]) return;
    
    if (currentBaseStep < BASE_QUESTIONS.length - 1) {
      setCurrentBaseStep(prev => prev + 1);
    } else {
      // Transition to AI Interview
      setView('ai_interview');
      initiateAiInterview();
    }
  };

  // --- AI INTERVIEW HANDLERS ---
  const initiateAiInterview = async () => {
    setIsAiThinking(true);
    const baseDataString = BASE_QUESTIONS.map(q => `${q.text}: ${baseAnswers[q.id]}`).join('\n');
    
    // First dynamic question
    const question = await generateNextQuestion([], baseDataString);
    setCurrentAiQuestion(question);
    setIsAiThinking(false);
  };

  const handleAiAnswerSubmit = async () => {
    if (!currentAiAnswer.trim() || !currentAiQuestion) return;

    // Add to history
    const newHistory = [
      ...interviewHistory,
      { 
        id: `ai_${interviewHistory.length}`, 
        question: currentAiQuestion.text, 
        answer: currentAiAnswer 
      }
    ];
    setInterviewHistory(newHistory);
    setCurrentAiAnswer(''); // Clear input

    // Check if we reached the max depth
    if (newHistory.length >= MAX_DYNAMIC_QUESTIONS) {
       finalizeAssessment(newHistory);
       return;
    }

    // Generate NEXT question
    setIsAiThinking(true);
    setCurrentAiQuestion(null); // Clear previous question UI
    
    const baseDataString = BASE_QUESTIONS.map(q => `${q.text}: ${baseAnswers[q.id]}`).join('\n');
    const nextQ = await generateNextQuestion(newHistory, baseDataString);
    
    setCurrentAiQuestion(nextQ);
    setIsAiThinking(false);
  };

  const finalizeAssessment = (finalHistory: InterviewStep[]) => {
    // Merge all data
    const mergedAnswers: UserAnswers = { ...baseAnswers };
    finalHistory.forEach((step, idx) => {
        mergedAnswers[`ai_q_${idx}`] = `${step.question} -> ${step.answer}`;
    });
    
    onComplete(mergedAnswers, phoneNumber);
  };

  // --- VIEW 1: VERIFICATION ---
  if (view === 'verification') {
    return (
      <div className="w-full max-w-md mx-auto p-4 animate-fade-in relative z-10 mt-10">
         <div className="bg-slate-900/80 backdrop-blur-xl border border-teal-500/30 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(13,148,136,0.15)] text-center relative overflow-hidden">
            {/* ... Same Design as before ... */}
            <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl flex items-center justify-center text-teal-400 mx-auto mb-8 shadow-2xl border border-slate-700">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tight">احراز هویت</h2>
            <p className="text-slate-400 text-sm mb-8 font-mono">لطفا شماره موبایل خود را تایید کنید.</p>

            <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912xxxxxxx"
                className="w-full bg-slate-950 border-2 border-slate-800 text-white text-center text-2xl font-mono py-5 rounded-2xl mb-4 focus:border-teal-500 focus:outline-none"
            />

            <label className="flex items-center gap-2 text-right mb-6 justify-center">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="accent-teal-500 w-5 h-5"/>
                <span className="text-slate-500 text-xs">قوانین و مقررات را می‌پذیرم</span>
            </label>

            {phoneError && <p className="text-red-500 text-xs mb-4">{phoneError}</p>}

            <button onClick={handleStart} className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-slate-900 font-black rounded-xl uppercase">شروع آنالیز</button>
         </div>
      </div>
    );
  }

  // --- VIEW 2: BASE QUESTIONS (STATIC) ---
  if (view === 'base_questions') {
      const question = BASE_QUESTIONS[currentBaseStep];
      const progress = ((currentBaseStep + 1) / BASE_QUESTIONS.length) * 100;

      return (
        <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in relative z-10">
            <div className="flex justify-between items-end mb-6 font-mono text-xs">
                 <span className="text-slate-400">مرحله ۱: داده‌های پایه</span>
                 <span className="text-teal-500">{currentBaseStep + 1} / {BASE_QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-slate-800 h-1 mb-10 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-[2.5rem] p-6 md:p-12 shadow-2xl min-h-[400px] flex flex-col justify-center text-center">
                <h2 className="text-2xl font-black text-white mb-10">{question.text}</h2>
                
                <div className="space-y-4 mb-10">
                    {question.type === 'select' && question.options ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleBaseAnswer(opt)}
                                    className={`p-6 rounded-2xl border-2 transition-all font-bold text-lg ${baseAnswers[question.id] === opt ? 'bg-teal-900/20 border-teal-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <input
                            type="number"
                            value={baseAnswers[question.id] || ''}
                            onChange={(e) => handleBaseAnswer(e.target.value)}
                            className="w-full bg-slate-950 text-white p-6 rounded-2xl border-2 border-slate-800 focus:border-teal-500 focus:outline-none text-2xl text-center font-mono"
                            placeholder="عدد وارد کنید..."
                            onKeyDown={(e) => e.key === 'Enter' && handleNextBase()}
                            autoFocus
                        />
                    )}
                </div>

                <div className="flex justify-between pt-8 border-t border-slate-800">
                    <button onClick={() => currentBaseStep > 0 ? setCurrentBaseStep(p => p - 1) : setView('verification')} className="text-slate-500 font-bold px-6">بازگشت</button>
                    <button 
                        onClick={handleNextBase} 
                        disabled={!baseAnswers[question.id]}
                        className={`px-10 py-3 rounded-xl font-black transition-all ${!baseAnswers[question.id] ? 'bg-slate-800 text-slate-600' : 'bg-white text-slate-900 hover:scale-105'}`}
                    >
                        بعدی
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW 3: AI INTERVIEW (DYNAMIC) ---
  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in relative z-10">
        {/* Header HUD */}
        <div className="flex justify-between items-center mb-8 px-4 bg-slate-900/50 p-3 rounded-full border border-teal-900/30">
             <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping"></div>
                 <span className="text-teal-400 font-bold text-xs uppercase tracking-widest">مصاحبه عمیق هوشمند</span>
             </div>
             <div className="text-[10px] text-slate-500 font-mono">
                 SASKA NEURAL LINK V4.0
             </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-teal-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(13,148,136,0.1)] overflow-hidden min-h-[500px] flex flex-col relative">
            
            {/* History Fade */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none"></div>

            {/* Conversation Area */}
            <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
                {/* Previous Q&A */}
                {interviewHistory.map((step, idx) => (
                    <div key={idx} className="opacity-50 hover:opacity-100 transition-opacity">
                        <div className="flex gap-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-500 font-bold text-xs border border-teal-500/20 shrink-0">AI</div>
                            <p className="text-slate-300 text-sm bg-slate-800/50 p-3 rounded-2xl rounded-tl-none">{step.question}</p>
                        </div>
                        <div className="flex gap-4 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-700 shrink-0">ME</div>
                            <p className="text-slate-400 text-sm bg-slate-950 p-3 rounded-2xl rounded-tr-none border border-slate-800">{step.answer}</p>
                        </div>
                    </div>
                ))}

                {/* Current Active Question */}
                {isAiThinking ? (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(20,184,166,0.5)]">AI</div>
                        <div className="flex items-center gap-1 bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></span>
                            <span className="text-xs text-teal-400 ml-2 font-mono">ساسکا در حال تحلیل پاسخ شما...</span>
                        </div>
                    </div>
                ) : currentAiQuestion && (
                    <div className="animate-slide-up">
                        <div className="flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/20">AI</div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg md:text-xl leading-relaxed">{currentAiQuestion.text}</h3>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="mt-6 ml-14">
                            {currentAiQuestion.options && currentAiQuestion.options.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {currentAiQuestion.options.map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => { setCurrentAiAnswer(opt); setTimeout(() => handleAiAnswerSubmit(), 100); }} // Quick hack to set state then submit, ideally handle directly
                                            className="text-right p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:border-teal-500 hover:text-white transition-all hover:translate-x-1"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">
                                    <textarea
                                        value={currentAiAnswer}
                                        onChange={(e) => setCurrentAiAnswer(e.target.value)}
                                        placeholder="پاسخ خود را بنویسید..."
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-teal-500 focus:outline-none min-h-[100px] resize-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAiAnswerSubmit();
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <button 
                                        onClick={handleAiAnswerSubmit}
                                        disabled={!currentAiAnswer.trim()}
                                        className={`absolute bottom-3 left-3 p-2 rounded-lg transition-all ${currentAiAnswer.trim() ? 'bg-teal-600 text-white hover:bg-teal-500' : 'bg-slate-800 text-slate-600'}`}
                                    >
                                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Progress Bar for AI Interview */}
            <div className="h-1 bg-slate-800 w-full">
                <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${(interviewHistory.length / MAX_DYNAMIC_QUESTIONS) * 100}%` }}
                ></div>
            </div>
        </div>
    </div>
  );
};

export default Assessment;