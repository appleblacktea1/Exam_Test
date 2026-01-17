import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, ChevronRight, TrendingUp, Calendar, Sparkles, Trophy, Zap,
  Target, CheckCircle, Info, ChevronLeft, ChevronDown, HelpCircle // 新增 ChevronDown, HelpCircle
} from 'lucide-react';
import { mockCategories, mockUsers, mockQuests, mockNews } from '@/lib/mockData';
import QuestDrawer from '@/components/QuestDrawer';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '@/lib/utils';

// --- 模擬 FAQ 資料 ---
const mockFaqs = [
  {
    id: 1,
    question: "題庫內容多久更新一次？",
    answer: "我們的題庫與官方考試同步，只要官方釋出新試題，我們會在 7 天內完成整理並上架，確保您練習到最新的考題。"
  },
  {
    id: 2,
    question: "如何提升我的等級 (Lv)？",
    answer: "您可以透過完成「每日挑戰」、進行「模擬測驗」或解鎖「成就」來獲得經驗值 (EXP)。等級越高，將解鎖更多自訂頭像與特殊稱號。"
  },
  {
    id: 3,
    question: "目前支援哪些種類的考試？",
    answer: "目前平台主要支援：金融證照（證券、信託）、資訊科技（iPAS、AWS）、語言檢定（多益、日檢）以及餐飲觀光類證照。更多類別陸續新增中！"
  },
  {
    id: 4,
    question: "發現題目有誤該如何回報？",
    answer: "在每一題的練習介面右上方都有「錯誤回報」按鈕，點擊後填寫說明，我們的助教團隊會在 24 小時內審核並修正。"
  }
];

