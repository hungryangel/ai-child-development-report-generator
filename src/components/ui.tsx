import { ReactNode } from "react";
export function Container({ children, className = "" }: { children: ReactNode; className?: string }){
return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}
export function Card({ children, className = "" }: { children: ReactNode; className?: string }){
return <div className={`rounded-3xl bg-white/80 shadow-soft ring-1 ring-white/60 backdrop-blur p-6 ${className}`}>{children}</div>;
}
export const Badge = ({ children }: { children: ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-mint-100 px-3 py-1 text-sm text-emerald-700">{children}</span>
);
export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }){
    return (
        <div className="mb-6 space-y-2">
          {eyebrow && <div className="text-sm text-slate-500">{eyebrow}</div>}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-600">{subtitle}</p>}
    </div>
   );
}