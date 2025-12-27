import React, { useState, useRef, useEffect } from "react";
import { chatWithSaska } from "../services/geminiService";
import { ChatMessage } from "../types";

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "درود! من ساسکا هستم. سوالی در مورد نحوه دریافت مکمل یا آنالیز بدن داری؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسکرول خودکار
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setIsLoading(true);

    // پیام کاربر
    const userMsg: ChatMessage = { role: "user", text: userText };

    // آپدیت پیام‌ها و گرفتن نسخه جدید
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMsg];

      // تاریخچه صحیح برای Gemini
      const history = updatedMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      // ارسال به AI
      chatWithSaska(history, userText)
        .then((responseText) => {
          setMessages((prev) => [
            ...prev,
            { role: "model", text: responseText },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              text:
                "متاسفانه خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.",
            },
          ]);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return updatedMessages;
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 left-4 md:bottom-6 md:left-6 w-14 h-14 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition z-40 text-teal-600"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 md:left-6 w-[calc(100%-2rem)] md:w-96 h-[500px] bg-white border rounded-2xl shadow-2xl z-40 flex flex-col">
          <div className="p-4 border-b font-bold text-slate-800">
            پشتیبانی آنلاین ساسکا
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-slate-100 text-slate-800"
                      : "bg-teal-500 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-sm text-slate-400">در حال پاسخ...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="سوال خود را بنویسید..."
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-teal-600 text-white px-4 rounded disabled:opacity-50"
            >
              ارسال
            </button>
          </div>
        </div>
      )}
    </>
  );
};

<<<<<<< HEAD
/* ======================
   PROTECTED ROUTE
====================== */
app.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, createdAt: true },
  });

  res.json(user);
});

/* ======================
   GRACEFUL SHUTDOWN
====================== */
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

/* ======================
   START SERVER
====================== */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/ai/chat", authMiddleware, async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history,
      config: {
        systemInstruction:
          "You are Saska, a Persian-speaking fitness AI assistant. Be concise and scientific.",
      },
    });

    const result = await chat.sendMessage({ message });

    res.json({ answer: result.text });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});
=======
export default ChatAssistant;
>>>>>>> f725c07d2a8c4c21a73cafb55b421b6978601fba
