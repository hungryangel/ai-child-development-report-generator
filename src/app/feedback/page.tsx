// src/app/feedback/page.tsx - 최종 개선된 버전 (모든 기능 포함)
'use client';

import React, { useState, useEffect } from 'react';

// ------ 타입 정의 ------
type DomainDetail = {
  score: number;
  strengths: string[];
  improvements: string[];
};

type AnalysisResult = {
  overallScore: number;
  basicInfo?: { childName?: string; age?: string; className?: string };
  domainAnalysis: Record<string, DomainDetail>;
  positiveAspects: string[];
  suggestions: string[];
};

const ReportFeedbackSystem = () => {
  // 입력값
  const [uploadedText, setUploadedText] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childName, setChildName] = useState('');

  // 분석/개선 공통 상태
  type TabType = 'upload' | 'results' | 'improved';
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [validationError, setValidationError] = useState('');

  // 분석 진행 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // 진행 중 안내 문구(분석)
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  // 개선 생성 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [currentGenerationMessage, setCurrentGenerationMessage] = useState('');
  const [generationMessageIndex, setGenerationMessageIndex] = useState(0);
  const [improvedReport, setImprovedReport] = useState('');

  // 격려 메시지들
  const encouragingMessages = [
    "AI는 글을 작성해줄 수 있지만, 선생님은 사랑을 줄 수 있습니다 💝",
    "선생님의 세심한 관찰이 아이들의 성장을 이끌어냅니다 🌱",
    "오늘도 아이들을 위해 수고하시는 선생님께 감사합니다 🙏",
    "한 아이의 성장 기록은 선생님의 소중한 노력의 결실입니다 📝",
    "아이들의 밝은 미래는 선생님의 따뜻한 마음에서 시작됩니다 ☀️",
    "평가서 하나하나에 담긴 선생님의 애정을 AI가 더욱 빛내드릴게요 ✨",
    "잠시만 기다려주세요. 선생님만큼 꼼꼼하게 분석하고 있어요 🔍"
  ];

  // 개선된 평가서 생성 중 격려 메시지들
  const generationMessages = [
    "선생님의 관찰 내용을 더욱 전문적으로 다듬고 있어요 ✍️",
    "2024 개정 표준보육과정 기준에 맞춰 개선하고 있습니다 📚",
    "구체적인 발달 사례로 풍성하게 만들어드리고 있어요 🌟",
    "선생님의 소중한 관찰을 더욱 체계적으로 정리하고 있습니다 📋",
    "전문적인 교육과정 용어로 업그레이드하고 있어요 🎯",
    "영역별 균형을 맞춰 완성도 높은 평가서로 만들어드립니다 ⚖️",
    "선생님의 교육철학이 담긴 따뜻한 평가서를 완성하고 있어요 💖"
  ];

  // 연령 옵션
  const ageOptions = [
    { value: '', label: '연령을 선택하세요' },
    { value: '0', label: '만 0세 (0~11개월)' },
    { value: '1', label: '만 1세 (12~23개월)' },
    { value: '2', label: '만 2세 (24~35개월)' },
    { value: '3', label: '만 3세 (36~47개월)' },
    { value: '4', label: '만 4세 (48~59개월)' },
    { value: '5', label: '만 5세 (60~71개월)' },
    { value: '6', label: '만 6세 (72개월 이상)' }
  ];

  // 메시지 순환 효과
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % encouragingMessages.length);
      }, 3000); // 3초마다 메시지 변경
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, encouragingMessages.length]);

  // 개선된 평가서 생성 중 메시지 순환 효과
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationMessageIndex((prev) => (prev + 1) % generationMessages.length);
      }, 3000); // 3초마다 메시지 변경
      return () => clearInterval(interval);
    }
  }, [isGenerating, generationMessages.length]);

  // 현재 메시지 업데이트
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentMessage(encouragingMessages[messageIndex]);
    }
  }, [messageIndex, isAnalyzing, encouragingMessages]);

  // 현재 생성 메시지 업데이트
  useEffect(() => {
    if (isGenerating) {
      setCurrentGenerationMessage(generationMessages[generationMessageIndex]);
    }
  }, [generationMessageIndex, isGenerating, generationMessages]);

  // 입력 유효성 검사
  const validateInputs = () => {
    if (!uploadedText.trim()) {
      setValidationError('평가서 내용을 입력해주세요.');
      return false;
    }
    if (uploadedText.length < 100) {
      setValidationError('분석을 위해 평가서 내용을 최소 100자 이상 입력해주세요.');
      return false;
    }
    if (!childAge) {
      setValidationError('아동의 연령을 선택해주세요. 정확한 분석을 위해 필수입니다.');
      return false;
    }
    if (!childName.trim()) {
      setValidationError('아동명을 입력해주세요.');
      return false;
    }
    setValidationError('');
    return true;
  };

  // 분석 로직 (개선된 버전)
  const analyzeReport = async () => {
    if (!validateInputs()) {
      return;
    }

    // 중복 실행 방지
    if (isAnalyzing || isAnalysisComplete) {
      return;
    }

    setIsAnalyzing(true);
    setIsAnalysisComplete(false);
    setAnalysisStartTime(Date.now());
    setMessageIndex(0);
    setCurrentMessage(encouragingMessages[0]);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportText: `[아동명: ${childName}] [나이: 만 ${childAge}세] ${uploadedText}`,
          analysisType: 'full'
        }),
      });

      if (!response.ok) {
        throw new Error(`분석 요청 실패: ${response.status}`);
      }

      const analysisData: AnalysisResult = await response.json();
      setAnalysis(analysisData);
      setIsAnalysisComplete(true);
      setActiveTab('results');

    } catch (error) {
      console.error('분석 오류:', error);
      setValidationError(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');
      setIsAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 개선된 평가서 생성
  const generateImprovement = async () => {
    if (!analysis) return;

    setIsGenerating(true);
    setIsGenerationComplete(false);
    setGenerationMessageIndex(0);
    setCurrentGenerationMessage(generationMessages[0]);
    setImprovedReport('');
    setActiveTab('improved');

    try {
      const response = await fetch('/api/improve-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: uploadedText,
          childName: childName,
          childAge: childAge,
          analysisResult: analysis
        }),
      });

      if (!response.ok) {
        throw new Error(`개선된 평가서 생성 실패: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setImprovedReport(prev => prev + data.content);
                }
                if (data.error) {
                  console.error('스트림 오류:', data.error);
                  break;
                }
              } catch (e) {
                console.error('JSON 파싱 오류:', e);
              }
            }
          }
        }
      }

      setIsGenerationComplete(true);
    } catch (error) {
      console.error('개선 생성 오류:', error);
      setValidationError(error instanceof Error ? error.message : '개선된 평가서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isAnalyzing) return '분석 중...';
    if (isAnalysisComplete) return '평가서 분석 완료';
    return '평가서 분석 시작';
  };

  // 버튼 색상 결정
  const getButtonColor = () => {
    if (isAnalysisComplete) return 'bg-green-600 hover:bg-green-700';
    if (isAnalyzing) return 'bg-blue-600 cursor-not-allowed';
    return 'bg-indigo-600 hover:bg-indigo-700';
  };

  // 예상 소요 시간 계산
  const getEstimatedTime = () => {
    const wordCount = uploadedText.length;
    if (wordCount < 500) return '약 30초';
    if (wordCount < 1000) return '약 1분';
    if (wordCount < 2000) return '약 1-2분';
    return '약 2-3분';
  };

  // 개선된 평가서 생성 버튼 텍스트 결정
  const getGenerationButtonText = () => {
    if (isGenerating) return '개선된 평가서 생성 중...';
    if (isGenerationComplete) return '개선된 평가서 생성 완료';
    return '개선된 평가서 생성하기';
  };

  // 개선된 평가서 생성 버튼 색상 결정
  const getGenerationButtonColor = () => {
    if (isGenerationComplete) return 'bg-green-600 hover:bg-green-700';
    if (isGenerating) return 'bg-blue-600 cursor-not-allowed';
    return 'bg-indigo-600 hover:bg-indigo-700';
  };

  // 예상 생성 시간 계산
  const getEstimatedGenerationTime = () => {
    const wordCount = uploadedText.length;
    if (wordCount < 500) return '약 1분';
    if (wordCount < 1000) return '약 1-2분';
    if (wordCount < 2000) return '약 2-3분';
    return '약 3-5분';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 평가서 검토</h1>
          <p className="text-gray-600">
            기존 평가서를 업로드하여 전문적인 피드백과 개선된 버전을 받아보세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>📤</span>
              <span>평가서 업로드</span>
            </button>
            <button
              onClick={() => isAnalysisComplete && setActiveTab('results')}
              disabled={!isAnalysisComplete}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'results'
                  ? 'bg-indigo-100 text-indigo-700'
                  : isAnalysisComplete
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <span>📊</span>
              <span>분석 결과</span>
            </button>
            <button
              onClick={() => isGenerationComplete && setActiveTab('improved')}
              disabled={!isGenerationComplete}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'improved'
                  ? 'bg-indigo-100 text-indigo-700'
                  : isGenerationComplete
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <span>✨</span>
              <span>개선 버전</span>
            </button>
          </div>
        </div>

        {/* 업로드 탭 */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span className="text-red-700 font-medium">입력 오류</span>
                  </div>
                  <p className="text-red-600 mt-1">{validationError}</p>
                </div>
              )}

              {/* 기본 정보 입력 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span>👤</span>
                      <span>아동명 *</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    placeholder="분석할 평가서의 아동명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span>📅</span>
                      <span>연령 *</span>
                    </span>
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  >
                    {ageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 평가서 내용 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span>📝</span>
                    <span>평가서 내용 *</span>
                  </span>
                </label>
                <textarea
                  value={uploadedText}
                  onChange={(e) => setUploadedText(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="분석하고 싶은 평가서 내용을 복사하여 붙여넣거나 직접 입력하세요.
더 정확한 분석을 위해 다음 내용이 포함되면 좋습니다:
• 아동의 기본 정보 (이름, 나이, 반)
• 각 발달 영역별 관찰 내용
• 구체적인 행동 사례
• 부모님께 전달하고 싶은 내용"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500">
                      분석을 위해 최소 100자 이상 입력해주세요
                    </p>
                    {uploadedText.length >= 100 && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <span>✓</span>
                        <span>분석 가능</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {uploadedText.length}자
                  </p>
                </div>
              </div>

              {/* 분석 안내 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">💡</span>
                  <div>
                    <h3 className="text-blue-800 font-medium mb-2">AI 평가서 분석 안내</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• 2024 개정 표준보육과정 기준으로 평가서를 분석합니다</li>
                      <li>• 영역별 발달 서술의 적절성과 완성도를 검토합니다</li>
                      <li>• 구체적인 개선 방향과 전문적인 표현 방법을 제안합니다</li>
                      <li>• 예상 소요 시간: {getEstimatedTime()}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 분석 버튼 */}
              <div className="flex justify-center">
                <button
                  onClick={analyzeReport}
                  disabled={isAnalyzing || isAnalysisComplete}
                  className={`
                    px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200
                    ${getButtonColor()}
                    flex items-center gap-3 min-w-[200px] justify-center
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>분석 중...</span>
                    </>
                  ) : isAnalysisComplete ? (
                    <>
                      <span>✓</span>
                      <span>분석 완료</span>
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      <span>평가서 분석 시작</span>
                    </>
                  )}
                </button>
              </div>

              {isAnalysisComplete && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-green-700 font-medium">분석이 완료되었습니다!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    분석 결과 탭에서 상세한 피드백을 확인하세요.
                    다른 평가서를 분석하려면 페이지를 새로고침하세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 분석 결과 탭 */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {isAnalyzing && !isAnalysisComplete && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">평가서를 꼼꼼히 분석하고 있어요</h3>
                <p className="text-gray-600 mb-4">예상 소요 시간: {getEstimatedTime()}</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-green-600">✨</span>
                    <span className="text-green-600">📝</span>
                  </div>
                  <p className="text-green-700 font-medium text-center" style={{ minHeight: '24px' }}>
                    {currentMessage}
                  </p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            )}

            {isAnalysisComplete && analysis && (
              <div className="space-y-6">
                {/* 전체 점수 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-6">📊 종합 평가 점수</h3>
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.overallScore / 100)}`}
                          className={`transition-all duration-1000 ${
                            analysis.overallScore >= 80 ? 'text-green-500' :
                            analysis.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                          }`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${
                          analysis.overallScore >= 80 ? 'text-green-600' :
                          analysis.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {analysis.overallScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg">
                      {analysis.overallScore >= 80 ? '우수한 평가서입니다! 👍' :
                       analysis.overallScore >= 60 ? '양호한 평가서입니다 😊' :
                       '개선이 필요한 평가서입니다 💪'}
                    </p>
                  </div>
                </div>

                {/* 잘된 점과 개선 제안 */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 우수한 점 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
                      <span>✅</span>
                      <span>우수한 점</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      이미 잘 작성된 부분들입니다. 이런 점들은 다른 평가서에서도 활용해보세요.
                    </p>
                    <ul className="space-y-3">
                      {analysis.positiveAspects.map((aspect, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                          <span className="text-gray-700">{aspect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 개선 제안 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
                      <span>📝</span>
                      <span>개선 제안</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      더욱 전문적이고 완성도 높은 평가서 작성을 위한 구체적인 제안사항입니다.
                    </p>
                    <ul className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 활용 안내 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-blue-800 font-medium mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>평가서 개선 활용 방법</span>
                  </h3>
                  <div className="text-blue-700 text-sm space-y-2">
                    <p>1. <strong>개선 제안</strong>을 참고하여 부족한 영역을 보완해보세요</p>
                    <p>2. <strong>우수한 점</strong>은 다른 평가서 작성 시에도 계속 활용하세요</p>
                    <p>3. 아래 "개선된 평가서 생성하기" 버튼으로 AI가 제안하는 개선 버전을 확인할 수 있습니다</p>
                    <p>4. 생성된 개선 버전을 참고하여 본인만의 스타일로 재작성해보세요</p>
                  </div>
                </div>

                {/* 개선된 평가서 생성 버튼 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  {isGenerating && (
                    <div className="mb-6 text-center">
                      <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            개선된 평가서를 생성하고 있어요
                          </h3>
                          <p className="text-sm text-gray-500">
                            예상 소요 시간: {getEstimatedGenerationTime()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-green-600">✨</span>
                          <span className="text-green-600">📝</span>
                        </div>
                        <p className="text-green-700 font-medium text-center" style={{ minHeight: '24px' }}>
                          {currentGenerationMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={generateImprovement}
                      disabled={isGenerating || isGenerationComplete}
                      className={`
                        px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200
                        ${getGenerationButtonColor()}
                        flex items-center gap-3 min-w-[250px] justify-center mx-auto
                      `}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>개선 중...</span>
                        </>
                      ) : isGenerationComplete ? (
                        <>
                          <span>✓</span>
                          <span>개선 완료</span>
                        </>
                      ) : (
                        <>
                          <span>📈</span>
                          <span>개선된 평가서 생성하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 개선 버전 탭 */}
        {activeTab === 'improved' && (
          <div className="space-y-6">
            {isGenerating && !isGenerationComplete && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">개선된 평가서를 생성하고 있어요</h3>
                <p className="text-gray-600 mb-4">예상 소요 시간: {getEstimatedGenerationTime()}</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-green-600">✨</span>
                    <span className="text-green-600">📝</span>
                  </div>
                  <p className="text-green-700 font-medium text-center" style={{ minHeight: '24px' }}>
                    {currentGenerationMessage}
                  </p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
            )}

            {isGenerationComplete && improvedReport && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span>✨</span>
                    <span>개선된 평가서</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(improvedReport)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <span>📋</span>
                      <span>복사</span>
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <span>📄</span>
                      <span>다운로드</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                      {improvedReport}
                    </pre>
                  </div>
                </div>

                {/* 개선 후 안내 */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>개선된 평가서 활용 팁</span>
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• 생성된 내용을 그대로 사용하지 마시고, 실제 관찰한 내용에 맞게 수정해주세요</li>
                    <li>• 아동의 개별 특성과 실제 발달 상황을 반영하여 개인화해주세요</li>
                    <li>• 전문적인 표현 방법과 구조를 참고하여 다른 평가서 작성에도 활용해보세요</li>
                    <li>• 궁금한 부분이 있다면 교육과정 전문가나 원장선생님께 문의해보세요</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFeedbackSystem;