import React, { useState, useRef, useEffect } from "react";
import { chatWithSaska } from "../services/geminiService";
import { ChatMessage } from "../types";

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "درود! من ساسکا هستم. برای استفاده ابتدا وارد حساب شوید.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "لطفاً ابتدا وارد حساب کاربری شوید." },
      ]);
      return;
    }

    const userText = input.trim();
    setInput("");
    setIsLoading(true);

    const userMsg = { role: "user", text: userText };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const answer = await chatWithSaska(history, userText);

      setMessages((prev) => [
        ...prev,
        { role: "model", text: answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="fixed bottom-24 left-4 w-14 h-14 bg-white border-2 border-teal-500 rounded-full shadow-lg z-40"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-4 w-[90%] md:w-96 h-[500px] bg-white border rounded-xl shadow-2xl flex flex-col">
          <div className="p-3 border-b font-bold">پشتیبانی ساسکا</div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-left" : "text-right"}>
                <div className={`inline-block px-3 py-2 rounded ${
                  m.role === "user" ? "bg-slate-100" : "bg-teal-500 text-white"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded px-2"
              placeholder="پیام خود را بنویسید..."
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-teal-600 text-white px-4 rounded"
            >
              ارسال
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
