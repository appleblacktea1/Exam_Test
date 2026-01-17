import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, CheckCircle2, XCircle, Sparkles, AlertCircle, Lock,
  ListChecks, CheckSquare, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHistory } from '@/context/HistoryContext';
import { mockCategories } from '@/lib/mockData';

// --- 1. 動態掃描圖片資源 (必須放在 Component 外) ---
// 這裡的路徑必須與您 JSON 中的路徑對應
const allImages = import.meta.glob('../lib/questions/images/**/*.{jpg,jpeg,png,svg,webp}', { eager: true });

// --- 2. 圖片處理邏輯 ---
const getImageUrl = (jsonPath: any) => {
  if (!jsonPath) return null;
  // 處理可能是物件或字串的情況
  const path = typeof jsonPath === 'object' ? jsonPath.file_path : jsonPath;
  if (typeof path !== 'string') return null;

  // 將 @/ 替換為相對路徑 ../ 以匹配 glob 掃描的結果
  const normalizedPath = path.replace('@/', '../');
  const target = allImages[normalizedPath];

  // Vite 在 eager 模式下，default 屬性即為圖片 URL
  return target ? (target as any).default : null;
};

// --- ID 轉中文名稱工具 ---
const getExamDisplayName = (recordId: string) => {
  if (!recordId) return "未知考卷";
  for (const cat of mockCategories) {
    if (cat.groups) {
      for (const group of cat.groups) {
        for (const exam of group.exams) {
          if (recordId.includes(exam.id)) {
            return `${cat.name} / ${group.groupName} / ${exam.name}`;
          }
        }
      }
    }
  }
  return recordId;
};

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecord } = useHistory();

  const record = useMemo(() => id ? getRecord(id) : undefined, [id, getRecord]);

  // 控制圖片放大燈箱
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // 權限模擬
  const isPro = false;

  const getMaskedContent = (realLength: number = 50) => {
    const mask = "此為付費解鎖內容，請升級會員以查看完整 AI 解析。";
    return mask.repeat(Math.ceil(realLength / mask.length));
  };

  if (!record) {
    return <div className="p-8 text-center text-zinc-500">找不到此紀錄</div>;
  }

  const displayTitle = getExamDisplayName(record.examId);
  const isChallenge = record.examName.includes('挑戰');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-20 font-sans">

      {/* 圖片燈箱 (Zoom Image Lightbox) */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setZoomImg(null)}
        >
          <img src={zoomImg} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Zoom" />
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-[#1a1b26]/90 backdrop-blur-md border-b border-zinc-100 dark:border-white/5 px-4 py-3 z-20 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors active:scale-95">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-black flex items-center gap-2 flex-wrap leading-tight">
              <span className={cn(
                "text-[9px] md:text-[10px] px-1.5 py-0.5 rounded border font-black uppercase tracking-wider shrink-0",
                isChallenge ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-emerald-100 text-emerald-600 border-emerald-200"
              )}>
                {isChallenge ? "Challenge" : "Practice"}
              </span>
              <span className="truncate break-all">{displayTitle}</span>
            </h1>
            <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              {new Date(record.timestamp).toLocaleString()} • 得分 {record.score}
            </p>
          </div>
        </div>
      </div>

      {/* 題目列表 */}
      <div className="p-3 md:p-6 max-w-3xl mx-auto space-y-4 md:space-y-6">
        {record.questions.map((q, idx) => {
          // --- 核心邏輯：判斷答案 ---
          const userAnsRaw = record.userAnswers[idx];
          const correctAnsRaw = q.correctAnswer;

          // 統一轉為陣列處理 (相容單選與複選)
          const userAnsArray = Array.isArray(userAnsRaw) ? userAnsRaw : (userAnsRaw ? [userAnsRaw] : []);
          const correctAnsArray = Array.isArray(correctAnsRaw) ? correctAnsRaw : [correctAnsRaw];

          // 判斷全對 (數量相同且每個答案都在正確答案陣列中)
          const isUserCorrect = userAnsArray.length === correctAnsArray.length &&
                                userAnsArray.every((k: string) => correctAnsArray.includes(k));

          // 判斷題型 (資料庫有 type 欄位最好，沒有就用答案數量猜)
          const isMultiChoice = q.type === 'mixed' || correctAnsArray.length > 1;

          return (
            <div key={idx} className="bg-white dark:bg-[#18181b] rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-zinc-200 dark:border-white/5 shadow-sm space-y-4 md:space-y-5">

              {/* 1. 題目區塊 */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                    <span className={cn(
                      "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-black",
                      isUserCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}>
                      {idx + 1}
                    </span>
                    {/* 題型標籤 */}
                    <div className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 border",
                      isMultiChoice
                        ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    )}>
                       {isMultiChoice ? <ListChecks size={10} /> : <CheckSquare size={10} />}
                       {isMultiChoice ? "複選" : "單選"}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <p className="font-bold text-base md:text-lg leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">
                      {q.text}
                    </p>
                    {/* 題目附圖 */}
                    {q.images && q.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {q.images.map((imgStr: any, imgIdx: number) => {
                           const src = getImageUrl(imgStr);
                           return src && (
                             <img
                               key={imgIdx}
                               src={src}
                               alt="Question"
                               onClick={() => setZoomImg(src)}
                               className="h-32 md:h-40 w-auto rounded-lg border border-zinc-200 dark:border-white/10 cursor-zoom-in hover:opacity-90 transition-opacity"
                             />
                           );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. 選項展示區 (全部顯示，並標記對錯) */}
              <div className="grid grid-cols-1 gap-2 md:gap-3">
                 {q.options.map((option: any) => {
                    const isSelected = userAnsArray.includes(option.key);
                    const isCorrectOption = correctAnsArray.includes(option.key);
                    const optImg = getImageUrl(option.imageUrl);

                    // 樣式邏輯：
                    // 1. 如果是正確答案 -> 綠色 (不管你有沒有選)
                    // 2. 如果你選錯了 (選了這個但它不是答案) -> 紅色
                    // 3. 其他沒選的錯誤選項 -> 灰色
                    let borderClass = "border-zinc-200 dark:border-white/5 bg-transparent opacity-60";
                    let textClass = "text-zinc-500 dark:text-zinc-400";
                    let icon = null;

                    if (isCorrectOption) {
                      // 這是正確答案
                      borderClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
                      textClass = "text-emerald-700 dark:text-emerald-400 font-bold";
                      icon = <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />;
                    } else if (isSelected) {
                      // 這是你選錯的
                      borderClass = "border-red-500 bg-red-50 dark:bg-red-500/10";
                      textClass = "text-red-700 dark:text-red-400 font-bold";
                      icon = <XCircle className="text-red-500 w-5 h-5 shrink-0" />;
                    }

                    return (
                      <div
                        key={option.key}
                        className={cn(
                          "relative p-3 md:p-4 rounded-xl border-2 flex items-start gap-3 transition-all",
                          borderClass
                        )}
                      >
                         <div className={cn(
                           "w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shrink-0 border mt-0.5",
                           isCorrectOption ? "bg-emerald-500 text-white border-emerald-500" :
                           isSelected ? "bg-red-500 text-white border-red-500" :
                           "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700"
                         )}>
                           {option.key}
                         </div>

                         <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                               <span className={cn("text-sm md:text-base leading-snug", textClass)}>
                                 {option.text}
                               </span>
                               {icon}
                            </div>
                            {/* 選項圖片 */}
                            {optImg && (
                               <img
                                 src={optImg}
                                 onClick={() => setZoomImg(optImg)}
                                 className="h-20 w-auto rounded-lg border border-black/5 cursor-zoom-in"
                                 alt={option.key}
                               />
                            )}
                         </div>
                      </div>
                    );
                 })}
              </div>

              {/* 3. AI 解析區 */}
              <div
                  className={cn(
                    "relative overflow-hidden rounded-xl md:rounded-2xl border transition-all duration-300 group",
                    !isPro
                      ? "bg-zinc-100 dark:bg-[#1e1e24]/50 border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-500/50"
                      : "bg-indigo-50 dark:bg-[#1e1e24] border-indigo-100 dark:border-indigo-500/20"
                  )}
                  onClick={() => !isPro && navigate('/shop')}
                >
                  <div className="p-4 md:p-5">
                    {isPro && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />}

                    <div className="flex items-center gap-2 mb-3">
                        <div className={cn("p-1 rounded-lg", isPro ? "bg-indigo-100" : "bg-zinc-200")}>
                          {isPro ? <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> : <Lock className="w-3.5 h-3.5 text-zinc-500" />}
                        </div>
                        <span className={cn("text-xs font-black uppercase tracking-widest", isPro ? "text-indigo-600" : "text-zinc-500")}>AI 解析</span>
                    </div>

                    <p className={cn(
                      "text-sm leading-relaxed font-medium transition-all duration-500",
                      isPro ? "text-zinc-700 dark:text-zinc-300 mb-4" : "text-zinc-400 blur-sm select-none opacity-50 line-clamp-3"
                    )}>
                      {isPro ? (q.explanation || "暫無解析") : getMaskedContent(q.explanation?.length || 50)}
                    </p>

                    {!isPro && (
                       <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/5 transition-colors">
                          <div className="bg-zinc-900/90 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                             <Lock size={12} /> 解鎖完整解析
                          </div>
                       </div>
                    )}
                  </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
