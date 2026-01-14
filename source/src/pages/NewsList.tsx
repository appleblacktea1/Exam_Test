import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockNews } from '@/lib/mockData';
import { Search, ArrowLeft, FileText, Calendar, ChevronRight } from 'lucide-react';

export default function NewsList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = mockNews.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.summary.toLowerCase().includes(query.toLowerCase()) ||
    n.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-safe">
      <div className="bg-white dark:bg-zinc-900 p-4 pt-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-zinc-600" />
            備考資訊與新知
          </h1>
        </div>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋文章、標籤或分類"
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto space-y-4">
        {filtered.map((news) => (
          <div key={news.id} onClick={() => navigate(`/news/${news.id}`)} className="flex gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
            <div className="w-28 h-28 bg-zinc-200 rounded-xl overflow-hidden relative">
              <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-800 flex items-center gap-1">
                <Calendar size={12} />
                {news.date}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{news.category}</span>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-indigo-500" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                {news.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{news.summary}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-zinc-500 py-12">找不到符合的文章</div>
        )}
      </div>
    </div>
  );
}
