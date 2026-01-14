import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ArrowLeft, CheckCircle2,
  XCircle, RefreshCcw, Loader2, AlertTriangle,
  Trophy, Sparkles, Map, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. 動態掃描資源
const allImages = import.meta.glob('../lib/questions/images/**/*.{jpg,jpeg,png,svg,webp}', { eager: true });
const questionFiles = import.meta.glob('../lib/questions/*.json');

export default function Practice() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- 狀態管理 ---
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null); // 燈箱功能

  // --- 圖片解析函式 ---
  const getImageUrl = (jsonPath: any) => {
    if (!jsonPath) return null;
    const path = typeof jsonPath === 'object' ? jsonPath.file_path : jsonPath;
    if (typeof path !== 'string') return null;
    const normalizedPath = path.replace('@/', '../');
    const target = allImages[normalizedPath];
    return target ? (target as any).default : null;
  };

  // --- 計算屬性 ---
  const practiceMapId = useMemo(() => {
    if (!id) return '';
    const cleanId = id.trim();
    const parts = cleanId.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : cleanId;
  }, [id]);

  const accuracy = useMemo(() => {
    const total = correctCount + wrongCount;
    return total === 0 ? 0 : Math.round((correctCount / total) * 100);
  }, [correctCount, wrongCount]);

  // --- 資料載入 ---
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const filePath = Object.keys(questionFiles).find(path => path.includes(`${id}.json`));
        if (filePath) {
          const module: any = await questionFiles[filePath]();
          const data = module.default || module;
          // 確保能處理包含在 questions 屬性內或直接是陣列的資料
          setQuestions(Array.isArray(data) ? data : (data.questions || []));
        }
      } catch (error) {
        console.error("載入失敗:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // --- 事件處理 ---
  const handleOptionClick = (key: string) => {
    if (isSubmitted) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isMulti = currentQuestion?.type === 'mixed' || Array.isArray(currentQuestion?.correctAnswer);

    if (isMulti) {
      setSelectedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    } else {
      const finalKeys = [key];
      setSelectedKeys(finalKeys);
      submitAnswer(finalKeys);
    }
  };

  const submitAnswer = (userKeys: string[]) => {
    setIsSubmitted(true);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = currentQuestion.correctAnswer;
    const isCorrect = Array.isArray(correct)
      ? userKeys.length === correct.length && userKeys.every(k => correct.includes(k))
      : userKeys[0] === correct;

    if (isCorrect) setCorrectCount(prev => prev + 1);
    else setWrongCount(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedKeys([]);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-emerald-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-bold tracking-widest uppercase text-sm text-zinc-500">正在準備練習題...</p>
    </div>
  );

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">練習完成！</h2>
          <p className="text-zinc-500 mb-10">你已經完成了本次的所有挑戰</p>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-zinc-800/40 p-6 rounded-[2rem] border border-white/5">
              <span className="block text-emerald-400 text-4xl font-black mb-1">{accuracy}%</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">正確率</span>
            </div>
            <div className="bg-zinc-800/40 p-6 rounded-[2rem] border border-white/5">
              <span className="block text-zinc-100 text-4xl font-black mb-1">{correctCount}/{questions.length}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">答對題數</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => navigate('/home')} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg">
              <Sparkles size={20} /> AI 深度解析題目
            </button>
            <button onClick={() => navigate(`/practice/${practiceMapId}`)} className="w-full py-5 bg-zinc-100 text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white transition-all shadow-md">
              <Map size={20} /> 返回地圖
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMulti = currentQuestion?.type === 'mixed' || Array.isArray(currentQuestion?.correctAnswer);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col pb-safe relative">

      {/* 燈箱元件 */}
      {zoomImg && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} className="max-w-full max-h-[90vh] object-contain" alt="Zoom" />
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full"><X /></button>
        </div>
      )}

      {/* 防呆警告彈窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-sm relative z-[101] shadow-2xl text-center">
            <AlertTriangle size={48} className="text-rose-500 mx-auto mb-6" />
            <h3 className="text-xl font-black mb-2">確定要中途退出？</h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              現在離開將會 <span className="text-rose-400 font-bold underline">扣除體力</span>。
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate(-1)} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black">確定退出</button>
              <button onClick={() => setShowExitConfirm(false)} className="w-full py-4 bg-zinc-800 text-zinc-300 rounded-2xl font-black">繼續練習</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-zinc-900/50">
        <button onClick={() => setShowExitConfirm(true)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-lg font-black text-emerald-400 font-mono">{correctCount}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-2xl">
            <XCircle size={18} className="text-rose-400" />
            <span className="text-lg font-black text-rose-400 font-mono">{wrongCount}</span>
          </div>
        </div>
      </div>

      <div className="h-1 bg-zinc-800 w-full">
        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col max-w-5xl mx-auto w-full py-8 overflow-y-auto">
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] mb-6">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block mb-4">
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          <h2 className="text-xl font-bold leading-relaxed whitespace-pre-wrap">{currentQuestion?.text}</h2>

          {/* 題目圖片顯示區域 */}
          {currentQuestion?.images && currentQuestion.images.length > 0 && (
            <div className="flex flex-col gap-4 mt-6">
              {currentQuestion.images.map((img: any, idx: number) => {
                const src = getImageUrl(img);
                return src ? (
                  <div key={idx} className="bg-black/20 p-2 rounded-2xl border border-white/5 flex justify-center">
                    <img
                      src={src}
                      onClick={() => setZoomImg(src)}
                      className="max-h-[300px] w-auto rounded-lg cursor-zoom-in active:scale-[0.98] transition-transform"
                      alt="Question"
                    />
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion?.options.map((option: any) => {
            const isSelected = selectedKeys.includes(option.key);
            const correct = currentQuestion.correctAnswer;
            const isCorrectOption = Array.isArray(correct) ? correct.includes(option.key) : correct === option.key;
            const optImg = getImageUrl(option.imageUrl);

            return (
              <button
                key={option.key}
                onClick={() => handleOptionClick(option.key)}
                disabled={isSubmitted}
                className={cn(
                  "p-5 rounded-2xl border-2 text-left transition-all flex flex-col gap-4",
                  !isSubmitted
                    ? isSelected ? "bg-emerald-500/10 border-emerald-500" : "bg-zinc-900/50 border-white/5"
                    : isCorrectOption ? "bg-emerald-500/20 border-emerald-500 text-emerald-100" : isSelected ? "bg-rose-500/20 border-rose-500 text-rose-100" : "opacity-40 border-transparent"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0",
                    isSelected ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-zinc-500"
                  )}>
                    {option.key}
                  </div>
                  <span className="text-base font-medium">{option.text}</span>
                </div>

                {/* 選項圖片顯示區域 */}
                {optImg && (
                  <div className="mt-2 w-full flex justify-center bg-black/10 rounded-xl p-2 border border-white/5">
                    <img src={optImg} className="max-h-[160px] w-auto rounded-lg" alt={option.key} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {isMulti && !isSubmitted && (
            <button
              onClick={() => submitAnswer(selectedKeys)}
              disabled={selectedKeys.length === 0}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-500 transition-colors"
            >
              確認送出
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={nextQuestion}
              className="w-full py-5 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
            >
              {currentQuestionIndex === questions.length - 1 ? "查看結果" : "下一題"} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/5 bg-zinc-900/30">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <RefreshCcw size={18} />
            <span className="text-xs font-bold tracking-widest uppercase">重新開始練習</span>
          </button>
        </div>
      </div>
    </div>
  );
}
