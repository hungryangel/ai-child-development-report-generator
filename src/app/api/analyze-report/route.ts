// src/app/api/analyze-report/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface AnalysisRequest {
  reportText: string;
  analysisType: 'full' | 'quick';
}

interface DomainAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
}

interface AnalysisResponse {
  basicInfo: {
    childName: string;
    age: string;
    className: string;
  };
  overallScore: number;
  domainAnalysis: {
    [domain: string]: DomainAnalysis;
  };
  suggestions: string[];
  positiveAspects: string[];
}

// 기존 생성 시스템의 발달 기준을 재활용
function getDevelopmentalCriteria(estimatedAge: string): string {
  // 기존 createStandardizedPrompt에서 추출한 함수 재사용
  if (estimatedAge.includes('0세') || estimatedAge.includes('1세')) {
    return `
[0~1세 발달 기준 - 2024 개정 표준보육과정]
• 신체운동·건강: 다양한 감각 경험, 신체와 주변 탐색, 대소근육 조절
• 의사소통: 표정·몸짓·말소리에 주의, 상대방 이야기 듣고 말소리 냄
• 사회관계: 나의 고유함 알아가기, 안정적 애착 형성, 또래 관심
• 예술경험: 자연과 생활의 아름다움 느끼기, 소리·리듬·움직임으로 표현
• 자연탐구: 주변 환경 호기심, 친숙한 물체 감각 탐색, 일상 수 관심`;
  } else if (estimatedAge.includes('2세')) {
    return `
[2세 발달 기준 - 2024 개정 표준보육과정]
• 신체운동·건강: 신체 인식하고 움직임, 대소근육 조절, 기본 운동 즐기기
• 의사소통: 표정·몸짓·말에 주의하여 듣기, 요구와 느낌 말하기
• 사회관계: 나의 고유함과 욕구·감정 표현, 또래와 함께 놀이
• 예술경험: 아름다움 느끼기, 익숙한 노래·리듬 표현, 움직임과 춤으로 표현
• 자연탐구: 사물과 자연 탐색, 수 관심, 공간·모양 탐색, 규칙성 관심`;
  } else {
    return `
[3~5세 발달 기준 - 2024 개정 표준보육과정 및 누리과정]
• 신체운동·건강: 신체움직임 조절, 이동·제자리·도구운동, 질병예방 실천
• 의사소통: 관심있게 듣기, 경험·느낌·생각 표현, 말과 글 관계 이해
• 사회관계: 나를 소중히 여기기, 친구와 협력하기, 갈등 해결
• 예술경험: 예술적 요소 탐색, 노래·움직임·미술로 창의적 표현
• 자연탐구: 지속적 호기심, 물체 특성·수량·공간 탐구, 생명과 자연환경 소중히 여기기`;
  }
}

// 역방향 분석 프롬프트 생성 (기존 생성 로직 활용)
function createAnalysisPrompt(reportText: string): string {
  // 나이 추정을 위한 간단한 패턴 매칭
  const ageMatch = reportText.match(/만\s*(\d+)세|(\d+)세/);
  const estimatedAge = ageMatch ? `${ageMatch[1] || ageMatch[2]}세` : '3-5세';

  const developmentalCriteria = getDevelopmentalCriteria(estimatedAge);

  return `당신은 **아동발달 박사급 전문가**입니다. 업로드된 평가서를 **2024 개정 표준보육과정에 근거하여** 분석하고 평가해주세요.

## **2024 개정 표준보육과정 발달 기준 (분석 근거)**
${developmentalCriteria}

## **분석 대상 평가서**
${reportText}

## **분석 요구사항**
위의 발달 기준을 바탕으로 다음 JSON 형식으로 분석 결과를 제공해주세요:

{
  "basicInfo": {
    "childName": "평가서에서 추출된 아동명 (없으면 '분석된 아동')",
    "age": "평가서에서 추출된 나이 (예: '만 4세 2개월')",
    "className": "평가서에서 추출된 반명 (없으면 '확인 필요')"
  },
  "overallScore": 85,
  "domainAnalysis": {
    "신체운동건강": {
      "score": 80,
      "strengths": ["구체적 운동 사례 제시", "대근육 발달 우수하게 기술"],
      "improvements": ["안전생활 영역 세부 사례 보완 필요"]
    },
    "의사소통": {
      "score": 90,
      "strengths": ["언어 발달 상황 상세히 관찰", "책 읽기 활동 구체적"],
      "improvements": ["듣기 능력 관련 사례 추가"]
    },
    "사회관계": {
      "score": 85,
      "strengths": ["또래관계 관찰 우수"],
      "improvements": ["자아존중감 발달 부분 추가 필요"]
    },
    "예술경험": {
      "score": 75,
      "strengths": ["창의적 표현 활동 언급"],
      "improvements": ["예술 감상 활동 사례 부족"]
    },
    "자연탐구": {
      "score": 80,
      "strengths": ["호기심과 탐구력 잘 표현"],
      "improvements": ["수학적 사고 발달 상황 추가"]
    }
  },
  "suggestions": [
    "안전하게 생활하기 영역에 실제 안전 규칙 준수 사례 추가",
    "예술 감상 활동 관련 구체적 관찰 내용 보완",
    "수학적 사고력 발달 상황을 구체적 사례와 함께 추가"
  ],
  "positiveAspects": [
    "2024 개정 표준보육과정의 5개 영역이 모두 포함됨",
    "전문용어를 적절히 사용하여 교사의 전문성이 드러남",
    "아동의 개별적 특성과 강점이 잘 부각됨",
    "부모가 이해하기 쉬운 따뜻하고 구체적인 어조로 작성됨"
  ]
}

**중요**: JSON 형식만 반환하고 다른 설명은 생략해주세요.`;
}

