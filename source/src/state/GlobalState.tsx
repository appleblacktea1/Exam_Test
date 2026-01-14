import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockUser, mockQuests, mockBadges } from '@/lib/mockData';

type Reward = { type: 'coins' | 'diamonds' | 'exp'; value: number };

type CourseProgress = Record<string, { percent: number; lastModuleId?: string }>;
type GlobalConfig = {
  platformName: string;
  supportEmail: string;
  maintenance: boolean;
  staminaMax: number;
  staminaRecoveryMinutes: number;
  baseExpPerQuestion: number;
};

interface GlobalStateShape {
  user: typeof mockUser;
  quests: typeof mockQuests;
  badges: typeof mockBadges;
  courseProgress: CourseProgress;
  config: GlobalConfig;
  updateUser: (u: Partial<{ name: string; certificationTarget: string; avatar: string }>) => void;
  addCoins: (v: number) => void;
  addDiamonds: (v: number) => void;
  spendCoins: (v: number) => boolean;
  spendDiamonds: (v: number) => boolean;
  claimQuest: (id: string) => void;
  getEffectiveReward: (r: Reward) => Reward;
  setCourseProgress: (courseId: string, progress: { percent: number; lastModuleId?: string }) => void;
  updateConfig: (c: Partial<GlobalConfig>) => void;
}

const GlobalStateCtx = createContext<GlobalStateShape | null>(null);

const STORAGE_KEY = 'global_state_v1';

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(mockUser);
  const [quests, setQuests] = useState(mockQuests);
  const [badges] = useState(mockBadges);
  const [courseProgress, setCourseProgressState] = useState<CourseProgress>({});
  const [config, setConfig] = useState<GlobalConfig>({
    platformName: '證在玩',
    supportEmail: 'support@exammaster.com',
    maintenance: false,
    staminaMax: 100,
    staminaRecoveryMinutes: 10,
    baseExpPerQuestion: 10,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user) setUser(parsed.user);
        if (parsed.quests) setQuests(parsed.quests);
        if (parsed.courseProgress) setCourseProgressState(parsed.courseProgress);
        if (parsed.config) setConfig(parsed.config);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const payload = { user, quests, courseProgress, config };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
  }, [user, quests, courseProgress, config]);

  const unlocked = useMemo(() => new Set(user.badges), [user.badges]);

  const coinBonus = unlocked.has('學習達人') ? 0.1 : 0; // +10% coins
  const expBonus = unlocked.has('初級證照') ? 0.05 : 0; // +5% exp

  const getEffectiveReward = (r: Reward): Reward => {
    if (r.type === 'coins') return { ...r, value: Math.floor(r.value * (1 + coinBonus)) };
    if (r.type === 'exp') return { ...r, value: Math.floor(r.value * (1 + expBonus)) };
    return r;
  };

  const addCoins = (v: number) => setUser(u => ({ ...u, coins: Math.max(0, u.coins + v) }));
  const addDiamonds = (v: number) => setUser(u => ({ ...u, diamonds: Math.max(0, u.diamonds + v) }));
  const spendCoins = (v: number) => {
    let ok = false;
    setUser(u => {
      ok = u.coins >= v;
      return ok ? { ...u, coins: u.coins - v } : u;
    });
    return ok;
  };
  const spendDiamonds = (v: number) => {
    let ok = false;
    setUser(u => {
      ok = u.diamonds >= v;
      return ok ? { ...u, diamonds: u.diamonds - v } : u;
    });
    return ok;
  };

  const updateUser = (u: Partial<{ name: string; certificationTarget: string; avatar: string }>) => {
    setUser(prev => ({ ...prev, ...u }));
  };

  const claimQuest = (id: string) => {
    setQuests(qs => qs.map(q => {
      if (q.id !== id) return q;
      const eff = getEffectiveReward(q.reward as Reward);
      if (eff.type === 'coins') addCoins(eff.value);
      if (eff.type === 'diamonds') addDiamonds(eff.value);
      if (eff.type === 'exp') setUser(u => ({ ...u, xp: u.xp + eff.value }));
      return { ...q, status: 'completed' } as any;
    }));
  };

  const setCourseProgress = (courseId: string, progress: { percent: number; lastModuleId?: string }) => {
    setCourseProgressState(prev => ({ ...prev, [courseId]: progress }));
  };

  const updateConfig = (c: Partial<GlobalConfig>) => setConfig(prev => ({ ...prev, ...c }));

  const value: GlobalStateShape = {
    user,
    quests,
    badges,
    courseProgress,
    config,
    updateUser,
    addCoins,
    addDiamonds,
    spendCoins,
    spendDiamonds,
    claimQuest,
    getEffectiveReward,
    setCourseProgress,
    updateConfig,
  };

  return <GlobalStateCtx.Provider value={value}>{children}</GlobalStateCtx.Provider>;
}

export function useGlobalState() {
  const ctx = useContext(GlobalStateCtx);
  if (!ctx) throw new Error('GlobalState not found');
  return ctx;
}