// --- 無限輪播元件 ---
const NewsCarousel = ({ items }: { items: typeof mockNews }) => {
  const navigate = useNavigate();

  // 為了做無限輪播，我們需要在頭尾各多加一張圖
  const extendedItems = React.useMemo(() => {
    if (items.length < 2) return items;
    return [
      items[items.length - 1], // Clone Last
      ...items,
      items[0]                 // Clone First
    ];
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TRANSITION_DURATION = 700;

  const handleNext = useCallback(() => {
    if (items.length < 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length < 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length < 2) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, isPaused, items.length]);

  useEffect(() => {
    if (!isTransitioning) return;

    if (currentIndex === extendedItems.length - 1) {
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, TRANSITION_DURATION);
    }

    if (currentIndex === 0) {
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(extendedItems.length - 2);
      }, TRANSITION_DURATION);
    }

    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [currentIndex, extendedItems.length, isTransitioning]);

  const handleDotClick = (originalIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(originalIndex + 1);
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className="relative w-full h-[450px] md:h-[500px] overflow-hidden group bg-zinc-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex h-full will-change-transform"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none'
        }}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="w-full flex-shrink-0 relative h-full cursor-pointer"
            onClick={() => navigate(`/news/${item.id}`)}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3 lg:w-1/2 pointer-events-none">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-indigo-600/90 backdrop-blur-md rounded-full shadow-lg border border-indigo-400/30">
                {item.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg line-clamp-2 mb-2">
                {item.title}
              </h2>
              <p className="text-zinc-300 text-xs md:text-sm font-medium flex items-center gap-2">
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                {item.date}
                <span className="w-1 h-1 bg-zinc-400 rounded-full mx-1"></span>
                <span className="text-indigo-300">點擊閱讀全文 &rarr;</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-white/10 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-white/10 z-10"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 right-6 flex gap-2 z-10">
        {items.map((_, idx) => {
          let activeDotIndex = currentIndex - 1;
          if (currentIndex === 0) activeDotIndex = items.length - 1;
          if (currentIndex === extendedItems.length - 1) activeDotIndex = 0;

          return (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); handleDotClick(idx); }}
              className={`transition-all duration-300 rounded-full shadow-sm ${
                activeDotIndex === idx
                  ? 'w-8 h-2 bg-indigo-500'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

// --- 主頁面 ---
export default function Home() {
  const navigate = useNavigate();
  const logoUrl = "data:image/png;base64,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";

  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const currentUser = mockUsers[0];
  const { config } = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);

  // 新增：FAQ 折疊狀態
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: '系統通知', message: '您已成功完成「基礎語法」挑戰！', type: 'success' },
    { id: 2, title: '經驗加倍', message: '限時活動：目前的測驗經驗值加成 20%', type: 'info' }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuredExams = [
    { id: 'f1', name: '證券商業務員', category: '金融證照', candidates: 5000, tag: '熱搜' },
    { id: 't1', name: 'iPAS 資安工程師', category: '資訊科技', candidates: 2000, tag: '趨勢' },
    { id: 'l1', name: 'TOEIC 多益測驗', category: '語言檢定', candidates: 20000, tag: '必備' },
    { id: 'c1', name: '中餐烹調丙級', category: '餐飲觀光', candidates: 8000, tag: '熱門' },
  ];

  const dailyQuests = mockQuests.filter(q => q.type === 'daily').slice(0, 2);
  const carouselItems = mockNews.filter(item => item.isCarousel);

  // FAQ 切換函數
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-24 font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="Logo" className="w-10 h-10 mx-auto rounded-2xl shadow-lg" />
          <span className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">{config.platformName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQuestOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-bold text-xs hover:bg-indigo-100 transition-colors border border-indigo-100"
          >
            <Trophy size={14} className="text-yellow-500 fill-yellow-500" />
            <span>Lv.{currentUser.level}</span>
            {mockQuests.some(q => q.status === 'claimable') && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Notification Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative active:scale-90"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-900"></span>
              )}
            </button>

            {isOpen && (
              <div className={cn(
                "absolute right-0 mt-3 z-50",
                "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl",
                "animate-in fade-in zoom-in duration-200 origin-top-right",
                "w-[85vw] max-w-[240px]",
                "md:w-80 md:max-w-[320px]"
              )}>
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <h3 className="font-bold text-sm">通知中心</h3>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-indigo-500 font-bold hover:text-indigo-600"
                  >
                    全部已讀
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                          <div className="flex gap-3">
                            {n.type === 'success' ? (
                              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Info size={18} className="text-blue-500 shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{n.title}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-sm text-zinc-400 font-medium">目前沒有新通知</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <img
            src={currentUser.avatar}
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/profile')}
          />
        </div>
      </div>

      <QuestDrawer
        isOpen={isQuestOpen}
        onClose={() => setIsQuestOpen(false)}
        quests={mockQuests}
      />

      {/* --- News Carousel --- */}
      {carouselItems.length > 0 && (
        <section className="relative z-10 w-full bg-zinc-900 shadow-xl border-b border-zinc-800">
          <NewsCarousel items={carouselItems} />
        </section>
      )}

      <div className="p-4 space-y-8 mx-auto">
        {/* Daily Quest */}
        <section onClick={() => setIsQuestOpen(true)} className="cursor-pointer group">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-0.5 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="bg-zinc-900 rounded-[14px] p-4 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-white flex items-center gap-2">
                            <Target className="text-red-400" size={20} />
                            每日挑戰
                        </h2>
                        <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
                            查看全部 <ChevronRight size={14} />
                        </span>
                    </div>

                    <div className="space-y-3">
                        {dailyQuests.map(quest => (
                            <div key={quest.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quest.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    {quest.status === 'completed' ? <Zap size={16} /> : <Zap size={16} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-bold text-zinc-200">{quest.title}</span>
                                        <span className="text-xs text-yellow-500 font-bold">+{quest.reward.value} {quest.reward.type === 'coins' ? '金幣' : 'EXP'}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Featured Certifications */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-yellow-500 fill-yellow-500" size={20} />
              值得關注的證照
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredExams.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => navigate(`/challenge/${exam.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      exam.tag === '熱搜' ? 'bg-red-100 text-red-600' :
                      exam.tag === '趨勢' ? 'bg-blue-100 text-blue-600' :
                      exam.tag === '必備' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                      <TrendingUp size={16} />
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                       exam.tag === '熱搜' ? 'bg-red-50 text-red-500' :
                       exam.tag === '趨勢' ? 'bg-blue-50 text-blue-500' :
                       exam.tag === '必備' ? 'bg-green-50 text-green-500' : 'bg-purple-50 text-purple-500'
                  }`}>
                    {exam.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{exam.name}</h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{exam.category}</span>
                    <span className="text-xs text-zinc-500 font-medium">{exam.candidates.toLocaleString()} 人</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 新增：常見問題 FAQ Section --- */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4 px-1">
            <HelpCircle className="text-indigo-500" size={20} />
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white">
              常見問題
            </h2>
          </div>

          <div className="space-y-3">
            {mockFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm transition-colors hover:border-indigo-100 dark:hover:border-indigo-900/50"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-zinc-800 dark:text-zinc-200"
                  >
                    <span className="text-sm md:text-base">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
                    />
                  </button>

                  <div
                    className={`
                      transition-all duration-300 ease-in-out overflow-hidden
                      ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="p-4 pt-0 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-50 dark:border-zinc-800/50 mt-1">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-4 pb-8 hidden md:block">
           <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
             <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-4">產品</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="hover:text-indigo-600 cursor-pointer">功能介紹</li>
                    <li className="hover:text-indigo-600 cursor-pointer">收費方案</li>
                    <li className="hover:text-indigo-600 cursor-pointer">企業方案</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-4">資源</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="hover:text-indigo-600 cursor-pointer">備考攻略</li>
                    <li className="hover:text-indigo-600 cursor-pointer">歷屆試題</li>
                    <li className="hover:text-indigo-600 cursor-pointer">成功案例</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-4">關於</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="hover:text-indigo-600 cursor-pointer">關於我們</li>
                    <li className="hover:text-indigo-600 cursor-pointer">加入我們</li>
                    <li className="hover:text-indigo-600 cursor-pointer">聯絡我們</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-4">條款</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="hover:text-indigo-600 cursor-pointer">隱私權政策</li>
                    <li className="hover:text-indigo-600 cursor-pointer">服務條款</li>
                    <li className="hover:text-indigo-600 cursor-pointer">Cookie 設定</li>
                </ul>
             </div>
           </div>
           <div className="text-[10px] text-zinc-300 dark:text-zinc-600 pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-8">
             © 2024 {config.platformName}. All rights reserved.
           </div>
        </footer>
      </div>
    </div>
  );
}
