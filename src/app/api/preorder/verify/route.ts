import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "@/lib/crypto";


export async function GET(req: NextRequest){
const token = new URL(req.url).searchParams.get("token") || "";
if (!token) return NextResponse.json({ ok:false, error:"missing_token" }, { status: 400 });
const tokenHash = hash(token);
const row = await prisma.emailToken.findFirst({ where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } } });
if (!row) return NextResponse.json({ ok:false, error:"invalid_or_expired" }, { status: 400 });
await prisma.$transaction([
prisma.emailToken.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
prisma.preorderSignup.update({ where: { emailHash: row.emailHash }, data: { verifiedAt: new Date() } })
]);
return NextResponse.json({ ok:true });
}