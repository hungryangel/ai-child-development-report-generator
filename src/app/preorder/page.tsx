"use client";
import { Container, Card, Badge, SectionTitle } from "@/components/ui";
import { PreorderForm } from "@/components/forms/PreorderForm";

export default function PreorderLanding() {
  const FREE_UNTIL = process.env.NEXT_PUBLIC_FREE_UNTIL ?? "2025년 10월 초";
  const LAUNCH = process.env.NEXT_PUBLIC_LAUNCH_WINDOW ?? "2025년 10월 말";

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100 to-brand-50" />
        <Container className="relative py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge>사전등록 오픈</Badge>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight">
                교사의 관찰 키워드 → <span className="text-brand-700">따뜻한 전문 문장</span>으로 자동 완성
              </h1>
              <p className="mt-4 text-lg text-slate-700">
                2024 개정 표준을 참고/반영한 항목 구조, 가정 전달용 어조 최적화, 인쇄/다운로드까지 원클릭.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {FREE_UNTIL}까지 무료 체험 · {LAUNCH} 정식 출시 예정
              </p>
              <div className="mt-6 grid gap-3">
                <PreorderForm />
              </div>
            </div>
            <Card className="md:ml-auto">
              <div className="space-y-3">
                <div className="font-semibold">표준 참고 — 2024 개정 표준 항목 구조 참조</div>
                <div className="font-semibold">문장 품질 — 교사 톤, 부모 친화 서술</div>
                <div className="font-semibold">안전/투명 — 개인정보 최소 수집·암호화 저장</div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-12">
        <Container>
          <SectionTitle eyebrow="진행 방식" title="사전등록 → 이메일 안내 → 순차 제공" />
          <ol className="grid gap-4 md:grid-cols-3">
            <li><Card><b>1.</b> 이메일·역할 입력, 동의 체크 → 대기열 등록</Card></li>
            <li><Card><b>2.</b> 초대 메일 수신 → 체험판 접속/안내</Card></li>
            <li><Card><b>3.</b> 피드백 반영 → 베타 기능 우선 제공</Card></li>
          </ol>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <Container>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} KidsDev Report</p>
            <a className="text-sm text-slate-500 underline" href="#">개인정보 처리방침(사전예약)</a>
          </div>
        </Container>
      </footer>
    </main>
  );
}
