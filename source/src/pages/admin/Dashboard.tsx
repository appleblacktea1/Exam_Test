import React from 'react';
import { Users, DollarSign, AlertCircle, FileText, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className={`flex items-center gap-1 text-sm font-medium ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {change}
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
      </span>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">儀表板總覽</h2>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm">
            <option>過去 7 天</option>
            <option>過去 30 天</option>
            <option>本月</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            下載報告
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="活躍用戶 (DAU)"
          value="1,245"
          change="+12.5%"
          trend="up"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="總營收"
          value="$8,450"
          change="+8.2%"
          trend="up"
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="題庫回報"
          value="23"
          change="-5.4%"
          trend="down" // down is good for issues
          icon={AlertCircle}
          color="bg-orange-500"
        />
        <StatCard
          title="新增題目"
          value="156"
          change="+24.3%"
          trend="up"
          icon={FileText}
          color="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (Mock) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">營收與流量趨勢</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
              <div key={i} className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600"
                  style={{ height: `${h}%` }}
                ></div>
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                  Val: {h * 10}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span>一月</span><span>二月</span><span>三月</span><span>四月</span><span>五月</span><span>六月</span>
            <span>七月</span><span>八月</span><span>九月</span><span>十月</span><span>十一月</span><span>十二月</span>
          </div>
        </div>

        {/* Recent Activity / Logs */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">近期活動</h3>
          <div className="space-y-4">
            {[
              { user: 'Alice', action: '回報了一個問題', time: '5分鐘前', type: 'alert' },
              { user: 'Bob', action: '購買了 VIP (月費)', time: '12分鐘前', type: 'success' },
              { user: 'Charlie', action: '加入了公會 "Dragons"', time: '25分鐘前', type: 'info' },
              { user: 'System', action: '每日備份完成', time: '1小時前', type: 'system' },
              { user: 'David', action: '登入失敗', time: '2小時前', type: 'warning' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  item.type === 'alert' ? 'bg-red-500' :
                  item.type === 'success' ? 'bg-green-500' :
                  item.type === 'warning' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 dark:border-blue-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            查看所有日誌
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
