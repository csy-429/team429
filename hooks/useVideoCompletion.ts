'use client';

import { useEffect, useRef, useState } from 'react';
import { VIDEO_WATCH_THRESHOLD } from '@/constants/game';

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement | string,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface UseVideoCompletionOptions {
  videoId: string;
  containerId: string;
  onComplete: () => void;
}

export function useVideoCompletion({ videoId, containerId, onComplete }: UseVideoCompletionOptions) {
  const playerRef = useRef<YTPlayer | null>(null);
  const completedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    completedRef.current = false;

    function initPlayer() {
      if (!window.YT?.Player) return;

      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (event) => {
            // ENDED = 0
            if (event.data === 0 && !completedRef.current) {
              completedRef.current = true;
              onComplete();
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        initPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, containerId, onComplete]);

  // 2초마다 폴링 — 85% 이상 시청 감지
  useEffect(() => {
    if (!playerReady) return;

    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player || completedRef.current) return;

      const current  = player.getCurrentTime();
      const duration = player.getDuration();
      if (duration > 0 && current / duration >= VIDEO_WATCH_THRESHOLD) {
        completedRef.current = true;
        onComplete();
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playerReady, onComplete]);
}
