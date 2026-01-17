import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Briefcase, Code,
  Globe, Coffee, PenTool, Scissors, BookOpen,
  Heart, ChevronDown, LayoutGrid, Zap
} from 'lucide-react';
import { mockCategories } from '@/lib/mockData';
import { cn } from '@/lib/utils';
// 引入 Hook
import { useFavorites } from '@/context/FavoritesContext';

const IconMap: Record<string, any> = {
  Briefcase, Code, Globe, Coffee, PenTool, Scissors, Users, BookOpen
};

export default function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = mockCategories.find(c => c.id === id);

  // --- 使用全域收藏狀態 ---
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set([0]));

  if (!category) return <div>找不到分類</div>;

  const Icon = IconMap[category.icon] || BookOpen;

  const toggleGroup = (index: number) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-safe">
      {/* Header (保持不變) */}
      <div className={`${category.color} text-white px-4 pt-4 pb-10 rounded-b-[2.5rem] shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <button onClick={() => navigate('/CLassification')} className="mb-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors inline-flex">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-md border border-white/20">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
              <p className="text-white/80 text-sm">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 列表內容 */}
      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-4 relative z-20">
        {category.groups && category.groups.length > 0 ? (
          category.groups.map((group, gIdx) => {
            const isOpen = openGroups.has(gIdx);
            return (
              <div key={gIdx} className="space-y-2">
                <button onClick={() => toggleGroup(gIdx)} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                      <LayoutGrid size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{group.groupName}</span>
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md font-black">
                      {group.exams.length}
                    </span>
                  </div>
                  <ChevronDown size={20} className={cn("text-zinc-400 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                <div className={cn("grid transition-all duration-300 ease-in-out overflow-hidden", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="min-h-0 space-y-3 px-1">
                    {group.exams.map((exam) => {
                      // 1. 檢查是否已收藏
                      const isLiked = isFavorite(exam.id);

                      // 2. 切換收藏邏輯
                      const handleHeartClick = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (isLiked) {
                          removeFavorite(exam.id);
                        } else {
                          // 加入時，把顯示所需的資料一併存入
                          addFavorite({
                            id: exam.id,
                            name: exam.name,
                            category: category.name,
                            groupName: group.groupName,
                            icon: category.icon,
                            color: category.color
                          });
                        }
                      };

                      return (
                        <div key={exam.id} className="bg-white dark:bg-zinc-900/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-4">
                              <h3 className="font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
                                {exam.name}
                              </h3>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                                <span className="flex items-center gap-1">
                                  <Users size={12} /> {exam.candidates.toLocaleString()} 人瀏覽
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={handleHeartClick}
                              className={cn(
                                "p-2 rounded-xl transition-all active:scale-90",
                                isLiked ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" : "text-zinc-300 hover:text-zinc-400"
                              )}
                            >
                              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => navigate(`/practice/${exam.id}`)} className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold text-sm transition-all active:scale-95">
                              <Coffee size={16} /> 一般模式
                            </button>
                            <button onClick={() => navigate(`/challenge/${exam.id}`)} className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                              <Zap size={16} className="fill-white" /> 挑戰模式
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <BookOpen className="mx-auto w-12 h-12 text-zinc-200 mb-4" />
            <p className="text-zinc-500">此分類目前尚無分組資料</p>
          </div>
        )}
      </div>
    </div>
  );
}
