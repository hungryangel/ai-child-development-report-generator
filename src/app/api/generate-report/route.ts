import { NextRequest, NextResponse } from 'next/server';
import { ChildData } from '@/app/lib/types';

// 한국어 이름에서 성을 제거하고 이름만 추출하는 함수
function extractFirstName(fullName: string): string {
  // 한국어 이름 패턴 감지 (성씨 + 이름)
  const koreanNamePattern = /^[가-힣]{2,4}$/;

  if (koreanNamePattern.test(fullName) && fullName.length >= 3) {
    // 한국어 이름이고 3자 이상인 경우 첫 글자(성) 제거
    return fullName.substring(1);
  }

  // 그 외의 경우 (영어 이름, 2자 이름 등) 원본 반환
  return fullName;
}

// 2024 개정 표준보육과정 기준 (필수)
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

// 샘플 기반 표준화된 프롬프트 생성
function createStandardizedPrompt(data: ChildData): string {
  const developmentalCriteria = getDevelopmentalCriteria(data.birthDate);
  const firstName = extractFirstName(data.name);


  return `당신은 **아동발달 박사급 전문가**입니다. **2024 개정 표준보육과정에 근거하여** 제공된 **실제 샘플**을 모방하여 동일한 수준의 평가서를 작성해주세요.

## **2024 개정 표준보육과정 발달 기준 (필수 근거)**
${developmentalCriteria}

**중요**: 위의 발달 기준을 반드시 참고하여 각 영역별 평가 시 아동의 발달 수준을 정확히 분석하고 해석해주세요.

## **참고 샘플 (정확히 이 스타일로 작성)**
**실제 샘플**
  ## **아동 발달 평가서**
  
  **아동명:** 김봄봄
  **생년월일:** 2020년 3월 9일
  **현재 연령:** 만 5세 3개월
  **반명:** 이슬반
  
  ---
  
  ### **1\\. 전반적인 아동 특성 및 어린이집 생활 적응**
  
  봄봄이는 어린이집에 처음 등원한 날부터 씩씩하고 활기찬 모습으로 생활에 빠르게 적응했습니다. 낯선 환경에서도 낯가림 없이 친구들과 교사들에게 먼저 다가가는 **친사회적인 모습**을 보여주었으며, 친구들에 대한 관심이 특히 높습니다. 이러한 특성 덕분에 봄봄이는 교실에서 친구들과 함께 즐거운 분위기를 만들어내는 **분위기 메이커** 역할을 톡톡히 하고 있습니다. 밝고 긍정적인 에너지로 주변 사람들에게 좋은 영향을 주는 사랑스러운 아이입니다.
  
  ---
  
  ### **2\\. 영역별 발달 관찰 내용**
  
  #### **가. 신체운동 및 건강**
  
  봄봄이는 **신체 활동을 매우 즐기며 뛰어난 운동 능력**을 보여줍니다. 특히 달리기 속도가 빠를 뿐만 아니라, 안정적으로 속도를 조절하는 능력이 탁월합니다. 소근육 발달 또한 매우 뛰어나 작은 블록을 조립하고 분해하는 데 능숙하여, 친구들이 잘 다루지 못하는 작은 놀이감을 분해해 달라고 봄봄이에게 도움을 요청하는 경우가 종종 있습니다. 이는 봄봄이의 뛰어난 **눈과 손의 협응력**을 보여주는 좋은 예시입니다.
  
  건강하게 생활하는 습관도 잘 형성되어 있습니다. 편식 없이 골고루 식사하며, 배가 부를 때는 "배불러요"와 같이 명확하게 의사를 표현하여 적정량의 식사를 스스로 조절할 줄 압니다. 다만, **호기심이 많아 손으로 만져보고 싶어 하는 성향**이 있어 안전과 관련된 상황에서는 주의가 필요합니다. 안전하게 행동할 수 있도록 "손으로 만지기 전에 세 번 생각해 보자"와 같이 지속적으로 안내하며 지도하고 있습니다.
  
  #### **나. 의사소통**
  
  봄봄이는 **타인의 이야기를 경청하고 적극적으로 의사소통을 시도하는 능력**이 뛰어납니다. 친구들의 이야기에 귀 기울이고, 자신의 생각도 친구들에게 전달하려고 노력합니다. 때때로 자신의 생각을 완벽하게 표현하기 어려워 답답해하거나 속상해하는 모습을 보이기도 하지만, 이는 언어 발달 과정에서 자연스러운 현상입니다.
  
  **읽기와 쓰기에 대한 관심**이 매우 높아 눈에 띄는 발달을 보이고 있습니다. 간단한 한글로 이루어진 동화책은 스스로 읽을 수 있으며, 친구들에게 동화책을 읽어주는 모습도 자주 관찰됩니다. 자신의 이름은 물론 친구들의 이름까지 능숙하게 적을 수 있어, 한글 학습에 대한 흥미와 잠재력이 매우 높습니다. 특히 좋아하는 책은 반복해서 읽으며 즐거움을 느끼는데, 최근에는 ‘수박수영장’이라는 책을 가장 좋아하며 몰입하여 감상하는 모습을 보였습니다.
  
  #### **다. 사회관계**
  
  봄봄이는 **자신을 이해하고 존중하는 능력**이 잘 발달되어 있습니다. 최근 바둑에 흥미를 느끼기 시작하면서 자신이 바둑을 좋아한다고 친구들에게 명확히 표현하고, 함께 바둑을 즐길 수 있는 친구를 찾아 대국을 벌이기도 합니다. 이는 자신의 흥미와 선호도를 인식하고 이를 바탕으로 또래 관계를 형성해나가는 건강한 사회성을 보여줍니다.
  
  **더불어 생활하는 태도** 또한 매우 긍정적입니다. 어린이집의 모든 선생님들(식당 선생님, 관리 선생님, 차량 선생님 등)에게 먼저 다가가 다정하게 인사를 건네는 모습에서 **주변 사람들에 대한 높은 관심과 친밀감**을 엿볼 수 있습니다. 더 나아가, 자신이 살고 있는 동네의 마트나 병원에 다녀온 경험을 놀이로 표현하며 **사회에 대한 관심**을 적극적으로 드러냅니다. 특히 집 앞 마트에서 엄마, 아빠와 장을 본 이야기를 실감 나게 들려주는 모습은 봄봄이가 일상생활 경험을 놀이와 연결하여 탐색하는 능력이 뛰어남을 보여줍니다.
  
  #### **라. 예술경험**
  
  봄봄이는 **아름다움을 찾아보고 표현하는 데 적극적**입니다. 색이 화려하고 눈에 띄는 것을 선호하며, 교실 내 놀이감 중에서도 색감이 강렬한 크레용이나 색연필을 특히 좋아합니다. 자신이 좋아하는 색감의 옷을 친구가 입고 오면 "오늘 옷 예쁘다"라고 칭찬하며 **미적 감각을 표현**하기도 합니다.
  
  **창의적으로 표현하는 능력** 또한 매우 뛰어납니다. 만들기 도구를 제공하면 가장 먼저 활동을 시도할 정도로 적극적인 참여를 보입니다. 최근 물에 갠 황토를 제공했을 때, 친구들이 망설이는 와중에도 가장 먼저 황토를 만지고 손가락으로 그림을 그리며 자유롭게 표현하는 것을 즐겼습니다. 이는 **새로운 재료에 대한 호기심과 거침없는 탐색력**을 보여주는 좋은 사례입니다.
  
  자신의 작품을 스스로 감상하고 "내가 잘했다"며 **자신을 칭찬하는 행동**을 하기도 하며, 교사가 낮잠 및 휴식 시간에 들려주는 클래식 곡들 중 마음에 드는 곡은 "노래가 예쁘다"며 제목을 물어보는 등 **예술을 감상하고 교감하는 모습**도 보입니다.
  
  #### **마. 자연탐구**
  
  봄봄이는 **탐구 과정을 즐기고 적극적으로 참여하는 모습**이 두드러집니다. 뛰어난 관찰력과 높은 활동 참여도를 바탕으로 새롭게 제시되는 모든 활동에 가장 적극적으로 임합니다. 교실에서 사슴벌레를 키우기 시작했을 때도 매일 사슴벌레의 움직임을 즐겁게 관찰하고, 가장 먼저 먹이 주기를 시도하는 등 **자연 현상에 대한 깊은 흥미와 탐구심**을 보여줍니다.
  
  **생활 속에서 탐구하는 능력** 또한 뛰어납니다. 산책 시 횡단보도에서 교통 신호를 유심히 관찰하며 다음 신호를 예측하여 "이제 건너가야 해요"라고 교사에게 이야기하는 등 **주변 환경에 대한 높은 인지력**을 보입니다. 시계에 대한 관심도 높아 간단한 일과 시간을 파악하고 친구들에게 다음 일과를 알려주는 모습은 **시간 개념에 대한 이해**가 점차 발달하고 있음을 보여줍니다.
  
  **자연과 더불어 살아가는 태도** 또한 인상적입니다. 산책을 할 때 한 걸음 가서 멈추고 또 한 걸음 가서 멈추며 산책길에 있는 모든 것을 신기해하고 관찰 대상으로 삼습니다. 공벌레를 발견했을 때는 친구들에게도 함께 관찰하자고 제안하여 아이들이 동그랗게 모여 공벌레의 이동을 함께 관찰하는 등 **자연에 대한 경이로움과 더불어 사는 마음**을 자연스럽게 보여줍니다.
  
  ---
  
  ### **3\\. 부모님께 전달하고 싶은 특별한 내용**
  
  봄봄이는 **뛰어난 사회성과 긍정적인 태도**가 가장 큰 강점인 아이입니다. 친구들에게 긍정적인 피드백을 주려고 노력하며, 밝은 햇살처럼 주변을 기분 좋게 만들어주는 재능을 가지고 있습니다. 언제나 활기차고 긍정적인 모습으로 어린이집 생활에 활력을 불어넣는 소중한 아이입니다.
  
  다만, 친구들과 즐겁게 지내는 과정에서 간혹 **자신의 감정을 표현하는 방법에 서툴러 친구를 살짝 밀치는 모습**이 보일 때가 있습니다. 이는 친구와 더 가깝게 소통하고 싶은 마음이 앞서 나타나는 자연스러운 발달 과정으로 이해하고 있습니다. 저희는 어린이집에서 "행동하기 전에 세 번 생각해 보자"는 약속을 통해 봄봄이가 스스로 자신의 감정을 조절하고 친구를 배려하는 방법을 즐겁게 익힐 수 있도록 돕고 있습니다. 가정에서도 이 부분에 대해 따뜻하게 이야기 나누어 주신다면 봄봄이가 더욱 아름다운 사회성을 키워나가는 데 큰 힘이 될 것입니다. 또한, 호기심이 많아 **흥미로운 것을 보면 적극적으로 탐색하고 싶어 하는 경향**이 있습니다. 이럴 때 안전에 대한 이야기를 함께 나누어 주시어 봄봄이가 세상을 더욱 넓고 안전하게 탐색할 수 있도록 이끌어 주시면 감사하겠습니다.
  
  봄봄이의 건강하고 즐거운 성장을 위해 가정과 어린이집이 함께 노력한다면, 봄봄이가 지닌 밝고 긍정적인 에너지를 더욱 아름답게 꽃피울 수 있을 것이라고 생각합니다.
  
  ---
  
  본 평가서에 대해 궁금하신 점이 있으시면 언제든지 문의해주시기 바랍니다.

**샘플 문체 예시**:
"봄봄이는 신체 활동을 매우 즐기며 뛰어난 운동 능력을 보여줍니다. 특히 달리기 속도가 빠를 뿐만 아니라, 안정적으로 속도를 조절하는 능력이 탁월합니다. 소근육 발달 또한 매우 뛰어나 작은 블록을 조립하고 분해하는 데 능숙하여, 친구들이 잘 다루지 못하는 작은 놀이감을 분해해 달라고 봄봄이에게 도움을 요청하는 경우가 종종 있습니다. 이는 봄봄이의 뛰어난 눈과 손의 협응력을 보여주는 좋은 예시입니다."

**샘플 구조 분석**:
1. 전반적 특성 소개 (100-150자)
2. 각 영역별 3-4개 문단 (400-500자)
3. 부모 메시지 (300-400자)
4. 전체 2000-2500자

## **작성 기준**

### **필수 문장 패턴**
1. **"${firstName}이는 [관찰내용]을/를 [정도] [동사]며 [결과]를 보여줍니다."**
2. **"특히 [구체적사례]하여 [의미해석]합니다."**
3. **"이는 $${firstName}이의 [능력]이 [발달수준]함을 보여주는 [평가]입니다."**

### **연결어 사용 (샘플 수준)**
- 문단 시작: "${firstName}이는", "${firstName}이가"
- 문장 연결: "특히", "더불어", "또한", "이는", "더 나아가"
- 사례 연결: "때문에", "경우가", "상황에서", "과정에서"

### **어조 및 표현 (샘플 수준)**
- **전문적이면서 따뜻한 어조** 유지
- **2024 개정 표준보육과정 기준에 맞는 발달적 해석** 포함
- **구체적 행동 사례** 반드시 포함
- **긍정적 재구성**: 도전 행동도 "발달과정의 자연스러운 현상"으로 해석
- **개별화된 특성** 강조

## **아동 정보**
- **이름**: ${data.name} (문서에서는 "${firstName}" 사용)
- **생년월일**: ${data.birthDate} 
- **소속반**: ${data.className}
- **기질특성**: ${data.temperament}
- **핵심강점**: ${data.strength}

## **발달 관찰 세부 내용**

### **신체운동·건강**
- 신체활동: ${data.physical.activity}
- 건강생활: ${data.physical.health}  
- 안전생활: ${data.physical.safety}

### **의사소통**
- 듣기말하기: ${data.communication.listening}
- 읽기쓰기관심: ${data.communication.literacy}
- 책과이야기: ${data.communication.books}

### **사회관계**
- 자아존중: ${data.social.selfRespect}
- 더불어생활: ${data.social.cooperation}

### **예술경험**
- 아름다움탐색: ${data.art.aesthetics}
- 창의적표현: ${data.art.creativity}

### **자연탐구**
- 탐구과정: ${data.nature.exploration}
- 생활속탐구: ${data.nature.dailyInquiry}
- 자연친화: ${data.nature.withNature}

## **가정 연계 메시지**
- 특별강점: ${data.parentMessage.strengths}
- 가정지도: ${data.parentMessage.homeSupport}

---

## **작성 형식 (정확히 이 구조)**

**아동명**: ${data.name}
**생년월일**: ${data.birthDate}
**현재 연령**: [생년월일로 정확한 만 나이 계산]
**반명**: ${data.className}

### **1. 전반적인 아동 특성 및 어린이집 생활 적응**
[2024 개정 표준보육과정 기준을 바탕으로 샘플과 동일한 형식으로 100-150자 작성]
- 시작: "${firstName}이는 [기질특성]..."
- 마무리: "...사랑스러운 아이입니다." 또는 "...소중한 아이입니다."

### **2. 영역별 발달 관찰 내용**

**가. 신체운동 및 건강**
[2024 개정 표준보육과정의 신체운동·건강 영역 기준에 따라 평가]
[첫 문단] ${firstName}이는 신체 활동을 [정도] 즐기며 [특성]을 보여줍니다. 특히 [구체적 사례]하여 [발달적 의미]합니다.
[둘째 문단] [소근육/대근육] 발달 또한 [평가]하여 [구체적 예시]합니다. 이는 ${firstName}이의 [능력]을 보여주는 [평가]입니다.
[셋째 문단] 건강하게 생활하는 습관도 [평가]합니다. [구체적 사례]하며, [안전 관련 내용]입니다.
[총 400-500자]

**나. 의사소통**
[2024 개정 표준보육과정의 의사소통 영역 기준에 따라 평가]
[첫 문단] ${firstName}이는 타인의 이야기를 [평가]하고 [의사소통 특성]합니다.
[둘째 문단] 읽기와 쓰기에 대한 관심이 [정도] 높아 [구체적 사례]합니다.
[셋째 문단] [책 관련 행동]하며 [발달적 의미]을 보여줍니다.
[총 400-500자]

**다. 사회관계**
[2024 개정 표준보육과정의 사회관계 영역 기준에 따라 평가]
[첫 문단] ${firstName}이는 자신을 [평가]하고 [자아존중 관련 행동]합니다.
[둘째 문단] 더불어 생활하는 태도 또한 [평가]합니다. [구체적 사회적 행동 사례]합니다.
[셋째 문단] 더 나아가, [사회에 대한 관심]하며 [미래 전망]을 보여줍니다.
[총 400-500자]

**라. 예술경험**
[2024 개정 표준보육과정의 예술경험 영역 기준에 따라 평가]
[첫 문단] ${firstName}이는 아름다움을 찾아보고 표현하는 데 [평가]합니다.
[둘째 문단] 창의적으로 표현하는 능력 또한 [평가]합니다. [구체적 창작 활동 사례]합니다.
[셋째 문단] [예술 감상 관련 행동]하는 등 [종합적 평가]을 보입니다.
[총 400-500자]

**마. 자연탐구**
[2024 개정 표준보육과정의 자연탐구 영역 기준에 따라 평가]
[첫 문단] ${firstName}이는 탐구 과정을 즐기고 [참여 태도]하는 모습이 두드러집니다.
[둘째 문단] 생활 속에서 탐구하는 능력 또한 [평가]합니다. [구체적 탐구 사례]합니다.
[셋째 문단] 자연과 더불어 살아가는 태도 또한 [평가]합니다. [자연친화적 행동 사례]합니다.
[총 400-500자]

### **3. 부모님께 전달하고 싶은 특별한 내용**
[첫 문단] ${firstName}이는 [핵심 강점]이 가장 큰 강점인 아이입니다. [구체적 장점 나열]합니다.
[둘째 문단] 다만, [개선점]이 있습니다. [긍정적 해석과 지도 방안]입니다. 가정에서도 [협력 요청 내용]하면 감사하겠습니다.
[마무리] ${firstName}이의 건강하고 즐거운 성장을 위해 가정과 어린이집이 함께 노력한다면, [희망적 전망]을 것이라고 생각합니다.
[총 300-400자]

**최종 마무리**: "본 평가서는 2024 개정 표준보육과정을 기준으로 작성되었습니다."

---

**중요 체크리스트**:
☑️ 2024 개정 표준보육과정 기준을 각 영역별로 반영
☑️ 각 문단마다 구체적 관찰 사례 1개 이상 포함
☑️ "${firstName}이는/이가" 패턴 10회 이상 사용
☑️ "특히, 더불어, 또한, 이는" 등 연결어 자연스럽게 사용
☑️ 50-80자 내외 문장 길이 유지
☑️ 긍정적 어조와 따뜻한 표현 사용
☑️ 전체 2000-2500자 분량 준수
☑️ 제공된 모든 관찰 내용 활용

**절대 준수**: 2024 개정 표준보육과정을 기반으로 하되, 위 샘플의 문체, 어조, 구성을 정확히 모방하여 동일한 품질의 평가서를 작성하세요.`;
}

