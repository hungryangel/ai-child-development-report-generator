'use client';

import { useState, useRef } from 'react';
import { ChildData } from '../lib/types';
import { calculateAge, formatAgeText } from '../lib/utils';

export default function GeneratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState('');
  const [calculatedAge, setCalculatedAge] = useState('');
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [streamError, setStreamError] = useState('');
  const [childAgeInYears, setChildAgeInYears] = useState<number>(0);
  const reportRef = useRef<HTMLDivElement>(null);

  // 폼 상태 관리 (Mantine useForm 대신 일반 useState 사용)
  const [formData, setFormData] = useState<ChildData>({
    name: '',
    birthDate: '',
    className: '',
    temperament: '',
    strength: '',
    physical: { activity: '', health: '', safety: '' },
    communication: { listening: '', literacy: '', books: '' },
    social: { selfRespect: '', cooperation: '', societyInterest: '' },
    art: { aesthetics: '', creativity: '', appreciation: '' },
    nature: { exploration: '', dailyInquiry: '', withNature: '' },
    parentMessage: { strengths: '', homeSupport: '' }
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 폼 검증 함수
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (formData.name.length < 2) {
      errors.name = '아동명을 2자 이상 입력해주세요';
    }
    if (!formData.birthDate) {
      errors.birthDate = '생년월일을 선택해주세요';
    }
    if (formData.className.length < 1) {
      errors.className = '반명을 입력해주세요';
    }
    if (formData.temperament.length < 10) {
      errors.temperament = '기질과 적응도를 10자 이상 상세히 입력해주세요';
    }
    if (formData.strength.length < 10) {
      errors.strength = '강점을 10자 이상 상세히 입력해주세요';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 입력값 업데이트 함수
  const updateField = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ChildData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // 에러 클리어
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 연령 계산 및 동적 필드 업데이트
  const handleBirthDateChange = (input: string | Date | null) => {
  let dateString = '';

  if (input instanceof Date) {
    dateString = input.toISOString().split('T')[0];
  } else if (typeof input === 'string') {
    dateString = input;
  }

  if (dateString) {
    updateField('birthDate', dateString);

    const ageData = calculateAge(dateString);
    const ageText = formatAgeText(ageData);
    setCalculatedAge(ageText);
    setChildAgeInYears(ageData.years);

    // 3세 이상일 때만 추가 필드 초기화
    if (ageData.years >= 3) {
      updateField('social.societyInterest', '');
      updateField('art.appreciation', '');
    }
  } else {
    updateField('birthDate', '');
    setCalculatedAge('');
    setChildAgeInYears(0);
  }
};

  // 평가서 생성 함수
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setStreamError('');
    setReport('');
    setIsReportGenerated(false);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('평가서 생성에 실패했습니다.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';

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
                  setReport(prev => prev + data.content);
                }
                if (data.error) {
                  setStreamError(data.error);
                  break;
                }
              } catch (e) {
                console.error('JSON 파싱 오류:', e);
              }
            }
          }
        }
      }

      setIsReportGenerated(true);
      // 알림 대신 간단한 메시지
      console.log('평가서 생성이 완료되었습니다!');

    } catch (error) {
      setStreamError('평가서 생성 중 오류가 발생했습니다.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 평가서 생성</h1>
          <p className="text-gray-600">
            키워드를 입력하면 전문적이고 따뜻한 문장으로 평가서를 생성해드립니다
          </p>
        </div>

        {streamError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-red-700 font-medium">오류 발생</span>
            </div>
            <p className="text-red-600 mt-1">{streamError}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-semibold">기본 정보</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아동명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors`}
                  placeholder="아동의 이름을 입력하세요"
                />
                {formErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일 *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.birthDate ? 'border-red-300' : 'border-gray-300'
                  } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors`}
                />
                {formErrors.birthDate && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.birthDate}</p>
                )}
                {calculatedAge && (
                  <p className="text-indigo-600 text-sm mt-1">나이: {calculatedAge}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  반명 *
                </label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => updateField('className', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.className ? 'border-red-300' : 'border-gray-300'
                  } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors`}
                  placeholder="예: 봄반, 5세반"
                />
                {formErrors.className && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.className}</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기질과 적응도 *
                </label>
                <textarea
                  value={formData.temperament}
                  onChange={(e) => updateField('temperament', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.temperament ? 'border-red-300' : 'border-gray-300'
                  } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none`}
                  placeholder="아이의 기질과 어린이집 적응도를 구체적으로 기록하세요"
                />
                {formErrors.temperament && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.temperament}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주요 강점 *
                </label>
                <textarea
                  value={formData.strength}
                  onChange={(e) => updateField('strength', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.strength ? 'border-red-300' : 'border-gray-300'
                  } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none`}
                  placeholder="아이가 특별히 잘하는 것이나 두드러지는 장점을 기록하세요"
                />
                {formErrors.strength && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.strength}</p>
                )}
              </div>
            </div>
          </div>

          {/* 신체운동·건강 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏃‍♂️</span>
              <h2 className="text-xl font-semibold">신체운동·건강</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신체 활동 즐기기
                </label>
                <textarea
                  value={formData.physical.activity}
                  onChange={(e) => updateField('physical.activity', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="대근육, 소근육 발달 상황과 신체 움직임 특성을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건강하게 생활하기
                </label>
                <textarea
                  value={formData.physical.health}
                  onChange={(e) => updateField('physical.health', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="식사, 배변, 수면 등 건강한 생활습관 형성 정도를 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  안전하게 생활하기
                </label>
                <textarea
                  value={formData.physical.safety}
                  onChange={(e) => updateField('physical.safety', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="안전 규칙 인식과 위험 상황 대처 능력을 기록하세요"
                />
              </div>
            </div>
          </div>

          {/* 의사소통 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💬</span>
              <h2 className="text-xl font-semibold">의사소통</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  듣기와 말하기
                </label>
                <textarea
                  value={formData.communication.listening}
                  onChange={(e) => updateField('communication.listening', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="언어 이해력, 표현력, 대화 능력 등을 구체적으로 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  읽기와 쓰기에 관심 가지기
                </label>
                <textarea
                  value={formData.communication.literacy}
                  onChange={(e) => updateField('communication.literacy', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="문자에 대한 관심, 쓰기 시도, 책 읽기 관심 등을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  책과 이야기 즐기기
                </label>
                <textarea
                  value={formData.communication.books}
                  onChange={(e) => updateField('communication.books', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="동화책 선호도, 이야기 듣기 태도, 상상력 표현 등을 기록하세요"
                />
              </div>
            </div>
          </div>

          {/* 사회관계 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👥</span>
              <h2 className="text-xl font-semibold">사회관계</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나를 알고 존중하기
                </label>
                <textarea
                  value={formData.social.selfRespect}
                  onChange={(e) => updateField('social.selfRespect', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="자아 인식, 자기 감정 표현, 자신감 등을 구체적으로 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  더불어 생활하기
                </label>
                <textarea
                  value={formData.social.cooperation}
                  onChange={(e) => updateField('social.cooperation', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="친구들과 함께 놀이하고 협력하는 모습을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사회에 관심 갖기
                </label>
                <textarea
                  value={formData.social.societyInterest}
                  onChange={(e) => updateField('social.societyInterest', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="우리 동네나 사회에 관심을 갖는 모습을 기록하세요"
                />
              </div>
            </div>
          </div>

          {/* 예술경험 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🎨</span>
              <h2 className="text-xl font-semibold">예술경험</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아름다움 찾아보기
                </label>
                <textarea
                  value={formData.art.aesthetics}
                  onChange={(e) => updateField('art.aesthetics', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="자연과 생활 속에서 아름다움을 느끼고 즐기는 모습을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  창의적으로 표현하기
                </label>
                <textarea
                  value={formData.art.creativity}
                  onChange={(e) => updateField('art.creativity', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="음악, 미술, 몸짓 등 다양한 방법으로 표현하는 모습을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예술 감상하기
                </label>
                <textarea
                  value={formData.art.appreciation}
                  onChange={(e) => updateField('art.appreciation', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="음악, 미술작품, 공연 등을 감상하고 느낌을 표현하는 모습을 기록하세요"
                />
              </div>
            </div>
          </div>

          {/* 자연탐구 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🔬</span>
              <h2 className="text-xl font-semibold">자연탐구</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  탐구과정 즐기기
                </label>
                <textarea
                  value={formData.nature.exploration}
                  onChange={(e) => updateField('nature.exploration', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="호기심을 갖고 탐구하며 문제를 해결하려는 모습을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생활 속에서 탐구하기
                </label>
                <textarea
                  value={formData.nature.dailyInquiry}
                  onChange={(e) => updateField('nature.dailyInquiry', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="수학적, 과학적 개념에 대한 관심과 탐구하는 모습을 기록하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자연과 더불어 살기
                </label>
                <textarea
                  value={formData.nature.withNature}
                  onChange={(e) => updateField('nature.withNature', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="동식물과 자연환경에 관심을 갖고 소중히 여기는 모습을 기록하세요"
                />
              </div>
            </div>
          </div>

          {/* 부모님께 드리는 글 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💝</span>
              <h2 className="text-xl font-semibold">부모님께 드리는 글</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  특별히 강조하고 싶은 아이의 강점이나 재능
                </label>
                <textarea
                  value={formData.parentMessage.strengths}
                  onChange={(e) => updateField('parentMessage.strengths', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="예: 또래에 비해 언어 발달이 빠른 편이며, 자신의 생각을 명확하게 표현할 수 있습니다."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가정에서 연계하여 지도하면 좋을 만한 부분
                </label>
                <textarea
                  value={formData.parentMessage.homeSupport}
                  onChange={(e) => updateField('parentMessage.homeSupport', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                  placeholder="예: 친구와 갈등이 생겼을 때 말로 표현하는 방법을 격려해주시면 사회성 발달에 도움이 됩니다."
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg'
                }
                flex items-center gap-3 min-w-[200px] justify-center
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>평가서 생성하기</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 생성된 평가서 */}
        {isReportGenerated && report && (
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">생성된 평가서</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <span>📄</span>
                  <span>PDF 다운로드</span>
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <span>🖨️</span>
                  <span>인쇄</span>
                </button>
              </div>
            </div>

            <div
              ref={reportRef}
              className="prose max-w-none bg-gray-50 p-6 rounded-lg border border-gray-200"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {report}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}