import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, Bell } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, handle logout logic here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            管理後台
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">考試系統營運中心</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">儀表板</span>
          </NavLink>

          <NavLink
            to="/admin/questions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`
            }
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">題庫管理</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">用戶管理</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">系統設置</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">登出</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 h-16 flex items-center justify-between px-6">
          <div className="md:hidden">
            {/* Mobile menu trigger could go here */}
            <span className="font-bold text-lg">管理後台</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">管理員</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
