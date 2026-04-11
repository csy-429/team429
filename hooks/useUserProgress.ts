'use client';

import { useEffect, useState } from 'react';
import { subscribeToAllProgress } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import type { MonsterProgress } from '@/types';

export function useUserProgress() {
  const { firebaseUser } = useAuth();
  const [progress, setProgress] = useState<Record<string, MonsterProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setProgress({});
      setLoading(false);
      return;
    }

    const unsub = subscribeToAllProgress(firebaseUser.uid, (map) => {
      setProgress(map);
      setLoading(false);
    });
    return unsub;
  }, [firebaseUser]);

  return { progress, loading };
}
