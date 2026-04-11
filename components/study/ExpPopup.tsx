'use client';

import { useEffect, useState } from 'react';

interface ExpPopupProps {
  amount: number;
  onDone?: () => void;
}

export function ExpPopup({ amount, onDone }: ExpPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-float-up">
      <div className="bg-yellow-400 text-gray-900 font-bold text-xl px-5 py-2 rounded-full shadow-lg">
        +{amount} EXP ⭐
      </div>
    </div>
  );
}
