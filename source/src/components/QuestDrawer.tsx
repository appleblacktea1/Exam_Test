import React, { useState } from 'react';
import { Trophy, X, CheckCircle, Coins, Diamond, Zap, Gift, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Quest } from '@/lib/mockData';
import { useGlobalState } from '@/state/GlobalState';

interface QuestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
}

export default function QuestDrawer({ isOpen, onClose, quests }: QuestDrawerProps) {
  const [activeQuestTab, setActiveQuestTab] = useState<'daily' | 'weekly' | 'achievement'>('daily');
  const { getEffectiveReward, claimQuest } = useGlobalState();

  // Filter quests by tab
  const displayQuests = quests.filter(q => q.type === activeQuestTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1b26] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 bg-[#13141c]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-yellow-400 fill-yellow-400/20" />
              任務中心
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} className="text-zinc-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-[#0f1016] rounded-xl">
            {(['daily', 'weekly', 'achievement'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveQuestTab(tab)}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  activeQuestTab === tab 
                    ? "bg-indigo-600 text-white shadow-lg" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {tab === 'daily' && '每日任務'}
                {tab === 'weekly' && '每週挑戰'}
                {tab === 'achievement' && '成就系統'}
              </button>
            ))}
          </div>
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayQuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <Target size={48} className="mb-4 opacity-20" />
                <p>目前沒有任務</p>
            </div>
          ) : (
            displayQuests.map((quest) => (
                <div 
                    key={quest.id} 
                    className={cn(
                        "bg-[#2a2b36] rounded-xl p-4 border border-white/5 relative overflow-hidden group transition-all",
                        quest.status === 'claimable' ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : ""
                    )}
                >
                    {quest.status === 'completed' && (
                        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/50 flex items-center gap-2 font-bold transform -rotate-12">
                                <CheckCircle size={18} />
                                已完成
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3 relative z-0">
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                                {quest.title}
                                {quest.type === 'daily' && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">每日</span>}
                            </h3>
                            <p className="text-sm text-zinc-400">{quest.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold border",
                                quest.reward.type === 'coins' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                quest.reward.type === 'diamonds' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                                "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            )}>
                                {quest.reward.type === 'coins' && <Coins size={12} fill="currentColor" />}
                                {quest.reward.type === 'diamonds' && <Diamond size={12} fill="currentColor" />}
                                {quest.reward.type === 'exp' && <Zap size={12} fill="currentColor" />}
                                +{getEffectiveReward(quest.reward as any).value}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 relative z-0">
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>進度</span>
                            <span>{quest.progress} / {quest.maxProgress}</span>
                        </div>
                        <div className="h-2 bg-[#13141c] rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    quest.status === 'claimable' ? "bg-yellow-500 animate-pulse" : "bg-indigo-500"
                                )}
                                style={{ width: `${Math.min((quest.progress / quest.maxProgress) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {quest.status === 'claimable' && (
                        <button onClick={() => claimQuest(quest.id)} className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-500/20 relative z-20">
                            <Gift size={18} />
                            領取獎勵
                        </button>
                    )}
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
