import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap, Coffee, Coins, Diamond, ChevronRight, LayoutGrid,
  BookOpen, Star, Target, Lightbulb
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useGlobalState } from '@/state/GlobalState';
import { mockUser, mockQuests } from '@/lib/mockData';
import QuestDrawer from '@/components/QuestDrawer';

// 1. 動態偵測資料夾下的 JSON 檔案
const questionFiles = import.meta.glob('../lib/questions/*.json');
const fileNames = Object.keys(questionFiles);

export default function PracticeMap() {
  const navigate = useNavigate();
  const { id: templateId } = useParams(); // 例如：010_501_01
  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const { config } = useGlobalState();

  // 2. 核心邏輯：過濾出符合當前 templateId 的年份檔案
  const availableYears = useMemo(() => {
    return fileNames
      .map(path => {
        const fileName = path.split('/').pop() || '';
        const nameWithoutExt = fileName.replace('.json', '');

        if (nameWithoutExt.includes(templateId)) {
          return {
            year: nameWithoutExt.split('_')[0],
            fullId: nameWithoutExt
          };
        }
        return null;
      })
      .filter((item): item is { year: string; fullId: string } => item !== null)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [templateId, fileNames]);

  const title = templateId?.endsWith('01') ? '國文歷屆試題' :
                templateId?.endsWith('02') ? '公民與英文歷屆' : '歷屆試題練習';

  return (
    <div className="flex flex-col h-full bg-[#09090b] min-h-screen text-white pb-24 font-sans relative overflow-hidden">
      {/* Background Elements - 改為綠色系 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#1a1b26]/80 backdrop-blur-md border-b border-white/5 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/CLassification')}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
            >
              <LayoutGrid size={20} />
            </button>
            <div className="relative group cursor-pointer">
              <img src={mockUser.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[#2a2b36] bg-zinc-800 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1a1b26]">
                Lv.{mockUser.level}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold sm:text-base leading-tight tracking-tight">
                  {title}
                </span>
                <span className="text-[9px] font-bold text-emerald-200 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30 tracking-tight mt-1">
                  ID: {templateId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-[#0f1016] px-3 py-1 rounded-full border border-white/5">
              <Coins size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-sm text-yellow-100">{mockUser.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0f1016] px-3 py-1 rounded-full border border-white/5">
              <Diamond size={14} className="text-cyan-400 fill-cyan-400" />
              <span className="font-bold text-sm text-cyan-100">{mockUser.diamonds.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#0f1016] rounded-full px-3 py-1 w-fit border border-white/5">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-100">{mockUser.stamina}/{config.staminaMax}</span>
          </div>
          <button
            onClick={() => setIsQuestOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-all"
          >
            <BookOpen size={16} className="text-white fill-white/20" />
            <span className="text-xs font-bold text-white">任務日誌</span>
          </button>
        </div>
      </div>
      <QuestDrawer isOpen={isQuestOpen} onClose={() => setIsQuestOpen(false)} quests={mockQuests} />

      {/* Adventure Map - 練習地圖 */}
      <div className="flex-1 overflow-y-auto px-4 py-12 relative z-10 custom-scrollbar">
        {/* Decorative Vertical Line - 綠色漸層 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent -z-10" />

        <div className="max-w-md mx-auto space-y-12 relative">
          {availableYears.length > 0 ? (
            availableYears.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isFirst = index === 0;

              return (
                <div key={item.fullId} className={cn("flex relative group", isLeft ? "justify-start" : "justify-end")}>
                  <Link
                    to={`/practicequiz/${item.fullId}`}
                    className="relative w-[85%] transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                  >
                    <div className={cn(
                      "relative overflow-hidden rounded-[2rem] border-2 backdrop-blur-md p-5 bg-zinc-900 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]",
                    )}>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                          {/* Year Badge - 綠色 */}
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-xl bg-emerald-500 text-white",
                          )}>
                            <span className="text-lg leading-none">{item.year}</span>
                            <span className="text-[8px] mt-1 opacity-70">年度</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white leading-tight">{item.year} 歷屆練習</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                一般模式
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Lightbulb size={20} className="text-emerald-400" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                        <div className="flex items-center gap-1 text-emerald-400 group-hover:translate-x-1 transition-transform">
                          <span className="text-[10px] font-black uppercase tracking-widest">開始刷題</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Target size={32} className="text-zinc-700 mb-6" />
              <h3 className="text-zinc-500 font-bold">目前尚無練習題目</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
