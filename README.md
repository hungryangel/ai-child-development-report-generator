# AI 아동발달 평가서 생성 시스템

2024 개정 표준보육과정을 기반으로 한 AI 아동발달 평가서 자동 생성 애플리케이션입니다.

## 🌟 주요 기능

- **전문적인 평가서 생성**: 아동발달 전문가 수준의 상세한 평가서 작성
- **2024 개정 표준보육과정 기반**: 최신 보육과정 기준에 맞춘 평가 영역
- **사용자 친화적 인터페이스**: 직관적이고 사용하기 쉬운 폼 디자인
- **실시간 스트리밍**: AI가 평가서를 실시간으로 생성하는 과정 확인 가능

## 🚀 실행 방법

### 1. 프로젝트 클론
```bash
git clone https://github.com/[사용자명]/ai-child-development-report-generator.git
cd ai-child-development-report-generator
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# 이 파일은 GitHub에 업로드하지 마세요!
# Claude API는 자동으로 처리되므로 별도 설정이 필요하지 않습니다
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 📋 사용 방법

1. **아동 기본 정보 입력**: 아동명, 생년월일, 반명 등
2. **발달 관찰 내용 작성**: 5개 영역별로 구체적인 행동 사례 입력
   - 신체운동 및 건강
   - 의사소통
   - 사회관계
   - 예술경험
   - 자연탐구
3. **부모님께 드리는 글 작성**: 강점과 가정연계 지도 방안
4. **평가서 생성**: AI가 전문적인 평가서를 자동 생성

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **AI API**: Claude (Anthropic)
- **Deployment**: 브라우저 기반 실행

## 📖 평가 영역

### 0~1세 (5개 영역)
- 신체운동·건강
- 의사소통
- 사회관계
- 예술경험
- 자연탐구

### 2세 (5개 영역)
- 신체운동·건강
- 의사소통  
- 사회관계
- 예술경험
- 자연탐구

### 3~5세 누리과정 (5개 영역)
- 신체운동·건강
- 의사소통
- 사회관계
- 예술경험
- 자연탐구

## 🔧 문제 해결

### 평가서 생성이 안 될 때
1. 모든 필수 입력 항목이 채워져 있는지 확인
2. 브라우저 개발자 도구(F12)에서 콘솔 오류 확인
3. 인터넷 연결 상태 확인

### 개발 환경 오류
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리 후 재시작
npm run build
npm run dev
```

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

문제나 개선 사항이 있으시면 GitHub Issues를 통해 문의해 주세요.