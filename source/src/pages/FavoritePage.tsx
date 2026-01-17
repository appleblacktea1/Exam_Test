import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Search, Heart, User, Trash2, Tag, // 記得引入 Tag
  ChefHat, Scissors, Monitor, FileText, Users, Award,
  TrendingUp, FileEdit, History, GraduationCap, Briefcase,
  Code, Globe, Coffee, PenTool, BookOpen, Calendar,
  MessageCircle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';

const IconMap: Record<string, any> = {
  ChefHat, Scissors, Monitor, FileText, Users, Award,
  TrendingUp, FileEdit, History, GraduationCap, Briefcase,
  Code, Globe, Coffee, PenTool, BookOpen, Calendar,
  MessageCircle
};

export default function FavoritesPage() {
  const navigate = useNavigate();

  const { favorites, isLoading, removeFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // --- [修改重點 1] 動態計算標籤清單 ---
  // 自動從收藏的考卷中，找出所有的 groupName (或 category)
  const categoryTabs = useMemo(() => {
    const tabs = new Set<string>(['全部']); // 預設一定有「全部」

    favorites.forEach(item => {
      // 優先使用 groupName，如果沒有 groupName 則使用 category (避免有的考卷沒分組)
      const label = item.groupName || item.category;
      if (label) {
        tabs.add(label);
      }
    });

    return Array.from(tabs); // 轉回陣列
  }, [favorites]);

  // --- [修改重點 2] 過濾邏輯調整 ---
  const filteredItems = useMemo(() => {
    return favorites.filter(item => {
      // 比對邏輯：
      // 1. 如果選「全部」，就全過
      // 2. 否則比對 item.groupName 是否等於 activeTab
      // 3. (保險起見) 如果沒 groupName，也比對 item.category
      const currentLabel = item.groupName || item.category;
      const matchesTab = activeTab === '全部' || currentLabel === activeTab;

      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, favorites]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col">
      <div className="bg-white border-b border-zinc-100 p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-zinc-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              我的收藏 <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </h1>
            <p className="text-zinc-500 text-sm">管理並追蹤已收藏的證照正確率</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="搜尋收藏內容..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- [修改重點 3] 渲染動態標籤 (categoryTabs) --- */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                activeTab === tab
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
              )}
            >
              {tab}
            </button>
          ))}

          {/* 如果沒有任何分類 (除了全部)，可以顯示提示或是隱藏 */}
          {categoryTabs.length === 1 && favorites.length > 0 && (
             <span className="text-xs text-zinc-300 flex items-center px-2">無分組資訊</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const Icon = (item.icon && IconMap[item.icon]) ? IconMap[item.icon] : User;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex flex-col gap-4 group hover:border-indigo-500 transition-all relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${item.color || 'bg-zinc-500'} rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-zinc-900 truncate">{item.name}</h3>

                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      {/* 如果有 groupName，這裡優先顯示 groupName，或者你可以調整顯示順序 */}
                      {item.groupName ? (
                        <div className="flex items-center gap-1 bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-500">
                          <Tag size={10} />
                          {item.groupName}
                        </div>
                      ) : (
                         <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                           {item.category}
                         </p>
                      )}
                    </div>

                  </div>

                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="text-rose-500 p-2 hover:bg-rose-50 rounded-full transition-colors group/heart"
                    title="移除收藏"
                  >
                    <Heart className="w-5 h-5 fill-current group-hover/heart:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">最高正確率</span>
                    <span className="font-black text-indigo-600">{item.accuracy || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.accuracy || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-bold text-zinc-600">目前沒有收藏內容</p>
            <p className="text-sm mt-1">嘗試切換其他標籤或搜尋關鍵字</p>
            <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-lg">
              前往探索
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
