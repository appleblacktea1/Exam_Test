import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Search, BookOpen, User, ChevronDown,
  ChefHat, Scissors, Monitor, FileText, Users, Award,
  TrendingUp, FileEdit, History, GraduationCap, Briefcase,
  Code, Globe, Coffee, PenTool, Calendar, MessageCircle,
  AlertCircle, CheckCircle2, Sparkles, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- 1. 模擬層級化資料：證照 -> 多個錯題 ---
const mockGroupedWrongQuestions = [
  {
    id: 'cert1',
    name: '多益金證挑戰',
    category: '語言檢定',
    icon: 'Globe',
    color: 'bg-blue-500',
    questions: [
      {
        id: 'q1',
        question: 'Choose the correct word: The manager ____ the meeting because of the heavy rain.',
        correctAnswer: 'postponed',
        aiAnalysis: '此題考驗動詞詞義辨析。postponed 意為「延期」，符合語境。'
      },
      {
        id: 'q1-2',
        question: 'The new policy will come into ____ next month.',
        correctAnswer: 'effect',
        aiAnalysis: 'come into effect 為固定搭配，意為「生效」。'
      }
    ]
  },
  {
    id: 'cert2',
    name: 'Python 基礎程式設計',
    category: '程式開發',
    icon: 'Code',
    color: 'bg-indigo-500',
    questions: [
      {
        id: 'q2',
        question: '在 JavaScript 中，下列哪一個方法可以用來合併兩個陣列？',
        correctAnswer: 'concat()',
        aiAnalysis: 'concat() 用於連接兩個或多個陣列，且不改變原陣列。'
      }
    ]
  }
];

const IconMap: Record<string, any> = {
  ChefHat, Scissors, Monitor, FileText, Users, Award, TrendingUp,
  FileEdit, History, GraduationCap, Briefcase, Code, Globe, Coffee,
  PenTool, BookOpen, Calendar, MessageCircle
};

export default function WrongQuestionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null); // 控制哪個證照被展開

  // AI 權限控制
  const [hasAiPermission] = useState(false);

  const categories = useMemo(() => {
    const cats = mockGroupedWrongQuestions.map(item => item.category);
    return ['全部', ...Array.from(new Set(cats))];
  }, []);

  const filteredGroups = useMemo(() => {
    return mockGroupedWrongQuestions.filter(group => {
      const matchesTab = activeTab === '全部' || group.category === activeTab;
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="h-screen bg-zinc-50 flex flex-col overflow-hidden text-zinc-900">
      {/* 頂部固定導航 */}
      <div className="bg-white border-b border-zinc-100 p-4 md:p-8 space-y-6 flex-none">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-zinc-600" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            錯題本 <BookOpen className="text-orange-500" />
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="搜尋證照名稱..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all",
                activeTab === cat ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 列表滾動區 */}
      <div className="flex-1 overflow-y-auto p-4 md:px-8 space-y-4">
        {filteredGroups.map((group) => {
          const Icon = IconMap[group.icon] || User;
          const isExpanded = expandedId === group.id;

          return (
            <div key={group.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden transition-all">
              {/* 證照大卡片 (標題) */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : group.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md", group.color)}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-800">{group.name}</h3>
                    <p className="text-xs text-zinc-400">{group.questions.length} 個錯題</p>
                  </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-zinc-300 transition-transform duration-300", isExpanded && "rotate-180")} />
              </button>

              {/* 展開後的錯題清單 */}
              {isExpanded && (
                <div className="border-t border-zinc-50 bg-zinc-50/50 p-4 space-y-6">
                  {group.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-zinc-400">題目詳情</span>
                      </div>

                      <p className="font-bold text-zinc-800 leading-relaxed">{q.question}</p>

                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <div className="text-[10px] font-black text-emerald-600 flex items-center gap-1 mb-1">
                          <CheckCircle2 size={12} /> 正確答案
                        </div>
                        <p className="text-sm font-bold text-emerald-700">{q.correctAnswer}</p>
                      </div>

                      {/* AI 解析區 */}
                      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[10px] font-black text-indigo-600 flex items-center gap-1">
                            <Sparkles size={12} /> AI 深度解析
                          </div>
                        </div>

                        <div className={cn("transition-all", !hasAiPermission && "blur-md select-none opacity-40")}>
                          <p className="text-xs text-zinc-600 leading-relaxed">{q.aiAnalysis}</p>
                        </div>

                        {!hasAiPermission && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
                            <button
                              onClick={() => navigate('/shop')}
                              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                              <Lock size={14} /> 立即開通 AI 權限
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
