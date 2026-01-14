import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Search, Heart, User,
  ChefHat, Scissors, Monitor, FileText, Users, Award,
  TrendingUp, FileEdit, History, GraduationCap, Briefcase,
  Code, Globe, Coffee, PenTool, BookOpen, Calendar,
  MessageCircle, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

// ... IconMap 與初始資料維持不變 ...
const IconMap: Record<string, any> = {
  ChefHat, Scissors, Monitor, FileText, Users, Award,
  TrendingUp, FileEdit, History, GraduationCap, Briefcase,
  Code, Globe, Coffee, PenTool, BookOpen, Calendar,
  MessageCircle
};

const INITIAL_SAVED_ITEMS = [
  { id: '1', name: '多益金證挑戰', accuracy: 88, category: '語言檢定', icon: 'Globe', color: 'bg-blue-500' },
  { id: '2', name: '數位行銷證照', accuracy: 95, category: '專業證照', icon: 'TrendingUp', color: 'bg-orange-500' },
  { id: '3', name: 'Python 基礎', accuracy: 72, category: '程式開發', icon: 'Code', color: 'bg-indigo-500' },
  { id: '4', name: '丙級廚師檢定', accuracy: 85, category: '餐飲廚藝', icon: 'ChefHat', color: 'bg-rose-500' },
  { id: '5', name: '室內設計繪圖', accuracy: 60, category: '設計創意', icon: 'PenTool', color: 'bg-purple-500' },
  { id: '6', name: '乙級美容師', accuracy: 92, category: '美容美髮', icon: 'Scissors', color: 'bg-pink-500' },
  { id: '7', name: 'React 實戰', accuracy: 45, category: '程式開發', icon: 'Code', color: 'bg-indigo-500' },
];

const CATEGORIES = ['全部', '語言檢定', '專業證照', '程式開發', '餐飲廚藝', '設計創意', '美容美髮'];

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // --- 1. 將資料變成狀態 ---
  const [items, setItems] = useState(INITIAL_SAVED_ITEMS);

  // --- 2. 移除收藏的函式 ---
  const handleRemove = (id: string) => {
    // 在實際應用中，這裡會呼叫 API
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = activeTab === '全部' || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, items]); // 記得加入 items 作為相依性

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col">
      {/* 頂部導航與搜尋 */}
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

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                activeTab === cat
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 收藏清單滾動區 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const Icon = IconMap[item.icon] || User;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex flex-col gap-4 group hover:border-indigo-500 transition-all relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-zinc-900 truncate">{item.name}</h3>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{item.category}</p>
                  </div>

                  {/* --- 3. 修改後的移除按鈕 --- */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-rose-500 p-2 hover:bg-rose-50 rounded-full transition-colors group/heart"
                    title="移除收藏"
                  >
                    <Heart className="w-5 h-5 fill-current group-hover/heart:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">最高正確率</span>
                    <span className="font-black text-indigo-600">{item.accuracy}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 空狀態 */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-bold text-zinc-600">目前沒有收藏內容</p>
            <p className="text-sm">去探索一些感興趣的考試並收藏吧！</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all"
            >
              前往探索
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
