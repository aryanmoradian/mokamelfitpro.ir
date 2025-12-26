export interface Question {
  id: number;
  text: string;
  options?: string[];
  type: 'text' | 'select' | 'number';
}

export interface UserAnswers {
  [key: string]: string; // Changed key to string to support dynamic IDs
}

export interface InterviewStep {
  id: string;
  question: string;
  answer: string;
}

export interface Supplement {
  name: string;
  category: 'Protein' | 'Recovery' | 'Performance' | 'Health';
  reason: string;
  usage: string;
  dosage: string;
  mechanism?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface PlanResult {
  bodyCode: string;
  algorithmVersion: string;
  calories: number;
  phoneNumber?: string;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  goal?: string;
  userData?: {
    weight: number;
    height: number;
    age: number;
    gender: string;
  };
  answers?: UserAnswers;
  supplements: Supplement[];
  vitamins: string[];
  explanation: string;
  mealSuggestions: string[];
  date?: string; 
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  joinedAt: string;
  history: PlanResult[];
  role?: 'user' | 'admin';
}

export interface SystemLog {
  id: string;
  type: 'LOGIN' | 'REGISTER' | 'TEST_COMPLETE' | 'WHATSAPP_CLICK' | 'ADMIN_ACTION';
  userId?: string;
  details?: string;
  timestamp: string;
}