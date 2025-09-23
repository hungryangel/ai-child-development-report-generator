export async function GET(){
const url = process.env.NEXT_PUBLIC_KAKAO_OPENCHAT_URL || ""; // 운영자가 .env로 직접 교체
return new Response(JSON.stringify({ url }), { headers: { "Content-Type": "application/json" } });
}
