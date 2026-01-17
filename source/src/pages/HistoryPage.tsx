import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Search, History, Trash2,
  Calendar, ChevronRight, CheckCircle2, XCircle,
  Swords, BookOpen, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHistory } from '@/context/HistoryContext';
// 請確認您的 mockData 路徑正確
import { mockCategories } from '@/lib/mockData';

// --- ID 轉中文名稱的工具函式 ---
const getExamDisplayName = (recordId: string) => {
  if (!recordId) return "未知考卷";

  for (const cat of mockCategories) {
    if (cat.groups) {
      for (const group of cat.groups) {
        for (const exam of group.exams) {
          // 比對邏輯：只要紀錄 ID 包含資料庫的 ID (例如 110_...501_01 包含 501_01)
          if (recordId.includes(exam.id)) {
            return `${cat.name} / ${group.groupName} / ${exam.name}`;
          }
        }
      }
    }
  }
  return recordId; // 找不到就回傳原始 ID
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const { records, clearRecords } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  // 篩選模式狀態: 'all' | 'challenge' | 'practice'
  const [filterMode, setFilterMode] = useState<'all' | 'challenge' | 'practice'>('all');

  // 過濾邏輯
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // 取得中文名稱用於搜尋
      const displayName = getExamDisplayName(record.examId);
      const rawName = record.examName;

      // 1. 關鍵字搜尋 (搜中文名稱 或 原始標題)
      const matchesSearch =
        displayName.includes(searchQuery) ||
        rawName.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. 模式按鈕過濾
      let matchesMode = true;
      if (filterMode === 'challenge') {
        matchesMode = rawName.includes('挑戰');
      } else if (filterMode === 'practice') {
        // 包含 "練習", "歷屆" 且 不含 "挑戰"
        matchesMode = (rawName.includes('練習') || rawName.includes('歷屆')) && !rawName.includes('挑戰');
      }

      return matchesSearch && matchesMode;
    });
  }, [records, searchQuery, filterMode]);

  return (
    <div className="h-screen bg-zinc-50 dark:bg-[#09090b] flex flex-col text-zinc-900 dark:text-zinc-100 font-sans">

      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b26] border-b border-zinc-100 dark:border-white/5 p-4 md:p-6 flex-none z-10 shadow-sm space-y-4">

        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black flex items-center gap-2">
              答題歷史 <History className="text-indigo-500" />
            </h1>
          </div>
          {records.length > 0 && (
            <button onClick={clearRecords} className="text-xs text-red-500 flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition-colors font-bold">
              <Trash2 size={14} /> 清空紀錄
            </button>
          )}
        </div>

        {/* --- [這就是您要找的快捷篩選按鈕] --- */}
        <div className="flex gap-2">
           <button
             onClick={() => setFilterMode('all')}
             className={cn(
               "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
               filterMode === 'all'
                 ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900"
                 : "bg-transparent text-zinc-500 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5"
             )}
           >
             <Filter size={14} /> 全部
           </button>

           <button
             onClick={() => setFilterMode('challenge')}
             className={cn(
               "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
               filterMode === 'challenge'
                 ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                 : "bg-transparent text-zinc-500 border-zinc-200 dark:border-white/10 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600"
             )}
           >
             <Swords size={14} /> 挑戰模式
           </button>

           <button
             onClick={() => setFilterMode('practice')}
             className={cn(
               "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
               filterMode === 'practice'
                 ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                 : "bg-transparent text-zinc-500 border-zinc-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600"
             )}
           >
             <BookOpen size={14} /> 一般模式
           </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="搜尋考試科目 (例如：國文、法學大意...)"
            className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-black/20 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-20 custom-scrollbar">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <History size={48} className="mb-4 opacity-20" />
            <p className="font-medium">
              {filterMode === 'all' ? "尚無答題紀錄" :
               filterMode === 'challenge' ? "尚無挑戰模式紀錄" : "尚無一般練習紀錄"}
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isChallenge = record.examName.includes('挑戰');
            // 呼叫轉換函式顯示中文
            const displayTitle = getExamDisplayName(record.examId);

            return (
              <button
                key={record.id}
                onClick={() => navigate(`/history/${record.id}`)}
                className="w-full bg-white dark:bg-[#18181b] p-5 rounded-3xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all group text-left relative overflow-hidden"
              >
                {/* 左側顏色條 */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  isChallenge ? "bg-amber-500" : "bg-emerald-500"
                )} />

                <div className="flex justify-between items-start mb-3 pl-2">
                  <div className="min-w-0 pr-2">

                    <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100 flex items-center gap-2 flex-wrap">
                      {/* 模式標籤 */}
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border font-black uppercase tracking-wider shrink-0",
                        isChallenge
                          ? "bg-amber-100 text-amber-600 border-amber-200"
                          : "bg-emerald-100 text-emerald-600 border-emerald-200"
                      )}>
                        {isChallenge ? "挑戰模式" : "一般模式"}
                      </span>

                      {/* 中文考試名稱 */}
                      <span className="truncate break-all">
                        {displayTitle}
                      </span>
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      <Calendar size={12} />
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {/* 分數 */}
                  <div className={cn(
                    "flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 shrink-0 ml-2",
                    record.score >= 80 ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400" :
                    record.score >= 60 ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400" :
                    "bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                  )}>
                    <span className="text-xl font-black">{record.score}</span>
                    <span className="text-[9px] uppercase font-bold">分</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-3 pl-2">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      {record.correctCount} 正確
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-rose-500 dark:text-rose-400">
                      <XCircle size={16} />
                      {record.totalCount - record.correctCount} 錯誤
                    </div>
                  </div>
                  <div className="text-zinc-400 group-hover:text-indigo-500 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
