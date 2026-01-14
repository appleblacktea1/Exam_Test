import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Search, Bell, ChevronRight, User, ChefHat, Scissors, Monitor, Flame, TrendingUp, Calendar, ArrowRight, FileText, Users, Award, FileEdit, History, GraduationCap, MapPin, Briefcase, Code, Globe, Coffee, PenTool, BookOpen, MessageCircle, Sparkles, Trophy, Zap, Clock, Target, CheckCircle, Info, X } from 'lucide-react';
import { mockCategories, mockNews, mockUsers, mockStats, mockTestimonials, mockQuickActions, mockHotKeywords, mockCourses, mockQuests } from '@/lib/mockData';
import QuestDrawer from '@/components/QuestDrawer';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '@/lib/utils';


// Map icon strings to components
const IconMap: Record<string, any> = {
  LayoutGrid,
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

export default function Home() {
  const navigate = useNavigate();
  const logoUrl = "data:image/png;base64,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";
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'cert' | 'course'>('cert');
  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const currentUser = mockUsers[0]; // Using first user as current user for demo
  const { config } = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);
  // 模擬通知資料 (可以隨時清空來測試紅點消失)
  const [notifications, setNotifications] = useState([
    { id: 1, title: '系統通知', message: '您已成功完成「基礎語法」挑戰！', type: 'success' },
    { id: 2, title: '經驗加倍', message: '限時活動：目前的測驗經驗值加成 20%', type: 'info' },
    { id: 1, title: '系統通知', message: '您已成功完成「基礎語法」挑戰！', type: 'success' },
    { id: 2, title: '經驗加倍', message: '限時活動：目前的測驗經驗值加成 20%', type: 'info' },
    { id: 1, title: '系統通知', message: '您已成功完成「基礎語法」挑戰！', type: 'success' },
    { id: 2, title: '經驗加倍', message: '限時活動：目前的測驗經驗值加成 20%', type: 'info' }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉視窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Featured exams for "Worth Watching"
  const featuredExams = [
    { id: 'f1', name: '證券商業務員', category: '金融證照', candidates: 5000, tag: '熱搜' },
    { id: 't1', name: 'iPAS 資安工程師', category: '資訊科技', candidates: 2000, tag: '趨勢' },
    { id: 'l1', name: 'TOEIC 多益測驗', category: '語言檢定', candidates: 20000, tag: '必備' },
    { id: 'c1', name: '中餐烹調丙級', category: '餐飲觀光', candidates: 8000, tag: '熱門' },
  ];

  // Get active daily quests for the home widget
  const dailyQuests = mockQuests.filter(q => q.type === 'daily').slice(0, 2);

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
          {/* 鈴鐺按鈕 */}
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

          {/* 浮動小視窗 */}
          {isOpen && (
            <div className={cn(
              "absolute right-0 mt-3 z-50",
              "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl",
              "animate-in fade-in zoom-in duration-200 origin-top-right",

              // 尺寸邏輯修改：
              // 預設 (手機版): 寬度佔螢幕 85%，但最大不超過 240px
              "w-[85vw] max-w-[240px]",

              // md 以上 (電腦版): 寬度固定或最大限制為 320px
              "md:w-80 md:max-w-[320px]"
          )}>

              {/* Header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-sm">通知中心</h3>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-indigo-500 font-bold hover:text-indigo-600"
                >
                  全部已讀
                </button>
              </div>

              {/* 清單 */}
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

      {/* Hero Search Section - Livelier Gradient */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-8 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl" />
        <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight leading-tight drop-shadow-sm">
            掌握你的未來 <br/>
            <span className="text-indigo-100 text-lg font-medium opacity-90 mt-1 block">找到適合你的專業證照與課程</span>
          </h1>

          {/* Search Tabs */}
          <div className="flex justify-center mb-6 gap-3">
             <button
               onClick={() => setActiveTab('cert')}
               className={`px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${activeTab === 'cert' ? 'bg-white text-indigo-600 shadow-lg ring-2 ring-white/50' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
             >
               找證照
             </button>
             <button
               onClick={() => setActiveTab('course')}
               className={`px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${activeTab === 'course' ? 'bg-white text-indigo-600 shadow-lg ring-2 ring-white/50' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
             >
               找課程
             </button>
          </div>

          <div className="relative max-w-lg mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                type="text"
                placeholder={activeTab === 'cert' ? "搜尋考試、技能或職位..." : "搜尋熱門課程、講師..."}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-2xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>

          {/* Hot Keywords */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
            <span className="text-xs font-bold text-white/80 mr-1 flex items-center bg-black/10 px-2 py-1 rounded-md backdrop-blur-sm">
                <Flame size={12} className="mr-1 text-orange-300" />
                熱搜
            </span>
            {mockHotKeywords.slice(0, 5).map((keyword, idx) => (
              <span key={idx} className="text-xs font-medium text-white bg-white/10 border border-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/25 hover:scale-105 transition-all backdrop-blur-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll) - Floating overlap */}
      <div className="px-4 -mt-6 relative z-20 overflow-x-auto hide-scrollbar pb-4">
        <div className="flex gap-3 px-1">
          {mockCategories.map((cat) => {
              const isActive = cat.id === 'finance'; // Just demo active state
              return (
                <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full shadow-lg text-sm font-bold whitespace-nowrap transition-all transform hover:-translate-y-1 ${
                    isActive
                    ? 'bg-zinc-800 text-white ring-2 ring-zinc-600'
                    : 'bg-white text-zinc-600 hover:text-indigo-600 hover:shadow-xl border border-zinc-100'
                }`}
                >
                {cat.name}
                </button>
              )
          })}
        </div>
      </div>

      <div className="p-4 space-y-8 mx-auto">

        {/* Daily Quest Summary Card - NEW FEATURE */}
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

        {/* Worth Watching Certifications */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-yellow-500 fill-yellow-500" size={20} />
              值得關注的證照
            </h2>
            {/* <span onClick={() => navigate('/news')} className="text-xs text-zinc-500 cursor-pointer hover:text-indigo-600 font-medium">查看更多</span> */}
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

        {/* Corporate Favorites (Colorful Card) */}
        {/* <section>
           <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Briefcase className="text-blue-500" size={20} />
              企業愛用證照
            </h2>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:translate-x-0 transition-transform duration-700" />

             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold border border-white/20">年度報告</span>
                        <h3 className="font-bold text-2xl mt-2 leading-tight">2024 職場<br/>加薪攻略</h3>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-white/30 border-2 border-blue-500 flex items-center justify-center text-[8px]">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-xs font-medium text-blue-50">已有 3,420 人閱讀</span>
                    <ArrowRight size={16} className="ml-auto opacity-80 group-hover:translate-x-1 transition-transform" />
                </div>
             </div>
          </div>
        </section> */}

        {/* Popular Courses */}
        {/* <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="text-green-500" size={20} />
              熱門證照課程
            </h2>
            <span onClick={() => navigate('/academy')} className="text-xs text-zinc-500 cursor-pointer hover:text-indigo-600 font-medium">更多課程</span>
          </div>
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x hide-scrollbar">
            {mockCourses.slice(0, 4).map((course) => (
              <div key={course.id} className="min-w-[260px] md:min-w-0 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden snap-center group cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/academy')}>
                <div className="h-32 bg-zinc-200 relative overflow-hidden">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-zinc-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    {course.provider}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      {course.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors h-10">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-50">
                    <span className="text-zinc-500 flex items-center gap-1">
                        <Users size={12} />
                        {course.students}
                    </span>
                    <span className={`font-bold text-sm ${course.price === 0 ? 'text-green-500' : 'text-indigo-600'}`}>
                      {course.price === 0 ? '免費' : `NT$ ${course.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Latest News */}
        {/* <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="text-zinc-500" size={20} />
              備考資訊與新知
            </h2>
          </div>

          <div className="space-y-3">
            {mockNews.map((news) => (
              <div key={news.id} onClick={() => navigate(`/news/${news.id}`)} className="flex gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                 <div className="w-24 h-24 bg-zinc-200 rounded-xl flex-shrink-0 overflow-hidden relative">
                   <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-800">
                       {news.date.split('-')[1]}/{news.date.split('-')[2]}
                   </div>
                 </div>
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                           news.tag === '熱門' ? 'bg-red-100 text-red-600' :
                           news.tag === '必讀' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                       }`}>
                         {news.category}
                       </span>
                     </div>
                     <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">
                       {news.title}
                     </h3>
                   </div>
                   <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-2">
                       <Clock size={12} />
                       <span>3 分鐘閱讀</span>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </section> */}

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
