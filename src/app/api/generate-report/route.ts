import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { ChildData } from '@/app/lib/types';

// API 키 확인 및 Anthropic 클라이언트 초기화
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.');
    return null;
  }

  return new Anthropic({
    apiKey: apiKey,
  });
};

function getDevelopmentalCriteria(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 +
                     (today.getMonth() - birth.getMonth());

  if (ageInMonths <= 12) {
    return `
[0~1세 발달 기준 - 2024 개정 표준보육과정]
• 신체운동·건강: 다양한 감각 경험, 신체와 주변 탐색, 대소근육 조절, 기본 운동 시도, 도움받아 몸 깨끗이 하기
• 의사소통: 표정·몸짓·말소리에 주의, 상대방 이야기 듣고 말소리 냄, 주변 그림과 상징 관심, 책에 관심
• 사회관계: 나의 고유함 알아가기, 안정적 애착 형성, 또래 관심, 다른 사람 감정·행동 관심
• 예술경험: 자연과 생활의 아름다움 느끼기, 소리·리듬·움직임으로 표현, 모방하기 즐김
• 자연탐구: 주변 환경 호기심, 친숙한 물체 감각 탐색, 일상 수 관심, 동식물 관심, 날씨 변화 느끼기`;
  } else if (ageInMonths <= 24) {
    return `
[2세 발달 기준 - 2024 개정 표준보육과정]
• 신체운동·건강: 신체 인식하고 움직임, 대소근육 조절, 기본 운동 즐기기, 스스로 몸과 주변 깨끗이 하기
• 의사소통: 표정·몸짓·말에 주의하여 듣기, 요구와 느낌 말하기, 끼적이며 표현 즐기기, 책에 관심과 상상
• 사회관계: 나의 고유함과 욕구·감정 표현, 또래와 함께 놀이, 지켜야 할 약속 인식
• 예술경험: 아름다움 느끼기, 익숙한 노래·리듬 표현, 움직임과 춤으로 표현, 상상놀이
• 자연탐구: 사물과 자연 탐색, 수 관심, 공간·모양 탐색, 규칙성 관심, 사물 같고 다름 구분`;
  } else {
    return `
[3~5세 발달 기준 - 2024 개정 표준보육과정 및 누리과정]
• 신체운동·건강: 신체움직임 조절, 이동·제자리·도구운동, 질병예방 실천, 안전 규칙 준수
• 의사소통: 관심있게 듣기, 경험·느낌·생각 표현, 말과 글 관계 이해, 다양한 책과 이야기 즐기기
• 사회관계: 나를 소중히 여기기, 친구와 협력하기, 갈등 해결, 지역사회와 다양한 문화 관심
• 예술경험: 예술적 요소 탐색, 노래·움직임·미술로 창의적 표현, 다양한 예술 감상
• 자연탐구: 지속적 호기심, 물체 특성·수량·공간 탐구, 생명과 자연환경 소중히 여기기`;
  }
}

function createPrompt(data: ChildData): string {
  const developmentalCriteria = getDevelopmentalCriteria(data.birthDate);

  return `당신은 아동발달 전문가입니다. 2024 개정 표준보육과정에 근거하여 전문적이고 따뜻한 아동발달 평가서를 작성해주세요.

${developmentalCriteria}

**작성 지침:**
- 학부모가 이해하기 쉽도록 전문적이면서도 따뜻한 어조로 작성
- 아동의 강점과 발달 특성을 구체적으로 기술
- 각 발달 영역별로 관찰된 행동을 발달적 의미와 함께 해석
- 가정 연계 방안을 구체적이고 실천 가능하게 제시

**아동 정보:**
- 이름: ${data.name}
- 생년월일: ${data.birthDate}
- 반: ${data.className}
- 기질/적응: ${data.temperament}
- 주요 강점: ${data.strength}

**발달 관찰 내용:**
신체운동·건강: 
- 신체활동: ${data.physical.activity}
- 건강생활: ${data.physical.health}  
- 안전생활: ${data.physical.safety}

의사소통:
- 듣기말하기: ${data.communication.listening}
- 읽기쓰기관심: ${data.communication.literacy}
- 책과이야기: ${data.communication.books}

사회관계:
- 자아존중: ${data.social.selfRespect}
- 더불어생활: ${data.social.cooperation}

예술경험:
- 아름다움: ${data.art.aesthetics}
- 창의표현: ${data.art.creativity}

자연탐구:
- 탐구과정: ${data.nature.exploration}
- 생활탐구: ${data.nature.dailyInquiry}
- 자연친화: ${data.nature.withNature}

**부모님께:**
- 강점/재능: ${data.parentMessage.strengths}
- 가정연계: ${data.parentMessage.homeSupport}

위 정보를 바탕으로 마크다운 형식의 전문적인 아동발달 종합평가서를 작성해주세요.`;
}

export async function POST(request: NextRequest) {
  console.log('API Route 시작: POST /api/generate-report');

  try {
    // Anthropic 클라이언트 초기화
    const anthropic = getAnthropicClient();

    if (!anthropic) {
      console.error('Anthropic 클라이언트 초기화 실패');
      return NextResponse.json(
        { error: 'API 설정에 문제가 있습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    // 요청 데이터 파싱
    const data: ChildData = await request.json();
    console.log('수신된 데이터:', { name: data.name, birthDate: data.birthDate });

    // 입력 데이터 검증
    if (!data.name || !data.birthDate || !data.className) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const prompt = createPrompt(data);
    console.log('프롬프트 생성 완료');

    // 스트리밍 응답 생성
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Claude API 호출 시작');

          const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            temperature: 0.7,
            messages: [{
              role: 'user',
              content: prompt
            }],
            stream: true,
          });

          console.log('스트리밍 시작');

          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text') {
              const text = chunk.delta.text;
              const data = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          console.log('스트리밍 완료');

        } catch (error) {
          console.error('Claude API 오류:', error);

          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
          const errorData = JSON.stringify({
            text: `평가서 생성 중 오류가 발생했습니다: ${errorMessage}`
          });

          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('API Route 오류:', error);

    return NextResponse.json(
      {
        error: '평가서 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}