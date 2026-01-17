import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Tag
} from 'lucide-react';
import { mockNews } from '@/lib/mockData';

export default function News() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. 自動從資料中提取所有不重複的分類
  const categories = useMemo(() => {
    const allCats = mockNews.map(n => n.category);
    return ['全部', ...Array.from(new Set(allCats))];
  }, []);

  // 2. 篩選邏輯：同時考慮分類與搜尋關鍵字
  const filteredNews = useMemo(() => {
    return mockNews.filter(item => {
      const matchCategory = activeCategory === '全部' || item.category === activeCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30">
        <div className="px-4 h-14 flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg text-zinc-900 dark:text-white">最新消息</h1>
          <div className="w-10" /> {/* 佔位符，讓標題置中 */}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* 搜尋與分類區塊 */}
        <div className="space-y-4">
          {/* 搜尋框 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-200"></div>
            <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm flex items-center px-4 py-3 border border-zinc-200 dark:border-zinc-800">
              <Search className="text-zinc-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="搜尋文章標題..."
                className="flex-1 bg-transparent focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 分類 Pills (橫向捲動) */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-zinc-900 text-white shadow-md transform scale-105'
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 文章列表 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <article
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)}
                className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {/* 圖片區 */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Tag size={10} />
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* 內容區 */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white leading-snug mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h2>

                  {/* 可以加一段簡短的摘要，如果 mockData 沒有摘要欄位，這行可以省略 */}
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                    掌握最新的考試趨勢與技巧，這篇文章將帶你深入了解... (點擊閱讀更多)
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-50 dark:border-zinc-800 mt-auto">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        3 分鐘閱讀
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            // 查無資料顯示
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300">
                <Search size={32} />
              </div>
              <h3 className="text-zinc-900 font-bold mb-1">找不到相關文章</h3>
              <p className="text-zinc-500 text-sm">試著切換分類或搜尋其他關鍵字</p>
              <button
                onClick={() => {setActiveCategory('全部'); setSearchQuery('');}}
                className="mt-4 text-indigo-600 text-sm font-bold hover:underline"
              >
                清除所有篩選
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
