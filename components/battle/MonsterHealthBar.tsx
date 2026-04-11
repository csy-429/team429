'use client';

interface MonsterHealthBarProps {
  current: number;
  max: number;
  monsterName: string;
}

export function MonsterHealthBar({ current, max, monsterName }: MonsterHealthBarProps) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 font-bold">{monsterName}</span>
        <span className="text-gray-400">{current} / {max}</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
