import { Card } from "@/components/ui";
export function TeamSection(){
    const people = [
        { name: "Rami", role: "기획/PM", bio: "현장 관찰을 글로 바꾸는 일을 줄이고, 교사의 시간을 돌려드립니다.", img: "/team/rami.jpg" },
    { name: "Leonard", role: "개발", bio: "따뜻한 문장 자동화와 표준 반영을 안정적으로 구현합니다.", img: "/team/leonard.jpg" },
    ];
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {people.map(p => (
                <Card key={p.name}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-brand-200 overflow-hidden"><img src={p.img} alt="" className="h-full w-full object-cover"/></div>
                        <div><div className="font-semibold">{p.name}</div><div className="text-sm text-slate-500">{p.role}</div></div>
                    </div>
                    <p className="mt-3 text-slate-600 text-sm">{p.bio}</p>
                </Card>
            ))}
            <Card>
                <b>왜 이 서비스를 만들었나요?</b>
                <p className="mt-2 text-slate-600 text-sm">아이를 돌보는 시간, 교사의 전문성이 빛나야 할 시간입니다. 문서 작업은 덜어내고, 관찰과 관계에 더 집중할 수 있도록 도구를 만듭니다.</p>
            </Card>
        </div>
    );
}