export async function POST(request: NextRequest) {
  console.log('🔍 평가서 분석 API 시작');

  try {
    const { reportText, analysisType }: AnalysisRequest = await request.json();

    // 입력 검증
    if (!reportText || reportText.length < 100) {
      return NextResponse.json(
        { error: '분석할 평가서 내용이 너무 짧습니다. 최소 100자 이상 입력해주세요.' },
        { status: 400 }
      );
    }

    const analysisPrompt = createAnalysisPrompt(reportText);
    console.log('📋 분석 프롬프트 생성 완료');

    console.log('🤖 Claude API 호출 시작 (평가서 분석)');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        temperature: 0.1, // 분석의 일관성을 위해 낮은 온도
        messages: [{
          role: 'user',
          content: analysisPrompt
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let analysisResult = data.content[0].text;

    console.log('📄 원본 응답:', analysisResult.substring(0, 200) + '...');

    // JSON 추출 및 파싱
    try {
      // 마크다운 코드 블록 제거
      analysisResult = analysisResult.replace(/```json\s?/g, "").replace(/```\s?/g, "").trim();

      // JSON 파싱
      const parsedAnalysis: AnalysisResponse = JSON.parse(analysisResult);

      console.log('✅ 평가서 분석 완료');
      console.log('📊 전체 점수:', parsedAnalysis.overallScore);

      return NextResponse.json(parsedAnalysis);

    } catch (parseError) {
      console.error('❌ JSON 파싱 오류:', parseError);
      console.log('파싱 실패한 텍스트:', analysisResult);

      // 파싱 실패 시 기본 응답 제공
      const fallbackAnalysis: AnalysisResponse = {
        basicInfo: {
          childName: '분석된 아동',
          age: '만 4세',
          className: '확인 필요'
        },
        overallScore: 75,
        domainAnalysis: {
          "신체운동건강": {
            score: 75,
            strengths: ["기본적인 운동 발달 관찰"],
            improvements: ["구체적 사례 보완 필요"]
          },
          "의사소통": {
            score: 80,
            strengths: ["언어 표현 관찰"],
            improvements: ["세부 영역별 구체화 필요"]
          },
          "사회관계": {
            score: 75,
            strengths: ["사회적 상호작용 관찰"],
            improvements: ["자아존중 영역 추가 필요"]
          },
          "예술경험": {
            score: 70,
            strengths: ["창의성 관련 언급"],
            improvements: ["예술 감상 활동 추가 필요"]
          },
          "자연탐구": {
            score: 75,
            strengths: ["호기심 표현"],
            improvements: ["탐구 과정 세분화 필요"]
          }
        },
        suggestions: [
          "각 영역별로 더 구체적인 행동 사례 추가",
          "2024 개정 표준보육과정의 세부 영역 고려",
          "전문적 용어 사용을 통한 신뢰도 향상",
          "부모가 이해하기 쉬운 구체적 표현 사용"
        ],
        positiveAspects: [
          "아동 발달에 대한 관심과 관찰이 드러남",
          "기본적인 발달 영역들이 언급됨",
          "아동에 대한 애정과 관심이 느껴짐"
        ]
      };

      return NextResponse.json(fallbackAnalysis);
    }

  } catch (error) {
    console.error('❌ 평가서 분석 API 오류:', error);

    return NextResponse.json(
      {
        error: '평가서 분석 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}