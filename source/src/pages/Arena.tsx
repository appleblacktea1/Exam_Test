import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords, Trophy, History, Crown, Search, X,
  Star, Settings2, Bookmark, Check, ArrowRight
} from 'lucide-react';
import { mockBattles, mockLeaderboard, mockUser, mockCategories } from '@/lib/mockData';
import { cn } from '@/lib/utils';
// 引入 Hook
import { useFavorites } from '@/context/FavoritesContext';

export default function Arena() {
  const navigate = useNavigate();

  // 1. 使用 Context
  const { favorites } = useFavorites();

  // 準備搜尋用的資料
  const allSearchableExams = useMemo(() => {
    return mockCategories.flatMap(category =>
      category.groups?.flatMap(group =>
        group.exams.map(exam => ({
          ...exam,
          categoryName: category.name,
          groupName: group.groupName
        }))
      ) || []
    );
  }, []);

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'history'>('leaderboard');
  const [isSearching, setIsSearching] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState<{ id: string; name: string } | null>(null);

  // 搜尋過濾邏輯
  const filteredExams = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allSearchableExams.filter(exam =>
      exam.name.toLowerCase().includes(query) ||
      exam.groupName?.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, allSearchableExams]);

  // 排行榜資料 (Mock)
  const displayLeaderboard = mockLeaderboard.map(entry => ({
    rank: entry.rank,
    name: entry.user.name,
    avatar: entry.user.avatar,
    tier: `Lv.${entry.user.level}`,
    points: entry.score,
    trend: entry.trend
  }));

  // 對戰紀錄資料 (Mock)
  const displayBattles = mockBattles.map(battle => {
    const isPlayer1 = battle.player1.id === mockUser.id;
    const opponent = isPlayer1 ? battle.player2 : battle.player1;
    const myScore = isPlayer1 ? battle.player1Score : battle.player2Score;
    const opScore = isPlayer1 ? battle.player2Score : battle.player1Score;
    return {
      id: battle.id,
      result: myScore > opScore ? 'win' : 'loss',
      opponent: opponent.name,
      date: battle.timestamp,
      pointsChange: myScore > opScore ? 25 : -15
    };
  });

  const stats = { rank: 4, points: 2150, winRate: '68%', totalMatches: 142 };

  const handleFindMatch = () => {
    if (!selectedExam) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      navigate(`/battle/${selectedExam.id}`);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24 font-sans text-zinc-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pb-20 pt-10 px-6 rounded-b-[3rem] shadow-2xl">
        <div className="relative z-10 max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Swords className="w-10 h-10" />
              競技場
            </h1>
            <p className="text-indigo-100 font-bold mt-1">S1 賽季：巔峰對決</p>
          </div>
          <div className="bg-white/20 p-3 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl">
            <Crown className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-10 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Stats & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-zinc-100">
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <img src={mockUser.avatar} className="w-16 h-16 rounded-full object-cover border-4 border-indigo-50 shadow-md" alt="" />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full shadow-lg">
                  <Star size={12} fill="currentColor" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black">{mockUser.name}</h2>
                <div className="text-indigo-600 text-sm font-black flex items-center gap-1">
                  <Trophy size={14} /> 排名 #{stats.rank}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-zinc-900">{stats.totalMatches}</div>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">對戰</div>
              </div>
              <div className="text-center border-x border-zinc-100 px-2">
                <div className="text-2xl font-black text-emerald-500">{stats.winRate}</div>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">勝率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-indigo-600">{stats.points}</div>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">積分</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black flex items-center gap-2 text-zinc-800">
                <Settings2 className="text-indigo-600" size={20} /> 對戰設定
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setShowRules(true)} className="p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors">
                  <Bookmark size={18} />
                </button>
                <button
                  onClick={() => setShowFavorites(true)}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm shadow-amber-100"
                >
                  <Star size={14} fill="currentColor" /> 收藏
                </button>
              </div>
            </div>

            <div className="space-y-5 mb-8 relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="搜尋考試科目"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-zinc-50 rounded-[1.25rem] focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold placeholder:text-zinc-300"
                />
              </div>

              {searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-[60] bg-white border border-zinc-100 shadow-2xl rounded-b-[1.5rem] overflow-hidden !mt-0">
                  {filteredExams.length > 0 ? (
                    <div className="p-2">
                      {filteredExams.map((exam) => (
                        <button
                          key={exam.id}
                          onClick={() => {
                            setSelectedExam({ id: exam.id, name: exam.name });
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-bold text-zinc-600 group-hover:text-indigo-600 block">{exam.name}</span>
                            <span className="text-[10px] text-zinc-400 font-bold">{exam.categoryName} - {exam.groupName}</span>
                          </div>
                          <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-zinc-400 text-sm font-medium">
                      找不到相關的考試科目...
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedExam && (
              <div className="p-5 bg-indigo-50/50 rounded-2xl mb-8 border border-indigo-100">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                  目前準備挑戰
                </div>
                <div className="text-base font-black text-indigo-900 flex items-center justify-between">
                  {selectedExam.name}
                  <Check size={20} className="text-indigo-600" />
                </div>
              </div>
            )}

            <button
              onClick={handleFindMatch}
              disabled={isSearching || !selectedExam}
              className="w-full py-5 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Swords size={24} />
              {selectedExam ? '開始積分對戰' : '請先搜尋並選擇科目'}
            </button>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex p-2 bg-white rounded-[1.5rem] shadow-sm border border-zinc-100">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-black rounded-xl transition-all", activeTab === 'leaderboard' ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:bg-zinc-50")}
            >
              <Trophy size={18} /> 排行榜
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-black rounded-xl transition-all", activeTab === 'history' ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:bg-zinc-50")}
            >
              <History size={18} /> 對戰紀錄
            </button>
          </div>

          {activeTab === 'leaderboard' ? (
            <div className="grid gap-3">
              {displayLeaderboard.map((entry, index) => (
                <div key={entry.rank} className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className={cn("w-10 h-10 flex items-center justify-center rounded-xl font-black", index === 0 ? "bg-yellow-100 text-yellow-600" : "bg-zinc-50 text-zinc-400")}>{entry.rank}</div>
                  <img src={entry.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <div className="font-black text-zinc-800">{entry.name}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">{entry.tier}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-indigo-600 text-lg">{entry.points}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Points</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {displayBattles.map((battle) => (
                <div key={battle.id} className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-tighter", battle.result === 'win' ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-500")}>{battle.result === 'win' ? 'Win' : 'Loss'}</div>
                    <div>
                      <div className="font-black text-zinc-800">{battle.opponent}</div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(battle.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={cn("font-black text-lg", battle.result === 'win' ? "text-emerald-500" : "text-red-500")}>
                    {battle.result === 'win' ? '+' : ''}{battle.pointsChange} LP
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <Bookmark className="text-indigo-600" /> 對戰規則
              </h2>
              <button onClick={() => setShowRules(false)} className="p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <div className="space-y-6">
              {["每場對戰包含 5 題測驗，回答速度決定分數加乘。", "積分賽獲勝可提升段位，失敗則會扣除積分。", "賽季前 50 名玩家可獲得限定頭像框獎勵。"].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black flex items-center justify-center shrink-0">{i+1}</div>
                  <p className="text-sm font-bold text-zinc-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowRules(false)} className="w-full mt-10 py-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-black transition-all">
              確認並返回
            </button>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-zinc-50">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Star className="text-amber-500" fill="currentColor" /> 我的收藏
              </h2>
              <button onClick={() => setShowFavorites(false)} className="text-zinc-300 hover:text-zinc-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[350px] overflow-y-auto">
              {favorites.length > 0 ? (
                favorites.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedExam({ id: item.id, name: item.name });
                      setShowFavorites(false);
                    }}
                    className="w-full p-5 bg-zinc-50 hover:bg-amber-50 border border-zinc-50 hover:border-amber-200 rounded-[1.5rem] flex items-center justify-between group transition-all"
                  >
                    <div className="text-left">
                      {/* 1. 考卷名稱 */}
                      <span className="font-bold text-zinc-600 group-hover:text-amber-700 block">{item.name}</span>

                      {/* 2. [修改重點] 顯示：分類 / 分組 (例如：初等考試 / 一般行政) */}
                      <span className="text-xs text-zinc-400 mt-1 block font-medium">
                        {item.category} {item.groupName && ` / ${item.groupName}`}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-zinc-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-300 font-bold">目前尚無收藏科目</div>
              )}
            </div>
            <div className="p-8 pt-2">
              <button onClick={() => setShowFavorites(false)} className="w-full py-4 bg-zinc-100 text-zinc-500 font-black rounded-2xl hover:bg-zinc-200 transition-colors">
                關閉清單
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Searching Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[150] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="relative w-40 h-40 mb-10">
            <div className="absolute inset-0 border-[6px] border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Swords className="w-16 h-16 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-black mb-2">正在搜尋對手</h2>
          <p className="text-zinc-400 font-bold animate-pulse">正在為您匹配 {selectedExam?.name} 的競爭者...</p>

          <div className="mt-12 flex items-center gap-10">
            <div className="text-center animate-in slide-in-from-left duration-700">
              <img src={mockUser.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-2xl mb-3" alt="" />
              <div className="font-black text-sm">YOU</div>
            </div>
            <div className="text-4xl font-black text-zinc-100 italic">VS</div>
            <div className="text-center animate-in slide-in-from-right duration-700">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center border-4 border-white shadow-2xl mb-3 overflow-hidden">
                <Search className="w-8 h-8 text-zinc-300 animate-bounce" />
              </div>
              <div className="font-black text-sm text-zinc-300">SEARCHING...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
