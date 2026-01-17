import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ArrowLeft, CheckCircle2,
  XCircle, RefreshCcw, Loader2, AlertTriangle,
  Trophy, Sparkles, Map, X, Shuffle,
  ListChecks, CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
// 引入答題歷史與錯題本 Context
import { useHistory } from '@/context/HistoryContext';
// 1. 動態掃描資源
const allImages = import.meta.glob('../lib/questions/images/**/*.{jpg,jpeg,png,svg,webp}', { eager: true });
const questionFiles = import.meta.glob('../lib/questions/*.json');

export default function PracticeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { addRecord } = useHistory();
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
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // 記錄使用者每一題的答案 (給 AI 解析用)
  const [userAnswersMap, setUserAnswersMap] = useState<Record<number, string[]>>({});

  // 判斷是否為隨機模式
  const isRandomMode = useMemo(() => id?.includes('_random'), [id]);

  // --- [修正] 圖片解析函式 ---
  const getImageUrl = (jsonPath: any) => {
    if (!jsonPath) return null;
    const path = typeof jsonPath === 'object' ? jsonPath.file_path : jsonPath;
    if (typeof path !== 'string') return null;
    const normalizedPath = path.replace('@/', '../');
    const target = allImages[normalizedPath];
    return target ? (target as any).default : null;
  };

  // --- [關鍵修正] ID 計算邏輯 ---
  // 用於生成正確的返回路徑 (去除年份前綴)
  const practiceMapId = useMemo(() => {
    if (!id) return '';
    const rawId = id.replace('_random', '');
    if (isRandomMode) return rawId;

    const parts = rawId.split('_'); // 例如 ['110', '110010', '507', '04']

    if (parts.length >= 2) {
      const year = parts[0];     // '110'
      const rawCode = parts[1];  // '110010'

      // 如果第二段代碼以年份開頭，則切除年份
      let cleanCode = rawCode;
      if (rawCode.startsWith(year)) {
        cleanCode = rawCode.slice(year.length); // '010'
      }

      // 組合剩餘部分: '010' + '_' + '507_04' -> '010_507_04'
      const rest = parts.slice(2).join('_');
      return rest ? `${cleanCode}_${rest}` : cleanCode;
    }

    // 預設 fallback
    return parts.length > 1 ? parts.slice(1).join('_') : rawId;
  }, [id, isRandomMode]);

  // --- 資料載入 ---
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        if (isRandomMode) {
          const coreId = id.replace('_random', '');
          const matchingPaths = Object.keys(questionFiles).filter(path => path.includes(coreId));
          if (matchingPaths.length === 0) {
            console.error("找不到相關考卷");
            setLoading(false);
            return;
          }
          const loadedModules = await Promise.all(matchingPaths.map(path => questionFiles[path]()));
          let allQuestionsPool: any[] = [];
          loadedModules.forEach((module: any) => {
            const data = module.default || module;
            const qs = Array.isArray(data) ? data : (data.questions || []);
            allQuestionsPool = allQuestionsPool.concat(qs);
          });
          // 隨機打亂
          const shuffled = allQuestionsPool.sort(() => 0.5 - Math.random());
          const examCount = matchingPaths.length;
          // 取適量題目
          const questionsToTake = Math.ceil(shuffled.length / examCount);
          setQuestions(shuffled.slice(0, questionsToTake));
        } else {
          // 一般模式載入
          const filePath = Object.keys(questionFiles).find(path => path.includes(`${id}.json`));
          if (filePath) {
            const module: any = await questionFiles[filePath]();
            const data = module.default || module;
            setQuestions(Array.isArray(data) ? data : (data.questions || []));
          }
        }
      } catch (error) {
        console.error("載入失敗:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isRandomMode]);

  // --- 事件處理 ---
  const handleOptionClick = (key: string) => {
    if (isSubmitted) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isMulti = currentQuestion?.type === 'mixed' || Array.isArray(currentQuestion?.correctAnswer);

    if (isMulti) {
      // 多選邏輯
      setSelectedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    } else {
      // 單選邏輯 -> 直接提交
      const finalKeys = [key];
      setSelectedKeys(finalKeys);
      submitAnswer(finalKeys);
    }
  };

  // --- 提交答案 (包含計分、記錄、錯題本) ---
  const submitAnswer = (userKeys: string[]) => {
    setIsSubmitted(true);

    // 1. 記錄答案 (給 AI 解析用)
    setUserAnswersMap(prev => ({
      ...prev,
      [currentQuestionIndex]: userKeys
    }));

    const currentQuestion = questions[currentQuestionIndex];
    const correct = currentQuestion.correctAnswer;

    // 2. 判斷對錯
    const isCorrect = Array.isArray(correct)
      ? userKeys.length === correct.length && userKeys.every(k => correct.includes(k))
      : userKeys[0] === correct;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);

      // 3. 寫入錯題本
      if (addWrongQuestion) {
        addWrongQuestion({
          id: currentQuestion.id || `${id}_${currentQuestionIndex}`,
          examId: id || 'unknown',
          examName: isRandomMode ? `隨機練習 (${id})` : `歷屆試題 (${id})`,
          questionText: currentQuestion.text,
          options: currentQuestion.options,
          userAnswer: userKeys.length === 1 ? userKeys[0] : userKeys,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation || '暫無解析',
          category: currentQuestion.category || '綜合練習'
        });
      }
    }
  };

  // --- 下一題 / 結束 ---
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedKeys([]);
      setIsSubmitted(false);
    } else {
      // --- 結束邏輯 ---
      const finalAccuracy = Math.round((correctCount / questions.length) * 100);

      // 儲存完整歷史紀錄
      addRecord({
        examId: id || 'unknown',
        examName: isRandomMode ? `隨機練習 (${id})` : `歷屆試題 (${id})`,
        score: finalAccuracy,
        correctCount: correctCount,
        totalCount: questions.length,
        questions: questions,
        userAnswers: userAnswersMap
      });

      setIsFinished(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-emerald-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-bold tracking-widest uppercase text-sm text-zinc-500">
        {isRandomMode ? "正在混合題庫..." : "正在準備練習題..."}
      </p>
    </div>
  );

  // --- 結算畫面 ---
  if (isFinished) {
    const handleGoToAnalysis = () => {
      const accuracy = Math.round((correctCount / (correctCount + wrongCount || 1)) * 100);

      // 使用修正後的 practiceMapId 作為返回路徑
      const returnPath = isRandomMode
          ? `/practice/${id}`
          : `/practice/${practiceMapId}`;

      navigate(`${location.pathname}/analysis`, {
        state: {
          questions: questions,
          userAnswers: userAnswersMap,
          score: accuracy,
          correctCount: correctCount,
          returnPath: returnPath // 這裡傳遞正確路徑
        }
      });
    };

    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            {isRandomMode ? "隨機挑戰完成！" : "練習完成！"}
          </h2>
          <p className="text-zinc-500 mb-10">你已經完成了本次的所有挑戰</p>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-zinc-800/40 p-6 rounded-[2rem] border border-white/5">
              <span className="block text-emerald-400 text-4xl font-black mb-1">{Math.round((correctCount / questions.length) * 100)}%</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">正確率</span>
            </div>
            <div className="bg-zinc-800/40 p-6 rounded-[2rem] border border-white/5">
              <span className="block text-zinc-100 text-4xl font-black mb-1">{correctCount}/{questions.length}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">答對題數</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={handleGoToAnalysis} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg">
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
      {/* 燈箱 */}
      {zoomImg && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} className="max-w-full max-h-[90vh] object-contain" alt="Zoom" />
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full"><X /></button>
        </div>
      )}

      {/* 退出確認 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-sm relative z-[101] shadow-2xl text-center">
            <AlertTriangle size={48} className="text-rose-500 mx-auto mb-6" />
            <h3 className="text-xl font-black mb-2">確定要中途退出？</h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              現在離開將不會保存本次練習進度。
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate(-1)} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black">確定退出</button>
              <button onClick={() => setShowExitConfirm(false)} className="w-full py-4 bg-zinc-800 text-zinc-300 rounded-2xl font-black">繼續練習</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-none grid grid-cols-3 items-center p-4 border-b border-white/5 bg-zinc-900/50">
        <div className="flex justify-start">
          <button onClick={() => setShowExitConfirm(true)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="flex justify-center">
          {isRandomMode && (
            <div className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20 whitespace-nowrap">
              <Shuffle size={12} />
              隨機出題
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
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
      <div className="flex-1 px-6 flex flex-col max-w-5xl mx-auto w-full py-8 overflow-y-auto custom-scrollbar">
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block">
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>

            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
              isMulti
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}>
              {isMulti ? <ListChecks size={12} /> : <CheckSquare size={12} />}
              {isMulti ? "複選題" : "單選題"}
            </div>
          </div>

          <h2 className="text-xl font-bold leading-relaxed whitespace-pre-wrap">{currentQuestion?.text}</h2>

          {/* 題目圖片 */}
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
