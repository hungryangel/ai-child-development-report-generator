// src/app/admin/page.tsx
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import type { PreorderSignup } from '@prisma/client';
import { Container, Card, SectionTitle } from '@/components/ui';

export default async function AdminPage() {
  // 간단 Basic 토큰 보호
  const auth = (await headers()).get('authorization') || '';
  const ok = auth === `Basic ${process.env.ADMIN_BASIC_TOKEN}`;
  if (!ok) return new Response('Unauthorized', { status: 401 }) as any;

  const [signups, teachers, latest] = await Promise.all([
    prisma.preorderSignup.count(),
    prisma.preorderSignup.count({ where: { role: { contains: '교' } } }),
    prisma.preorderSignup.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    }) as Promise<PreorderSignup[]>, // 타입 명시
  ]);

  return (
    <main className="py-10">
      <Container>
        <SectionTitle title="어드민 미니 대시보드" subtitle="사전예약/실시간 지표" />

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <b>총 사전예약</b>
            <div className="mt-2 text-3xl font-bold">{signups}</div>
          </Card>
          <Card>
            <b>교사</b>
            <div className="mt-2 text-3xl font-bold">{teachers}</div>
          </Card>
          <Card>
            <b>최근 24시간</b>
            <div className="mt-2 text-3xl font-bold">(집계예정)</div>
          </Card>
        </div>

        <SectionTitle title="최근 등록" />
        <div className="grid gap-2">
          {latest.map((r: PreorderSignup) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  role: {r.role ?? '-'} · org: {r.orgName ?? '-'}
                </div>
                <code className="text-xs">ref: {r.refCode}</code>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}
