import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockNews } from '@/lib/mockData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  Tag,
  BookOpen
} from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 從 mockData 尋找對應 ID 的文章
  const news = mockNews.find(n => n.id === id);

  // 捲動到頂部 (當進入此頁面時)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!news) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="text-zinc-400" size={32} />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">找不到這篇文章</h1>
        <p className="text-zinc-500 mb-6">這篇文章可能已被移除或連結錯誤。</p>
        <button
          onClick={() => navigate('/news')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20"
        >
          返回文章列表
        </button>
      </div>
    );
  }

  // 處理內文顯示：簡單的 Markdown 模擬
  const renderContent = (content: string) => {
    if (!content) return null;

    // 輔助函式：解析一行文字中的粗體語法 (保持不變)
    const parseBold = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-bold text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();

      // 1. 處理圖片 (IMAGE:網址|說明) -> 新增的功能
      if (trimmedLine.startsWith('IMAGE:')) {
        // 移除開頭的 "IMAGE:"，剩下 "網址|說明"
        const rawData = trimmedLine.replace('IMAGE:', '');
        // 用 "|" 切割出網址和說明
        const [imgUrl, imgCaption] = rawData.split('|');

        if (!imgUrl) return null; // 防止空網址

        return (
          <figure key={index} className="my-8">
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
              <img
                src={imgUrl}
                alt={imgCaption || '文章配圖'}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* 如果有說明文字才顯示 figcaption */}
            {imgCaption && (
              <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3 font-medium">
                — {imgCaption} —
              </figcaption>
            )}
          </figure>
        );
      }

      // 2. 處理標題 (### )
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-zinc-900 dark:text-white mt-10 mb-4 block leading-tight">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }

      // 3. 處理列表 (* )
      if (trimmedLine.startsWith('* ')) {
        return (
          <li key={index} className="list-disc ml-6 text-zinc-700 dark:text-zinc-300 mb-3 leading-relaxed pl-2 md:text-lg">
            {parseBold(trimmedLine.replace('* ', ''))}
          </li>
        );
      }

      // 4. 處理空行
      if (trimmedLine === '') return <br key={index} className="block content-[''] mt-6" />;

      // 5. 處理普通段落
      return (
        <p key={index} className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed text-base md:text-lg tracking-wide">
          {parseBold(line)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* 頂部導航列 (Sticky) */}
      <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30 transition-all">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/news')}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      {/* 文章主體 */}
      <article className="max-w-3xl mx-auto">
        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 relative overflow-hidden bg-zinc-100">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        <div className="px-5 md:px-8 -mt-20 relative z-10">
          {/* 文章標頭卡片 */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                {news.category}
              </span>
              {/* 如果有 readTime 則顯示 */}
              {news.readTime && (
                <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-medium flex items-center gap-1">
                  <Clock size={12} /> {news.readTime} 閱讀
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-6">
              {news.title}
            </h1>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                   {/* 如果沒有頭像，用名字第一個字代替 */}
                   {news.author ? news.author[0] : <User size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    {news.author || '平台編輯'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar size={12} />
                    <span>{news.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 文章內文 */}
          <div className="py-8 px-2 md:px-4">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {renderContent(news.content || news.summary)}
            </div>
          </div>

          {/* 標籤區 */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 mb-3 flex items-center gap-2">
                <Tag size={16} /> 相關文章標籤
              </h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map(tag => (
                  <span key={tag} className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 底部導航 */}
          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate('/academy')}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              探索相關課程
            </button>
            <button
              onClick={() => navigate('/news')}
              className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 py-3.5 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              回到文章列表
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
