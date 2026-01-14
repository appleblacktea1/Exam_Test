import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Globe, Smartphone, Mail } from 'lucide-react';
import { useGlobalState } from '@/state/GlobalState';
import { authService } from '@/lib/authService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { config, updateConfig } = useGlobalState();
  const [platformName, setPlatformName] = useState(config.platformName);
  const [supportEmail, setSupportEmail] = useState(config.supportEmail);
  const [maintenance, setMaintenance] = useState(config.maintenance);
  const [staminaMax, setStaminaMax] = useState(config.staminaMax);
  const [staminaRecoveryMinutes, setStaminaRecoveryMinutes] = useState(config.staminaRecoveryMinutes);
  const [baseExpPerQuestion, setBaseExpPerQuestion] = useState(config.baseExpPerQuestion);

  const [emailTemplate, setEmailTemplate] = useState(authService.getEmailTemplate());

  const handleSave = () => {
    updateConfig({ platformName, supportEmail, maintenance, staminaMax, staminaRecoveryMinutes, baseExpPerQuestion });
    authService.updateEmailTemplate(emailTemplate);
    alert('設定已儲存！');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">系統設定</h2>
          <p className="text-sm text-gray-500">管理平台配置與偏好設定</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          <span>儲存變更</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
            <nav className="flex flex-col p-2 space-y-1">
              {[
                { id: 'general', label: '一般設定', icon: Globe },
                { id: 'notifications', label: '通知設定', icon: Bell },
                { id: 'security', label: '安全與權限', icon: Shield },
                { id: 'database', label: '資料庫與備份', icon: Database },
                { id: 'app', label: 'App 配置', icon: Smartphone },
                { id: 'email', label: '郵件通知', icon: Mail },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-700 pb-4">
                平台資訊
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">平台名稱</label>
                  <input type="text" value={platformName} onChange={e => setPlatformName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">客服信箱</label>
                  <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">維護模式</label>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700">
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                      <input checked={maintenance} onChange={e => setMaintenance(e.target.checked)} type="checkbox" id="maintenance" className="peer absolute opacity-0 w-0 h-0" />
                      <label htmlFor="maintenance" className="block w-12 h-6 bg-gray-300 dark:bg-zinc-700 rounded-full cursor-pointer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6"></label>
                    </div>
                    <span className="text-sm text-gray-500">
                      啟用維護模式以在更新期間阻止用戶訪問。
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App Configuration */}
          {activeTab === 'app' && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-700 pb-4">
                遊戲機制
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">每日體力上限</div>
                    <div className="text-xs text-gray-500">用戶可持有的最大體力</div>
                  </div>
                  <input type="number" value={staminaMax} onChange={e => setStaminaMax(parseInt(e.target.value || '0', 10))} className="w-24 px-3 py-1 text-center bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">體力恢復速度</div>
                    <div className="text-xs text-gray-500">每恢復 1 點體力所需分鐘數</div>
                  </div>
                  <input type="number" value={staminaRecoveryMinutes} onChange={e => setStaminaRecoveryMinutes(parseInt(e.target.value || '0', 10))} className="w-24 px-3 py-1 text-center bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">每題基礎經驗值</div>
                    <div className="text-xs text-gray-500">答對題目獲得的經驗值</div>
                  </div>
                  <input type="number" value={baseExpPerQuestion} onChange={e => setBaseExpPerQuestion(parseInt(e.target.value || '0', 10))} className="w-24 px-3 py-1 text-center bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg" />
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['notifications', 'security', 'database'].includes(activeTab) && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">即將開放配置</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                此區塊正在開發中。{activeTab} 的進階設定將在下次更新中提供。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Icon for the placeholder
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default Settings;
