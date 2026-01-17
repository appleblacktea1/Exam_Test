import { Outlet, Link, useLocation } from 'react-router-dom';
import { useGlobalState } from '@/state/GlobalState';
import BottomNav from '@/components/BottomNav';
import { Map, Swords, BookOpen, ShoppingBag, LogOut, LayoutGrid } from 'lucide-react';import { cn } from '@/lib/utils';

export default function MainLayout() {
  const logoUrl = "data:image/png;base64,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";
  const { config } = useGlobalState();
  const location = useLocation();
  const currentPath = location.pathname;


  const navItems = [
    { path: '/', icon: Map, label: '大廳' },
    { path: '/Classification', icon: LayoutGrid, label: '分類' },
    { path: '/arena', icon: Swords, label: '競技場' },
    { path: '/academy', icon: BookOpen, label: '學院' },
    { path: '/shop', icon: ShoppingBag, label: '商城' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans pb-20 md:pb-0 flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 z-50 shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-2xl shadow-lg" />
            <span className="font-bold text-2xl text-zinc-900 dark:text-white tracking-tight">{config.platformName}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-zinc-900"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "scale-110"
                  )}
                  fill={isActive ? "currentColor" : "none"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors font-bold text-sm">
            <LogOut size={20} />
            登出帳號
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden relative">
        <div className="container mx-auto max-w-[100%] md:max-w-5xl lg:max-w-full min-h-screen bg-white dark:bg-zinc-900 shadow-xl md:shadow-none md:bg-transparent overflow-hidden md:overflow-visible">
          {config.maintenance && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
                <div className="font-bold text-lg">系統維護中</div>
                <div className="text-sm text-zinc-600 mt-1">目前暫停服務，請稍後再試</div>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation - Visible mainly on mobile/tablet */}
      <BottomNav />
    </div>
  );
}
