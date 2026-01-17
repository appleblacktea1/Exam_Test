import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定義收藏項目的完整結構
export interface FavoriteItem {
  id: string;
  name: string;
  category: string;
  groupName?: string; // [重要] 記得要有這個，收藏頁才能顯示小標籤
  icon: string;
  color: string;
  accuracy?: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isLoading: boolean;
  addFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// 1. 這裡一定要有 'export'
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化讀取
  useEffect(() => {
    const initFavorites = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const saved = localStorage.getItem('my_favorites_db');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load favorites", error);
      } finally {
        setIsLoading(false);
      }
    };
    initFavorites();
  }, []);

  // 同步寫入 LocalStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('my_favorites_db', JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  const addFavorite = async (item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      return [...prev, { ...item, accuracy: 0 }];
    });
  };

  const removeFavorite = async (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 2. 這裡一定要有 'export'，錯誤通常是因為這裡少了 export
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
