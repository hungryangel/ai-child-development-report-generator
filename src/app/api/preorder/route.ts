import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { encrypt, hash } from "@/lib/crypto";
import { rateLimit } from "@/lib/rateLimit";
import crypto from "node:crypto";
import { sendConfirmEmail } from "@/lib/mailer";


const schema = z.object({
email: z.string().email(), role: z.string().max(40).optional(), orgName: z.string().max(80).optional(),
studentsCount: z.number().int().min(0).max(999).optional(), interests: z.array(z.string()).max(10).default([]), consent: z.boolean()
});


export async function POST(req: NextRequest){
const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
if (!rateLimit(ip).ok) return NextResponse.json({ error:"rate_limited" }, { status:429 });
const body = await req.json();
const p = schema.safeParse(body); if (!p.success) return NextResponse.json({ error:p.error.flatten() }, { status:400 });
if (!p.data.consent) return NextResponse.json({ error: "consent_required" }, { status: 400 });


const emailNorm = p.data.email.trim().toLowerCase();
const emailHash = hash(emailNorm); const emailEnc = encrypt(emailNorm); const ipHash = hash(ip);
const refCode = Math.random().toString(36).slice(2, 8);


await prisma.preorderSignup.upsert({
where: { emailHash },
update: { role: p.data.role, orgName: p.data.orgName, studentsCount: p.data.studentsCount, interests: p.data.interests, userAgent: req.headers.get("user-agent") || undefined },
create: { emailHash, emailEnc, role: p.data.role, orgName: p.data.orgName, studentsCount: p.data.studentsCount, interests: p.data.interests, consentAt: new Date(), ipHash, userAgent: req.headers.get("user-agent") || undefined, refCode }
});


// 더블 옵트인 토큰(24h 유효)
const token = crypto.randomBytes(20).toString("hex");
const tokenHash = hash(token);
await prisma.emailToken.create({ data: { emailHash, tokenHash, expiresAt: new Date(Date.now()+1000*60*60*24) } });


const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const confirmUrl = `${base}/preorder/confirm?token=${encodeURIComponent(token)}`;
await sendConfirmEmail(emailNorm, confirmUrl);


await prisma.trafficEvent.create({ data: { type: "signup", path: "/", ipHash, userAgent: req.headers.get("user-agent") || undefined } });
return NextResponse.json({ ok: true });
}