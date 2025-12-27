import { GoogleGenAI } from "@google/genai";

// مطمئن شوید GEMINI_API_KEY در environment variables تعریف شده باشد
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * ارسال پیام به AI و دریافت پاسخ
 * @param {Array} history - آرایه پیام‌های قبلی [{role, parts: [{text}]}]
 * @param {string} message - پیام فعلی کاربر
 * @returns {string} پاسخ AI
 */
export const chatWithSaska = async (history, message) => {
  try {
    // ساخت چت
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview", // مدل مورد استفاده
      history, // تاریخچه پیام‌ها
      config: {
        systemInstruction: "You are Saska, a Persian-speaking fitness AI assistant. Be concise and scientific.",
      },
    });

    // ارسال پیام کاربر
    const result = await chat.sendMessage({ message });

    return result.text; // پاسخ AI
  } catch (err) {
    console.error("Error in chatWithSaska:", err);
    throw new Error("AI service failed");
  }
};
