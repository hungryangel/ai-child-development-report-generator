"use client";
import { useState } from "react";
import { Card } from "@/components/ui";

export function PreorderForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | { refCode?: string; duplicate?: boolean }>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = {
      email: String(f.get("email")),
      role: String(f.get("role")),
      orgName: String(f.get("orgName")),
      studentsCount: Number(f.get("studentsCount")) || undefined,
      interests: Array.from(f.getAll("interests")) as string[],
      consent: f.get("consent") === "on",
    };
    setLoading(true);
    const r = await fetch("/api/preorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = await r.json();
    setLoading(false);
    if (j.ok || j.duplicate) setOk(j);
    else alert("제출 오류: " + (j.error || r.status));
  }

  if (ok) return (
    <Card>
      <div className="space-y-2">
        <div className="text-lg font-semibold">사전등록 완료</div>
        <p className="text-slate-600">오픈 순서대로 얼리 액세스를 안내드립니다.</p>
        {ok.refCode && <div className="rounded-xl bg-mint-100 px-3 py-2 text-emerald-700">내 초대 코드: <b>{ok.refCode}</b></div>}
      </div>
    </Card>
  );

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-brand-200">
      <div className="grid gap-2 md:grid-cols-2">
        <input name="email" required type="email" placeholder="이메일" className="rounded-2xl border p-3" />
        <select name="role" className="rounded-2xl border p-3">
          <option value="">역할 선택</option>
          <option>어린이집 교사</option>
          <option>유치원 교사</option>
          <option>원장/관리자</option>
          <option>학부모</option>
          <option>기타</option>
        </select>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <input name="orgName" placeholder="기관명(선택)" className="rounded-2xl border p-3" />
        <input name="studentsCount" placeholder="반/학급 아동 수(선택)" className="rounded-2xl border p-3" />
      </div>
      <fieldset className="rounded-2xl border p-3">
        <legend className="text-sm text-slate-600">관심 기능</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {["연령별 키워드", "따뜻한 톤 서술", "PDF·인쇄", "기관 템플릿", "대량 생성", "보관/통계"].map((l) => (
            <label key={l} className="flex items-center gap-2 text-sm"><input type="checkbox" name="interests" value={l} /> {l}</label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="consent" required /> (필수) 사전예약 안내 메일 수신 및 개인정보 처리에 동의
      </label>
      <button disabled={loading} className="rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700">
        {loading ? "제출 중…" : "사전예약 등록"}
      </button>
    </form>
  );
}
