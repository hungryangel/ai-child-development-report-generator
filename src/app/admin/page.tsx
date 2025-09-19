import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { Container, Card, SectionTitle } from "@/components/ui";

export default async function AdminPage() {
  const auth = (await headers()).get("authorization") || "";
  const ok = auth === `Basic ${process.env.ADMIN_BASIC_TOKEN}`;
  if (!ok) return new Response("Unauthorized", { status: 401 }) as any;

  const [signups, teachers] = await Promise.all([
    prisma.preorderSignup.count(),
    prisma.preorderSignup.count({ where: { role: { contains: "교" } } }),
  ]);
  const latest = await prisma.preorderSignup.findMany({ take: 20, orderBy: { createdAt: "desc" } });

  return (
    <main className="py-10">
      <Container>
        <SectionTitle title="어드민 미니 대시보드" subtitle="사전예약 현황" />
        <div className="grid gap-6 md:grid-cols-3">
          <Card><b>총 사전예약</b><div className="text-3xl font-bold mt-2">{signups}</div></Card>
          <Card><b>교사</b><div className="text-3xl font-bold mt-2">{teachers}</div></Card>
          <Card><b>최근 24시간</b><div className="text-3xl font-bold mt-2">(집계예정)</div></Card>
        </div>
        <SectionTitle title="최근 등록" />
        <div className="grid gap-2">
          {latest.map(r => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">{new Date(r.createdAt).toLocaleString()}</div>
                <div className="text-xs text-slate-500">role: {r.role || "-"} · org: {r.orgName || "-"}</div>
                <code className="text-xs">hash: {r.emailHash.slice(0,8)}…</code>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}
