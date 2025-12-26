import React, { useState, useRef, useEffect } from 'react';
import { chatWithSaska } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'سلام! من ساسکا هستم. سوالی در مورد نحوه دریافت مکمل یا آنالیز بدن داری؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithSaska(history, userMsg.text);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-4 md:bottom-6 md:left-6 w-14 h-14 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20 hover:scale-110 transition-transform z-40 text-teal-600"
      >
        {isOpen ? (
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 md:bottom-24 md:left-6 w-[calc(100%-2rem)] md:w-96 h-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
            <h3 className="text-slate-800 font-bold">پشتیبانی آنلاین ساسکا</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-100 text-slate-800 rounded-br-none' 
                    : 'bg-teal-500 text-white rounded-bl-none font-medium shadow-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-end">
                <div className="bg-teal-500/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
                   <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="سوال خود را بپرسید..."
              className="flex-1 bg-white text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 border border-slate-200"
            />
            <button 
              onClick={handleSend}
              className="bg-teal-600 p-2 rounded-lg text-white hover:bg-teal-700"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;