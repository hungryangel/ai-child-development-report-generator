import crypto from "node:crypto";
const keyB64 = process.env.ENCRYPTION_KEY!;
const key = Buffer.from(keyB64, "base64");
export const hash = (v: string) => crypto.createHash("sha256").update(v).digest("hex");
export function encrypt(plain: string){
const iv = crypto.randomBytes(12);
const c = crypto.createCipheriv("aes-256-gcm", key, iv);
const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
const tag = c.getAuthTag();
return Buffer.concat([iv, tag, enc]).toString("base64");
}