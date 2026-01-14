import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockNews } from '@/lib/mockData';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = mockNews.find(n => n.id === id);

  if (!news) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">找不到文章</h1>
        <button onClick={() => navigate('/news')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">返回列表</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-zinc-900 p-4 pt-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/news')} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-zinc-600" />
            {news.title}
          </h1>
        </div>
        <div className="text-xs text-zinc-500 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold">{news.category}</span>
          <Calendar size={14} />
          <span>{news.date}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="rounded-2xl overflow-hidden">
          <img src={news.imageUrl} alt={news.title} className="w-full h-56 object-cover" />
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm whitespace-pre-line">
            {news.summary}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">回到大廳</button>
          <button onClick={() => navigate('/academy')} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">前往學院</button>
        </div>
      </div>
    </div>
  );
}
