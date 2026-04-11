'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/map',     icon: '🗺️', label: '지도' },
  { href: '/profile', icon: '⚔️', label: '내 캐릭터' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-40">
      {navItems.map(item => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center py-3 text-xs transition',
              active ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
