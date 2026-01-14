import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat, Scissors, Monitor, FileText, Users, Award,
  TrendingUp, FileEdit, History, GraduationCap, Briefcase,
  Code, Globe, Coffee, PenTool, BookOpen, Calendar,
  MessageCircle, User
} from 'lucide-react';
import { mockCategories } from '@/lib/mockData';

// 1. 確保 IconMap 在此頁面也能被讀取
const IconMap: Record<string, any> = {
  ChefHat,
  Scissors,
  Monitor,
  FileText,
  Users,
  Award,
  TrendingUp,
  FileEdit,
  History,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Coffee,
  PenTool,
  BookOpen,
  Calendar,
  MessageCircle
};

export default function ClassificationPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8">
      {/* 頁面標題區塊 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">探索分類</h1>
        <p className="text-zinc-500 text-sm">挑選感興趣的領域開始學習</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-white">全分類瀏覽</h2>
        </div>

        {/* 調整了 grid-cols，在手機上 3 欄，在平板以上改為 4 或 5 欄會更美觀 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {mockCategories.map((cat) => {
            const Icon = IconMap[cat.icon] || User; // 如果找不到對應 icon 則顯示預設 User
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-zinc-100 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                onClick={() => navigate(`/category/${cat.id}`)}
              >
                 <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                   <Icon size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-xs text-zinc-800 dark:text-white mb-0.5">{cat.name}</h3>
                   <p className="text-[10px] text-zinc-400">{cat.count}+</p>
                 </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
