'use client';

interface PlayerHealthBarProps {
  current: number;
  max: number;
}

export function PlayerHealthBar({ current, max }: PlayerHealthBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400 mr-1">HP</span>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`text-xl transition-all ${i < current ? 'opacity-100' : 'opacity-20'}`}>
          ❤️
        </span>
      ))}
    </div>
  );
}
