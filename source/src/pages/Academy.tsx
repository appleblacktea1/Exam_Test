import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  Search,
  Filter,
  Star,
  PlayCircle,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { mockCourses, mockUser, mockCategories, mockMistakes } from '../lib/mockData';
import { useGlobalState } from '@/state/GlobalState';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Academy() {
  const navigate = useNavigate();
  const { courseProgress } = useGlobalState();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTutor, setShowTutor] = useState(false);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorMessages, setTutorMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: '嗨！我是你的學習教練，輸入考試主題或疑問，我來協助你。' }
  ]);

  // Filter courses based on category and search
  const filteredCourses = mockCourses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.tags.some(tag => tag.includes(selectedCategory));
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get user's enrolled courses
  const enrolledCoursesList = mockCourses.filter(course =>
    mockUser.enrolledCourses?.includes(course.id)
  );

  const mistakeGroups = useMemo(() => {
    const groups = new Map<string, typeof mockMistakes>();
    mockMistakes.forEach(m => {
      const list = groups.get(m.topic) || ([] as any);
      list.push(m);
      groups.set(m.topic, list);
    });
    return Array.from(groups.entries());
  }, []);

  const handleTutorSend = () => {
    if (!tutorInput.trim()) return;
    const userMsg = { role: 'user' as const, text: tutorInput.trim() };
    setTutorMessages(prev => [...prev, userMsg]);
    const reply = `我理解你的問題：「${tutorInput.trim()}」。建議先釐清重點概念，並以小測驗檢核理解；你可以從「精選課程」選擇與此主題相關的內容，或先複習錯題本。`;
    setTutorMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setTutorInput('');
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 pb-12 pt-8 px-4 rounded-b-[2.5rem] shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                學院
              </h1>
              <p className="text-emerald-100 font-medium">探索知識，成就專業</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-inner">
              <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </header>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-emerald-700/50" />
            </div>
            <input
              type="text"
              placeholder="搜尋課程、講師或證照..."
              className="w-full bg-white/95 backdrop-blur-sm py-4 pl-10 pr-4 rounded-2xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: BookOpen, label: '我的課程', color: 'bg-blue-500' },
              { icon: Target, label: '學習計畫', color: 'bg-purple-500' },
              { icon: Clock, label: '歷史紀錄', color: 'bg-orange-500' },
              { icon: Award, label: '證書中心', color: 'bg-emerald-500' },
            ].map((item, i) => (
              <button key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <item.icon size={24} />
                </div>
                <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-8">
        {/* My Learning Section */}
        {enrolledCoursesList.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                我的學習
              </h2>
              <button className="text-xs text-emerald-600 font-bold hover:underline">
                全部課程
              </button>
            </div>
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {enrolledCoursesList.map(course => (
                <div key={course.id} className="min-w-[280px] md:min-w-0 bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 group cursor-pointer" onClick={() => navigate(`/course/${course.id}/learn`)}>
                  <div className="relative h-32">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <PlayCircle className="w-8 h-8 text-emerald-600 fill-emerald-100" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      繼續觀看
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(courseProgress[course.id]?.percent ?? 0, 100)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{Math.floor(Math.min(courseProgress[course.id]?.percent ?? 0, 100))}%</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm truncate">{course.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{course.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section>
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                selectedCategory === 'all'
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
              )}
            >
              全部
            </button>
            {mockCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)} // Note: real app would use ID mapping
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                  selectedCategory === cat.name
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Course Catalog */}
        <section>
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            精選課程
          </h2>
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 group cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/course/${course.id}/learn`)}>
                <div className="flex">
                  <div className="w-32 relative shrink-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      {course.tags.includes('熱門') && (
                        <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                          HOT
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {course.tags[0]}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-zinc-700">{course.rating}</span>
                          <span className="text-[10px] text-zinc-400">({course.students})</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-zinc-900 text-sm line-clamp-2 leading-tight mb-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-zinc-500">{course.provider}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-zinc-400">
                        {/* Avatar stack placeholder */}
                        <div className="flex -space-x-1.5">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-4 h-4 rounded-full bg-zinc-200 border border-white" />
                          ))}
                        </div>
                        <span className="text-[10px] ml-1">{course.students > 1000 ? '1k+' : course.students} 人在學</span>
                      </div>
                      <span className={cn(
                        "font-bold text-sm",
                        course.price === 0 ? "text-emerald-600" : "text-indigo-600"
                      )}>
                        {course.price === 0 ? '免費' : `NT$ ${course.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900">找不到相關課程</h3>
                <p className="text-sm text-zinc-500">試試看搜尋其他關鍵字或切換分類</p>
              </div>
            )}
          </div>
        </section>

        {/* Mistakes Section */}
        <section>
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            錯題本
          </h2>
          <div className="space-y-4">
            {mistakeGroups.map(([topic, items]) => (
              <div key={topic} className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
                <div className="px-4 py-3 bg-rose-50 text-rose-700 font-bold text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" /> {topic}
                </div>
                <div className="divide-y divide-zinc-100">
                  {items.map(m => (
                    <div key={m.id} className="px-4 py-3 text-sm">
                      <div className="font-bold text-zinc-800">{m.question}</div>
                      <div className="text-xs text-zinc-500 mt-1">你的答案：{m.myAnswer} • 正確：{m.correct}</div>
                      {m.note && <div className="text-xs text-rose-600 mt-1">提示：{m.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Study Plan Generator */}
        <section>
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            學習計畫產生器
          </h2>
          <div className="bg-white rounded-xl p-4 border border-zinc-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500">考試日期</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-zinc-200 rounded-lg" id="examDate" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">每週可用時數</label>
                <input type="number" placeholder="10" className="w-full mt-1 px-3 py-2 border border-zinc-200 rounded-lg" id="hours" />
              </div>
            </div>
            <div className="text-right mt-3">
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold" onClick={() => {
                const d = (document.getElementById('examDate') as HTMLInputElement)?.value;
                const h = parseInt((document.getElementById('hours') as HTMLInputElement)?.value || '0', 10);
                const weeks = 6;
                const plan = Array.from({ length: weeks }).map((_, i) => ({ week: i + 1, hours: Math.max(2, Math.floor(h)) }));
                alert(`已建立 ${weeks} 週計畫，每週 ${h} 小時（示意）：\n` + plan.map(p => `第${p.week}週：${p.hours} 小時`).join('\n'));
              }}>建立計畫</button>
            </div>
          </div>
        </section>
      </div>

      {/* AI Tutor Drawer */}
      {showTutor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="w-full max-w-md h-full bg-white shadow-xl border-l border-zinc-100 flex flex-col">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <div className="font-bold">AI 教練</div>
              <button className="text-zinc-500" onClick={() => setShowTutor(false)}>關閉</button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {tutorMessages.map((m, idx) => (
                <div key={idx} className={m.role === 'assistant' ? 'text-sm bg-zinc-50 p-3 rounded-xl' : 'text-sm bg-indigo-50 p-3 rounded-xl text-indigo-700'}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-100 flex gap-2">
              <input value={tutorInput} onChange={e => setTutorInput(e.target.value)} placeholder="輸入疑問或主題..." className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg" />
              <button onClick={handleTutorSend} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold">發送</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
