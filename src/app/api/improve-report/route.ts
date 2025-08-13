// src/app/api/improve-report/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ImprovementRequest {
  originalReport: string;
  analysisResult: any;
  improvementLevel: 'basic' | 'detailed' | 'comprehensive';
}

// 기존 생성 함수들 재활용
function extractFirstName(fullName: string): string {
  const koreanNamePattern = /^[가-힣]{2,4}$/;
  if (koreanNamePattern.test(fullName) && fullName.length >= 3) {
    return fullName.substring(1);
  }
  return fullName;
}

function getDevelopmentalCriteria(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 +
                     (today.getMonth() - birth.getMonth());

  if (ageInMonths <= 12) {
    return `
[0~1세 발달 기준 - 2024 개정 표준보육과정]
• 신체운동·건강: 다양한 감각 경험, 신체와 주변 탐색, 대소근육 조절, 기본 운동 시도
• 의사소통: 표정·몸짓·말소리에 주의, 상대방 이야기 듣고 말소리 냄, 주변 그림과 상징 관심
• 사회관계: 나의 고유함 알아가기, 안정적 애착 형성, 또래 관심, 다른 사람 감정·행동 관심
• 예술경험: 자연과 생활의 아름다움 느끼기, 소리·리듬·움직임으로 표현, 모방하기 즐김
• 자연탐구: 주변 환경 호기심, 친숙한 물체 감각 탐색, 일상 수 관심, 동식물 관심`;
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

// 개선 프롬프트 생성 (기존 생성 시스템 + 분석 결과 활용)
function createImprovementPrompt(
  originalReport: string,
  analysisResult: any,
  improvementLevel: string
): string {
  const firstName = extractFirstName(analysisResult.basicInfo.childName);
  const developmentalCriteria = getDevelopmentalCriteria('2020-01-01'); // 임시 날짜, 실제로는 분석에서 추출

  const improvementInstructions = {
    basic: "기존 평가서의 구조를 유지하되, 부족한 부분만 보완",
    detailed: "각 영역별로 세부 항목을 구체화하고 전문성 강화",
    comprehensive: "2024 개정 표준보육과정에 완벽히 부합하는 전문가 수준으로 전면 개선"
  };

  return `당신은 **아동발달 박사급 전문가**입니다. 기존 평가서를 분석 결과에 따라 **2024 개정 표준보육과정에 더욱 부합하는 개선된 평가서**로 재작성해주세요.

## **2024 개정 표준보육과정 발달 기준 (필수 근거)**
${developmentalCriteria}

## **기존 평가서**
${originalReport}

## **분석 결과 기반 개선사항**

### **전체 평가**: ${analysisResult.overallScore}점 → 목표: 90점 이상

### **영역별 개선 포인트**
${Object.entries(analysisResult.domainAnalysis).map(([domain, data]: [string, any]) => `
**${domain}** (현재: ${data.score}점)
✓ 유지할 점: ${data.strengths.join(', ')}
⚡ 개선사항: ${data.improvements.join(', ')}
`).join('')}

### **구체적 개선 제안**
${analysisResult.suggestions.map((suggestion: string, idx: number) => `${idx + 1}. ${suggestion}`).join('\n')}

### **우수한 부분 (유지)**
${analysisResult.positiveAspects.map((aspect: string) => `- ${aspect}`).join('\n')}

## **개선 수준**: ${improvementInstructions[improvementLevel as keyof typeof improvementInstructions]}

## **작성 요구사항**

### **필수 개선사항**
1. **누락 영역 보완**: 분석에서 지적된 부족한 영역에 구체적 사례 추가
2. **전문성 강화**: 2024 개정 표준보육과정 용어 및 관점 적극 활용
3. **구체성 향상**: 모든 평가에 실제 관찰 사례 포함
4. **균형성 확보**: 5개 영역이 모두 균등하게 다뤄지도록 조정

### **문체 및 구조 (기존 샘플 수준 유지)**
- **전문적이면서 따뜻한 어조** 유지
- **"${firstName}이는..."** 패턴 사용
- **구체적 행동 사례** 반드시 포함
- **발달적 의미 해석** 전문가 관점으로 제시

### **예시 개선 패턴**
**개선 전**: "친구들과 잘 놀아요"
**개선 후**: "${firstName}이는 친구들과 함께하는 블록 쌓기 놀이에서 '우리 이렇게 만들어볼까?'라고 제안하며 협력적인 놀이를 주도하는 모습을 보입니다. 이는 ${firstName}이의 사회적 상호작용 능력과 리더십이 연령에 적합하게 발달하고 있음을 보여주는 의미 있는 관찰입니다."

## **최종 결과물 형식**

**아동명**: ${analysisResult.basicInfo.childName}
**생년월일**: [기존 평가서에서 추출 또는 추정]
**현재 연령**: ${analysisResult.basicInfo.age}
**반명**: ${analysisResult.basicInfo.className}

---

### **1. 전반적인 아동 특성 및 어린이집 생활 적응**
[기존 내용을 바탕으로 더욱 구체적이고 전문적으로 개선]

---

### **2. 영역별 발달 관찰 내용**

#### **가. 신체운동 및 건강**
[분석 결과의 개선사항을 반영하여 재작성]
- 신체활동 즐기기: [구체적 사례 추가]
- 건강하게 생활하기: [일상 건강 습관 관찰 추가]
- 안전하게 생활하기: [안전 규칙 준수 사례 추가]

#### **나. 의사소통**
[듣기말하기, 읽기쓰기관심, 책과이야기 영역 균형있게 보완]

#### **다. 사회관계**
[자아존중, 더불어생활, 사회관심 영역별 구체적 사례 추가]

#### **라. 예술경험**
[아름다움탐색, 창의적표현, 예술감상 영역 세분화하여 개선]

#### **마. 자연탐구**
[탐구과정, 생활속탐구, 자연친화 영역에 수학적 사고 등 추가]

---

### **3. 부모님께 드리는 말씀**
[기존 내용을 바탕으로 더욱 구체적이고 실용적인 가정연계 방안 제시]

---

**중요**: 개선된 평가서만 반환하고, 분석 과정이나 추가 설명은 생략해주세요.`;
}

export async function POST(request: NextRequest) {
  console.log('🔧 평가서 개선 API 시작');

  try {
    const { originalReport, analysisResult, improvementLevel = 'detailed' }: ImprovementRequest = await request.json();

    // 입력 검증
    if (!originalReport || !analysisResult) {
      return NextResponse.json(
        { error: '원본 평가서와 분석 결과가 필요합니다.' },
        { status: 400 }
      );
    }

    const improvementPrompt = createImprovementPrompt(originalReport, analysisResult, improvementLevel);
    console.log('📋 개선 프롬프트 생성 완료');

    // 스트리밍 응답 생성 (기존 generate-report와 동일한 방식)
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('🤖 Claude API 호출 시작 (평가서 개선)');

          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY || '',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 8000,
              temperature: 0.2, // 일관성을 위해 낮은 온도
              stream: true,
              messages: [{
                role: 'user',
                content: improvementPrompt
              }]
            }),
          });

          if (!response.ok) {
            throw new Error(`Claude API 오류: ${response.status} ${response.statusText}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('응답 스트림을 읽을 수 없습니다.');
          }

          const decoder = new TextDecoder();
          let buffer = '';
          let generatedContent = '';

          console.log('📄 개선된 평가서 스트리밍 시작');

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6).trim();

                  if (dataStr === '[DONE]') {
                    console.log('✅ 개선된 평가서 생성 완료');
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                    return;
                  }

                  if (dataStr) {
                    try {
                      const streamData = JSON.parse(dataStr);

                      if (streamData.type === 'content_block_delta' &&
                          streamData.delta &&
                          streamData.delta.text) {
                        const text = streamData.delta.text;
                        generatedContent += text;

                        const responseData = JSON.stringify({ text });
                        controller.enqueue(encoder.encode(`data: ${responseData}\n\n`));
                      }
                    } catch (parseError) {
                      console.warn('JSON 파싱 오류:', dataStr.substring(0, 100));
                    }
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          console.error('❌ 평가서 개선 오류:', error);

          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
          const errorData = JSON.stringify({
            text: `⚠️ 평가서 개선 중 오류가 발생했습니다: ${errorMessage}\n\n🔧 해결 방법:\n1. 원본 평가서 내용 확인\n2. 분석 결과 유효성 점검\n3. 브라우저 새로고침 후 재시도`
          });

          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
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
    console.error('❌ 평가서 개선 API 오류:', error);

    return NextResponse.json(
      {
        error: '평가서 개선 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}