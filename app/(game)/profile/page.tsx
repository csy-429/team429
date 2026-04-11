'use client';

export const dynamic = 'force-dynamic';

import { useGame } from '@/contexts/GameContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { PlayerStats } from '@/components/profile/PlayerStats';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { userData, loading } = useGame();
  const { progress } = useUserProgress();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-spin">⚔️</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-2xl font-bold text-white mb-5">내 캐릭터</h1>
      <PlayerStats userData={userData} progressMap={progress} />

      <button
        onClick={handleSignOut}
        className="mt-8 w-full bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium py-3 rounded-2xl transition"
      >
        로그아웃
      </button>
    </div>
  );
}
