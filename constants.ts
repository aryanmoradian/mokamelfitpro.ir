import { Question } from "./types";

export const WHATSAPP_NUMBER = "989981749697";

// Only the absolute mathematical essentials are static.
// Everything else (Lifestyle, Diet, Injuries, Sleep) will be asked dynamically by AI.
export const BASE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "جنسیت بیولوژیک شما؟",
    type: "select",
    options: ["مرد", "زن"]
  },
  {
    id: 2,
    text: "سن دقیق (سال):",
    type: "number"
  },
  {
    id: 3,
    text: "قد (سانتی‌متر):",
    type: "number"
  },
  {
    id: 4,
    text: "وزن فعلی (کیلوگرم):",
    type: "number"
  },
  {
    id: 5,
    text: "هدف نهایی شما چیست؟",
    type: "select",
    options: ["کاهش چربی و کات", "افزایش حجم عضلانی", "افزایش قدرت بدنی", "حفظ تناسب اندام"]
  }
];

export const QUESTIONS = BASE_QUESTIONS; // Backward compatibility alias