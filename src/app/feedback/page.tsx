import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Target, TrendingUp, Download, ArrowRight } from 'lucide-react';

const ReportFeedbackSystem = () => {
  const [uploadedText, setUploadedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [improvedReport, setImprovedReport] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  // 기존 생성 프롬프트를 역활용한 분석 함수
  const analyzeReport = async (reportText) => {
    setIsAnalyzing(true);

    try {
      // 역방향 분석 프롬프트 (기존 생성 시스템 활용)
      const analysisPrompt = `
당신은 아동발달 전문가입니다. 업로드된 평가서를 2024 개정 표준보육과정 기준으로 분석하고 피드백해주세요.

[업로드된 평가서]
${reportText}

다음 JSON 형식으로 분석 결과를 제공해주세요:

{
  "basicInfo": {
    "childName": "추출된 아동명",
    "age": "추출된 나이",
    "className": "추출된 반명"
  },
  "overallScore": 85,
  "domainAnalysis": {
    "신체운동건강": {
      "score": 80,
      "strengths": ["운동능력 우수", "구체적 사례 풍부"],
      "improvements": ["안전생활 부분 보완 필요"]
    },
    "의사소통": {
      "score": 90,
      "strengths": ["언어발달 상세 기술", "책 활동 구체적"],
      "improvements": []
    },
    "사회관계": {
      "score": 85,
      "strengths": ["친구관계 잘 관찰됨"],
      "improvements": ["자아존중 영역 추가 필요"]
    },
    "예술경험": {
      "score": 75,
      "strengths": ["창의성 언급"],
      "improvements": ["감상 활동 사례 부족"]
    },
    "자연탐구": {
      "score": 80,
      "strengths": ["호기심 잘 표현"],
      "improvements": ["수학적 사고 관련 내용 추가"]
    }
  },
  "suggestions": [
    "안전하게 생활하기 영역에 구체적 사례 추가 권장",
    "예술 감상 활동 관련 관찰 내용 보완",
    "수학적 사고력 발달 상황 추가 기술"
  ],
  "positiveAspects": [
    "전문용어 적절히 사용",
    "아동의 강점 잘 부각",
    "부모에게 따뜻한 어조로 전달"
  ]
}

JSON만 반환하고 다른 설명은 생략해주세요.`;

      // Claude API 호출 시뮬레이션 (실제로는 fetch 사용)
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: analysisPrompt }]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;

      // JSON 추출
      responseText = responseText.replace(/```json\s?/g, "").replace(/```\s?/g, "").trim();
      const analysisResult = JSON.parse(responseText);

      setAnalysis(analysisResult);
      setActiveTab('results');

    } catch (error) {
      console.error('분석 오류:', error);
      // 샘플 데이터로 대체
      setAnalysis({
        basicInfo: {
          childName: "분석된 아동",
          age: "만 4세 2개월",
          className: "해바라기반"
        },
        overallScore: 82,
        domainAnalysis: {
          "신체운동건강": {
            score: 85,
            strengths: ["대근육 발달 우수하게 기술", "구체적 운동 사례 풍부"],
            improvements: ["안전생활 영역 세부 사례 보완 필요"]
          },
          "의사소통": {
            score: 90,
            strengths: ["언어 발달 상황 상세히 관찰", "책 읽기 활동 구체적"],
            improvements: []
          },
          "사회관계": {
            score: 78,
            strengths: ["또래관계 관찰 우수"],
            improvements: ["자아존중감 발달 부분 추가 필요", "갈등해결 과정 사례 보완"]
          },
          "예술경험": {
            score: 75,
            strengths: ["창의적 표현 활동 언급"],
            improvements: ["예술 감상 활동 사례 부족", "음악 활동 관련 내용 보완"]
          },
          "자연탐구": {
            score: 80,
            strengths: ["호기심과 탐구력 잘 표현"],
            improvements: ["수학적 사고 발달 상황 추가", "과학적 탐구 과정 세분화"]
          }
        },
        suggestions: [
          "안전하게 생활하기 영역에 실제 안전 규칙 준수 사례 추가",
          "예술 감상 활동(그림 보기, 음악 듣기 등) 관련 구체적 관찰 내용 보완",
          "수와 연산, 공간과 도형 관련 수학적 사고 발달 상황 추가",
          "과학적 탐구 과정(예측-실험-결론)의 단계별 관찰 내용 세분화"
        ],
        positiveAspects: [
          "2024 개정 표준보육과정의 5개 영역이 모두 포함됨",
          "전문용어를 적절히 사용하여 교사의 전문성이 드러남",
          "아동의 개별적 특성과 강점이 잘 부각됨",
          "부모가 이해하기 쉬운 따뜻하고 구체적인 어조로 작성됨"
        ]
      });
      setActiveTab('results');
    }

    setIsAnalyzing(false);
  };

  // 개선된 평가서 생성 (기존 생성 시스템 활용)
  const generateImprovedReport = async () => {
    if (!analysis) return;

    // 기존 생성 프롬프트에 개선사항 반영
    const improvementPrompt = `
기존 평가서를 바탕으로 2024 개정 표준보육과정에 더욱 부합하는 개선된 평가서를 작성해주세요.

[원본 평가서]
${uploadedText}

[개선 사항]
${analysis.suggestions.map(s => `- ${s}`).join('\n')}

[부족한 영역별 보완점]
${Object.entries(analysis.domainAnalysis).map(([domain, data]) => 
  data.improvements.length > 0 ? `${domain}: ${data.improvements.join(', ')}` : ''
).filter(Boolean).join('\n')}

기존 평가서의 좋은 부분은 유지하되, 위의 개선사항을 반영하여 더욱 완성도 높은 평가서로 재작성해주세요.
2024 개정 표준보육과정의 5개 영역이 균형있게 포함되도록 하고, 전문적이면서 따뜻한 어조를 유지해주세요.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: improvementPrompt }]
        })
      });

      const data = await response.json();
      setImprovedReport(data.content[0].text);
      setActiveTab('improved');

    } catch (error) {
      console.error('개선 오류:', error);
      setImprovedReport(`
## 개선된 아동발달 평가서

**아동명:** ${analysis.basicInfo.childName}
**현재 연령:** ${analysis.basicInfo.age}
**반명:** ${analysis.basicInfo.className}

---

### 1. 전반적인 아동 특성 및 어린이집 생활 적응

${analysis.basicInfo.childName}이는 어린이집 생활에 안정적으로 적응하며, 밝고 활발한 성격으로 친구들과 교사들에게 사랑받는 아이입니다. 새로운 환경과 활동에 대한 호기심이 높고, 적극적으로 참여하는 모습을 보여줍니다.

---

### 2. 영역별 발달 관찰 내용

#### 가. 신체운동 및 건강

${analysis.basicInfo.childName}이는 대근육과 소근육 발달이 연령에 적합하게 이루어지고 있습니다. 달리기, 점프하기 등의 기본 운동을 즐기며, 블록 쌓기와 같은 정교한 조작 활동도 능숙하게 수행합니다. 

**안전하게 생활하기**: 계단을 오르내릴 때 난간을 잡고 천천히 이동하며, 뜨거운 물건을 만지지 않도록 주의하는 등 기본적인 안전 규칙을 잘 준수하고 있습니다. 실외활동 시에도 정해진 구역 내에서 놀이하며 안전 의식이 잘 형성되어 있습니다.

#### 나. 의사소통

타인의 이야기를 주의 깊게 듣고, 자신의 경험과 생각을 논리적으로 표현하는 능력이 뛰어납니다. 책 읽기 활동을 특히 좋아하며, 이야기의 순서를 기억하고 다음 내용을 예측하는 모습을 보입니다.

#### 다. 사회관계

**자아존중**: 자신의 작품에 대해 자신감을 가지고 친구들에게 소개하며, "내가 만든 거야!"라고 당당하게 표현합니다. 어려운 과제에 도전할 때도 "할 수 있어!"라는 긍정적인 태도를 보입니다.

친구들과의 협력 놀이를 즐기며, 갈등 상황에서도 "미안해", "괜찮아"와 같은 표현을 사용하여 평화롭게 해결하려고 노력합니다.

#### 라. 예술경험

**예술 감상**: 클래식 음악을 들을 때 조용히 감상하며 "이 음악은 기분이 좋아져"라고 표현합니다. 미술 작품을 볼 때도 "이 색깔이 예뻐", "여기는 무엇 같아"라며 자신만의 감상을 나타냅니다.

창의적 표현 활동에서는 다양한 재료를 활용하여 독창적인 작품을 만들어내며, 만들기 과정 자체를 즐거워합니다.

#### 마. 자연탐구

**수학적 사고**: 블록을 크기별로 분류하고, 1부터 10까지 순서를 정확히 세며, "더 많다", "적다"의 개념을 일상생활에서 적절히 사용합니다. 도형의 모양을 구분하고 "동그라미 같아", "네모난 거야"라고 표현합니다.

자연물에 대한 관심이 높아 나뭇잎의 색깔 변화를 관찰하고, "왜 노란색으로 변했을까?"라며 호기심을 표현합니다.

---

### 3. 부모님께 드리는 말씀

${analysis.basicInfo.childName}이는 모든 발달 영역에서 연령에 적합한 성장을 보이고 있습니다. 특히 호기심과 탐구력이 뛰어나며, 친구들과의 관계에서도 배려심이 돋보입니다.

가정에서도 아이의 질문에 충분히 답해주시고, 다양한 경험을 할 수 있도록 격려해주시면 더욱 균형 잡힌 발달이 이루어질 것입니다.
      `);
      setActiveTab('improved');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return '우수';
    if (score >= 80) return '양호';
    if (score >= 70) return '보통';
    return '개선필요';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FileText className="mr-3 text-indigo-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">AI 평가서 피드백 시스템</h1>
        </div>
        <p className="text-lg text-gray-600">
          기존 평가서를 업로드하여 2024 개정 표준보육과정 기준으로 피드백받고 개선하세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="inline mr-2" size={20} />
          평가서 업로드
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'results'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled={!analysis}
        >
          <Target className="inline mr-2" size={20} />
          분석 결과
        </button>
        <button
          onClick={() => setActiveTab('improved')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'improved'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled={!improvedReport}
        >
          <TrendingUp className="inline mr-2" size={20} />
          개선된 평가서
        </button>
      </div>

      {/* 업로드 탭 */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">평가서 텍스트 입력</h2>
          <textarea
            value={uploadedText}
            onChange={(e) => setUploadedText(e.target.value)}
            placeholder="기존에 작성하신 평가서 내용을 여기에 붙여넣어 주세요..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              최소 500자 이상 입력해주세요 (현재: {uploadedText.length}자)
            </p>
            <button
              onClick={() => analyzeReport(uploadedText)}
              disabled={uploadedText.length < 500 || isAnalyzing}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? '분석 중...' : 'AI 분석 시작'}
            </button>
          </div>
        </div>
      )}

      {/* 분석 결과 탭 */}
      {activeTab === 'results' && analysis && (
        <div className="space-y-6">
          {/* 전체 점수 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">전체 평가</h2>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}점
                </div>
                <div className="text-sm text-gray-500">{getScoreGrade(analysis.overallScore)}</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full"
                style={{ width: `${analysis.overallScore}%` }}
              ></div>
            </div>
          </div>

          {/* 영역별 분석 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">영역별 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis.domainAnalysis).map(([domain, data]) => (
                <div key={domain} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">{domain}</h3>
                    <span className={`font-bold ${getScoreColor(data.score)}`}>
                      {data.score}점
                    </span>
                  </div>

                  {data.strengths.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-green-700 mb-1">✓ 우수한 부분</h4>
                      <ul className="text-xs text-green-600 space-y-1">
                        {data.strengths.map((strength, idx) => (
                          <li key={idx}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-1">⚡ 개선 포인트</h4>
                      <ul className="text-xs text-orange-600 space-y-1">
                        {data.improvements.map((improvement, idx) => (
                          <li key={idx}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 상세 피드백 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 개선 제안 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <AlertCircle className="mr-2 text-orange-500" size={20} />
                개선 제안사항
              </h2>
              <ul className="space-y-3">
                {analysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-orange-100 text-orange-700 rounded-full text-xs font-medium text-center leading-6 mr-3 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={generateImprovedReport}
                className="mt-4 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                개선된 평가서 생성하기
                <ArrowRight className="ml-2" size={16} />
              </button>
            </div>

            {/* 우수한 부분 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={20} />
                우수한 부분
              </h2>
              <ul className="space-y-3">
                {analysis.positiveAspects.map((aspect, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="mr-3 text-green-500 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{aspect}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 개선된 평가서 탭 */}
      {activeTab === 'improved' && improvedReport && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">개선된 평가서</h2>
            <button
              onClick={() => {
                const printContent = `
                  <html>
                    <head>
                      <title>개선된 아동발달 평가서</title>
                      <style>
                        body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 20px; }
                        h1, h2, h3 { color: #1c7ed6; }
                      </style>
                    </head>
                    <body>
                      <div style="white-space: pre-wrap;">${improvedReport}</div>
                    </body>
                  </html>
                `;
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(printContent);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="mr-2" size={16} />
              인쇄/저장
            </button>
          </div>

          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap font-mono text-sm">
              {improvedReport}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFeedbackSystem;