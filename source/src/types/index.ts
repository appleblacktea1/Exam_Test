export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar: string;
  level: number;
  xp: number;
  maxExp: number;
  stamina: number;
  maxStamina: number;
  coins: number;
  diamonds: number;
  streak: number;
  badges: string[];
  completedQuestions: string[];
  certificationTarget?: string;
  enrolledCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  price: number;
  rating: number;
  students: number;
  imageUrl: string;
  tags: string[];
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  certificationType: string;
  difficultyLevel: number;
  orderIndex: number;
  status: 'locked' | 'unlocked' | 'completed';
  stars: 0 | 1 | 2 | 3;
  examId?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  exams?: Exam[]; // Optional, if we want to nest exams
}

export interface Exam {
  id: string;
  name: string;
  candidates: number;
}

export interface Question {
  id: string;
  category: string;
  stageId?: string; // Added stageId
  type: 'multiple-choice' | 'code' | 'text';
  difficulty: 'easy' | 'medium' | 'hard' | number; // Allow number for compatibility with Quiz.tsx local mock
  text: string;
  options: string[]; // Made required as it's used everywhere
  correctAnswer: number; // Index 0-3
  explanation: string;
  points: number;
  tags?: string[];
  certificationType?: string; // Added for Quiz.tsx compatibility
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  answers: {
    questionId: string;
    selectedOption: number | string;
    isCorrect: boolean;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  imageUrl: string;
  tag?: string;
  color?: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
  change: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  label?: string; // For compatibility
  color?: string; // For compatibility
}

export interface Battle {
  id: string;
  player1: User;
  player2?: User; // Bot or matched player
  status: 'waiting' | 'in-progress' | 'completed';
  winnerId?: string;
  mode: 'ranked' | 'quick' | 'friend';
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'diamonds';
  imageUrl?: string;
  icon?: string;
  type: 'consumable' | 'permanent' | 'subscription';
  tags?: string[];
}

export interface ShopBundle {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: 'coins' | 'diamonds';
  items: string[]; // List of item names or descriptions
  imageUrl?: string;
  endDate?: string; // For limited time offers
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}
