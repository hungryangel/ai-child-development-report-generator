import { Card } from "@/components/ui";
export function TrustTiles(){
    const tiles = [
        { t: "표준 반영", d: "2024 개정 표준의 항목 구조 참고/반영" },
        { t: "문장 품질", d: "교사 톤, 부모 친화 서술" },
        { t: "안전/투명", d: "개인정보 최소 수집·암호화 저장" },
    ];
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {tiles.map(x => (
                <Card key={x.t}><div className="font-semibold">{x.t}</div><div className="text-sm text-slate-600">{x.d}</div></Card>
            ))}
        </div>
    );
}