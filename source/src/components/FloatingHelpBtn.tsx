import { useLocation, useNavigate } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';

const FloatingHelpBtn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 定義要隱藏的路徑前綴 (Prefix)
  // 只要網址是以這些字串開頭，按鈕就會隱藏
  const hiddenPrefixes = ['/practicequiz', '/quiz'];

  // 2. 使用 startsWith 進行檢查
  // location.pathname 是當前的完整路徑 (例如: "/quiz/123")
  // "/quiz/123".startsWith("/quiz") 會回傳 true -> 隱藏
  const shouldHide = hiddenPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  // 如果符合隱藏條件，回傳 null (不渲染任何東西)
  if (shouldHide) return null;

  return (
    <button
      onClick={() => navigate('/content')}
      className="
        fixed z-50
        flex items-center justify-center
        bg-indigo-600 text-white
        rounded-full shadow-xl
        transition-all duration-300 ease-in-out
        hover:bg-indigo-700 hover:scale-110 hover:shadow-2xl hover:rotate-12
        active:scale-95
        bottom-20 right-4
        w-12 h-12
        md:bottom-8 md:right-8
        md:w-14 md:h-14
      "
      aria-label="Go to Content"
      title="前往說明內容"
    >
      {/* 建議：Icon 大小也可以隨之響應，手機版稍微縮小 (24px)，桌機版維持 (32px) */}
      <CircleHelp className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />

      <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:animate-ping"></span>
    </button>
  );
};

export default FloatingHelpBtn;
