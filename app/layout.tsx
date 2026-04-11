import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ClientProviders } from '@/components/layout/ClientProviders';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'EduShorts — 몬스터를 사냥하며 배우자',
  description: '게이미피케이션 교육 쇼츠 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-950 text-white">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
