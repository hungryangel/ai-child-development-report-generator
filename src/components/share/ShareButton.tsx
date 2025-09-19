"use client";
import { useState } from "react";
export function ShareButton(){
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const title = "아동발달 평가 자동화 — 사전예약";
    async function share(){
        try { if (navigator.share) { await navigator.share({ title, url }); return; } } catch {}
        try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false), 2000); } catch {}
    }
    return (
        <button onClick={share} className="rounded-2xl bg-mint-300 px-4 py-3 font-semibold text-emerald-900 hover:bg-mint-500/70">
            {copied? "링크 복사됨" : "공유하기"}
        </button>
    );
}