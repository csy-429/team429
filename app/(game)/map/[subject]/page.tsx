import { MonsterMap } from '@/components/monster/MonsterMap';
import { notFound } from 'next/navigation';

const VALID_SUBJECTS = ['math', 'science', 'coding'] as const;
type Subject = (typeof VALID_SUBJECTS)[number];

const BG: Record<Subject, string> = {
  math: '/maps/math.png',
  science: '/maps/science.png',
  coding: '/maps/coding.png',
};

export const dynamic = 'force-dynamic';

export default async function SubjectMapPage({
  params,
}: {
  params: Promise<{ subject: string }>; // ✅ Promise로 타입 변경
}) {
  const { subject: rawSubject } = await params; // ✅ await 추가
  const subject = rawSubject as Subject;

  if (!VALID_SUBJECTS.includes(subject)) {
    notFound();
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BG[subject]})` }}
    >
      <div className="min-h-screen bg-black/50">
        <MonsterMap defaultSubject={subject} />
      </div>
    </div>
  );
}