// 품질 검증 시스템
class ReportQualityValidator {
  static validateStructure(content: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let isValid = true;

    // 필수 섹션 존재 여부 확인
    const requiredSections = [
      '전반적인 아동 특성',
      '신체운동 및 건강',
      '의사소통',
      '사회관계',
      '예술경험',
      '자연탐구',
      '부모님께 전달하고 싶은'
    ];

    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        issues.push(`필수 섹션 '${section}'이 누락되었습니다.`);
        isValid = false;
      }
    });

    // 2024 개정 표준보육과정 언급 확인
    if (!content.includes('2024 개정 표준보육과정')) {
      suggestions.push('2024 개정 표준보육과정 기준 언급을 추가하세요.');
    }

    // 분량 검증
    const totalLength = content.replace(/\s/g, '').length;
    if (totalLength < 2000) {
      issues.push(`전체 분량이 부족합니다. (현재: ${totalLength}자, 최소: 2000자)`);
      isValid = false;
    }

    return { isValid, issues, suggestions };
  }
}

export async function POST(request: NextRequest) {
  console.log('🎯 2024 개정 표준보육과정 기반 평가서 생성 시작');

  try {
    const data: ChildData = await request.json();
    console.log('📝 수신된 데이터:', { name: data.name, birthDate: data.birthDate });

    // 입력 데이터 검증
    if (!data.name || !data.birthDate || !data.className) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const standardizedPrompt = createStandardizedPrompt(data);
    console.log('📋 2024 표준보육과정 기반 프롬프트 생성 완료');

    // 스트리밍 응답 생성
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('🤖 Claude 4 API 호출 시작 (표준보육과정 기반)');

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
              temperature: 0.2,
              stream: true,
              messages: [{
                role: 'user',
                content: standardizedPrompt
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

          console.log('📄 표준보육과정 기반 평가서 스트리밍 시작');

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
                    console.log('✅ 표준보육과정 기반 평가서 생성 완료');

                    // 최종 품질 검증
                    const validation = ReportQualityValidator.validateStructure(generatedContent);
                    if (!validation.isValid) {
                      console.warn('⚠️ 품질 검증 실패:', validation.issues);
                    } else {
                      console.log('✅ 품질 검증 통과');
                    }

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
          console.error('❌ 표준보육과정 기반 평가서 생성 오류:', error);

          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
          const errorData = JSON.stringify({
            text: `⚠️ 평가서 생성 중 오류가 발생했습니다: ${errorMessage}\n\n🔧 해결 방법:\n1. 모든 입력 항목을 충분히 자세히 작성\n2. 브라우저 새로고침 후 재시도\n3. 인터넷 연결 상태 확인\n4. 문제 지속 시 개발자 도구(F12) 콘솔 확인`
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
    console.error('❌ API Route 오류:', error);

    return NextResponse.json(
      {
        error: '평가서 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}