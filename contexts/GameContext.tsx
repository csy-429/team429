'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToUser } from '@/lib/firebase/firestore';
import { useAuth } from './AuthContext';
import type { User } from '@/types';

interface GameContextValue {
  userData: User | null;
  loading: boolean;
}

const GameContext = createContext<GameContextValue>({ userData: null, loading: true });

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { firebaseUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const unsub = subscribeToUser(firebaseUser.uid, (user) => {
      setUserData(user);
      setLoading(false);
    });
    return unsub;
  }, [firebaseUser]);

  return (
    <GameContext.Provider value={{ userData, loading }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
