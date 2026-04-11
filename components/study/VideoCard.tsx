'use client';

import { useCallback, useId, useState } from 'react';
import { useVideoCompletion } from '@/hooks/useVideoCompletion';
import { ExpPopup } from './ExpPopup';
import type { Lesson } from '@/types';

interface VideoCardProps {
  lesson: Lesson;
  isWatched: boolean;
  onComplete: (lessonId: string) => void;
}

export function VideoCard({ lesson, isWatched, onComplete }: VideoCardProps) {
  const uid        = useId().replace(/:/g, '');
  const containerId = `yt-player-${uid}`;
  const [showPopup, setShowPopup] = useState(false);
  const [completed, setCompleted] = useState(isWatched);

  const handleComplete = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    setShowPopup(true);
    onComplete(lesson.id);
  }, [completed, lesson.id, onComplete]);

  useVideoCompletion({
    videoId: lesson.youtubeVideoId,
    containerId,
    onComplete: handleComplete,
  });

  return (
    <div className="shorts-slide relative bg-gray-950 flex flex-col">
      {/* YouTube 플레이어 */}
      <div className="flex-1 relative">
        <div id={containerId} className="w-full h-full" />
        {showPopup && (
          <ExpPopup amount={lesson.expReward} onDone={() => setShowPopup(false)} />
        )}
      </div>

      {/* 하단 정보 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              {lesson.subject === 'math' ? '📐 수학' : lesson.subject === 'science' ? '🔬 과학' : '💻 코딩'}
            </p>
            <h3 className="text-white font-bold text-lg leading-tight">{lesson.title}</h3>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-xs text-yellow-400 font-bold">+{lesson.expReward} EXP</div>
            {completed && <div className="text-xs text-green-400 mt-0.5">✓ 완료</div>}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">아래로 스크롤해서 퀴즈 풀기</p>
      </div>
    </div>
  );
}
