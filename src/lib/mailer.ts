export async function sendConfirmEmail(to: string, confirmUrl: string){
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // dev: no-op
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
        from: "KidsDev <no-reply@kidsdev.example>",
        to: [to],
        subject: "사전등록 완료 — 이메일 확인 부탁드립니다",
        html: `<p>사전등록을 완료해 주셔서 감사합니다.</p>
               <p>아래 버튼을 눌러 이메일을 확인해 주세요. 확인 후 카카오 단톡방 링크와 사전예약 혜택 안내를 보실 수 있습니다.</p>
               <p><a href="${confirmUrl}" style="background:#55A9F3;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none">이메일 확인하기</a></p>
               <hr/><p style='font-size:12px;color:#666'>확인 링크는 24시간 유효합니다.</p>`
    })
 });
}