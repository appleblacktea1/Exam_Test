import { Link, useLocation } from 'react-router-dom';
import { Map, Swords, BookOpen, ShoppingBag, LogOut, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pb-safe pt-2 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <item.icon
                size={24}
                className={cn(
                  "transition-all duration-200",
                  isActive && "scale-110 drop-shadow-md"
                )}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
