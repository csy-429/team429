'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// 루트 `/` 는 로그인 상태에 따라 분기
export default function RootPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (firebaseUser) {
      router.replace('/map');
    } else {
      router.replace('/login');
    }
  }, [firebaseUser, loading, router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-4xl animate-spin">⚔️</div>
    </div>
  );
}
