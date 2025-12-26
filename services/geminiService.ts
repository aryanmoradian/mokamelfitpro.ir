import { GoogleGenAI, Type } from "@google/genai";
import { PlanResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ALGORITHM_VERSION = "v4.0-DEEP-NEURAL";

/**
 * Generates a deterministic Body Code client-side
 */
const generateBodyCode = (): string => {
  const num = Math.floor(1000 + Math.random() * 9000);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  return `SASKA-${num}-${letter}`;
};

/**
 * Dynamic Question Generator (The Interviewer)
 */
export const generateNextQuestion = async (
    currentHistory: {question: string, answer: string}[], 
    baseData: string
): Promise<{ text: string, options?: string[] } | null> => {
    
    try {
        const prompt = `
            You are "Saska", an elite bodybuilding coach conducting a deep intake interview.
            
            BASE DATA:
            ${baseData}

            INTERVIEW HISTORY:
            ${currentHistory.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n')}

            Your goal is to ask the NEXT most important question to design a perfect supplement and nutrition plan.
            - Do NOT ask questions already answered.
            - Dig deeper into their lifestyle, stress, sleep quality, specific food allergies, injury history, or training intensity based on previous answers.
            - Be concise but professional.
            - Language: Persian (Farsi).
            
            Output JSON format:
            {
                "text": "The question string",
                "options": ["Option1", "Option2"] // Optional: Only provide options if it's a multiple choice question. If open-ended, leave null or empty array.
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        options: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            nullable: true
                        }
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return null;
    } catch (e) {
        console.error("Error generating question", e);
        // Fallback question if AI fails
        return { text: "آیا نکته خاص دیگری در مورد سلامتی شما وجود دارد که باید بدانم؟", options: [] };
    }
};

/**
 * Generates a comprehensive bodybuilding plan using Gemini 3 Flash
 */
export const generateFitnessPlan = async (answers: string): Promise<PlanResult> => {
  const clientBodyCode = generateBodyCode();

  try {
    const prompt = `
      You are the "Saska Nutrition Engine" (v4.0). Act as a professional bodybuilding nutritionist.
      
      COMPREHENSIVE USER DATA (Interview Transcript):
      ${answers}

      --- LOGIC INSTRUCTIONS ---
      1. **BMR & Calories**: Calculate BMR (Mifflin-St Jeor) and TDEE.
         - Fat Loss: Deficit 300-500 kcal.
         - Muscle Gain: Surplus 200-400 kcal.
         - Maintenance: TDEE.
      2. **Macros**:
         - Protein: 1.8g - 2.2g per kg bodyweight.
         - Fats: 0.8g - 1.0g per kg.
         - Carbs: Remainder.
      3. **Supplements**: Suggest 4-6 evidence-based supplements based on the DEEP interview data.
         - Must include a protein source (Whey/Vegan).
         - Must include a recovery aid (ZMA/Magnesium) if sleep is poor.
         - Must include performance aid (Creatine) if goal is muscle/strength.
         - Classify each as: 'Protein', 'Recovery', 'Performance', or 'Health'.
         - **IMPORTANT**: Provide precise dosage (e.g., "5g per day"), mechanism of action, and priority level.
      4. **Safety**: If age < 18, avoid hormonal boosters/fat burners.

      --- OUTPUT FORMAT ---
      Return ONLY valid JSON matching the schema below.
      Inject Body Code: "${clientBodyCode}"
      Inject Algorithm Version: "${ALGORITHM_VERSION}"
      Language: Persian (Farsi) ONLY. All text fields must be in Persian.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bodyCode: { type: Type.STRING },
            algorithmVersion: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            goal: { type: Type.STRING, description: "The extracted goal in Persian (e.g. کاهش وزن)" },
            userData: {
                type: Type.OBJECT,
                properties: {
                    weight: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                    age: { type: Type.NUMBER },
                    gender: { type: Type.STRING },
                }
            },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
              }
            },
            supplements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['Protein', 'Recovery', 'Performance', 'Health'] },
                    reason: { type: Type.STRING, description: "Why this user needs it (Persian)" },
                    usage: { type: Type.STRING, description: "Timing in Persian (e.g. بعد از تمرین)" },
                    dosage: { type: Type.STRING, description: "Specific dosage in Persian (e.g. ۵ گرم)" },
                    mechanism: { type: Type.STRING, description: "Short scientific explanation in Persian" },
                    priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                }
              }
            },
            vitamins: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            explanation: { type: Type.STRING, description: "Detailed strategy explanation in Persian" },
            mealSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PlanResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Plan Generation Error:", error);
    throw error;
  }
};

/**
 * Chat with Saska (General Assistant)
 */
export const chatWithSaska = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview', 
      history: history,
      config: {
        systemInstruction: "You are Saska, a smart AI assistant for fitness and bodybuilding. Speak Persian. Be concise and scientific.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "متاسفانه در ارتباط با سرور مشکلی پیش آمده. لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.";
  }
};

/**
 * Analyze Meal or Physique Photo
 */
export const analyzeImage = async (base64Image: string, promptText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: promptText }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};