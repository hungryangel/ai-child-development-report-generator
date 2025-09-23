// path: src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface PreorderData {
  email: string;
  phone?: string;
  desiredPlan: string;
  currentRole: string;
  agreeMarketing: boolean;
}

export default function LandingPage() {
  const [preorderData, setPreorderData] = useState<PreorderData>({
    email: '',
    phone: '',
    desiredPlan: '프리미엄',
    currentRole: '보육교사',
    agreeMarketing: false
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [usageWarning, setUsageWarning] = useState('');

  const handlePreorderSubmit = async () => {
    if (!preorderData.email) {
      setUsageWarning('이메일을 입력해주세요.');
      return;
    }

    if (!preorderData.agreeMarketing) {
      setUsageWarning('베타 테스트 안내 수신에 동의해주세요.');
      return;
    }

    setUsageWarning('');
    setSubmitLoading(true);

    try {
      // API 호출 (실제 API 엔드포인트로 연결)
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preorderData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setPreorderData({
          email: '',
          phone: '',
          desiredPlan: '프리미엄',
          currentRole: '보육교사',
          agreeMarketing: false
        });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setUsageWarning('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      setUsageWarning('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5.0)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .gradient-hero {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .notification {
          transform: translateX(${showSuccess ? '0' : '100%'});
          transition: transform 0.3s ease;
        }
      `}</style>

      {/* 성공 알림 */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 min-w-80 bg-green-500 text-white p-4 rounded-lg card-shadow notification">
          <div className="font-semibold">사전등록 완료!</div>
          <div className="text-sm">베타 테스트 초대장을 이메일로 발송해드렸습니다!</div>
        </div>
      )}

      {/* Hero Section - 이미지 1 스타일 적용 */}
      <div className="gradient-hero min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          {/* 베타 런칭 배지 */}
          <div className="inline-block bg-white bg-opacity-20 px-6 py-3 rounded-full text-lg font-medium mb-8 backdrop-blur-sm">
            🚀 베타 런칭 • 얼리액세스 진행중
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            AI가 만드는<br />
            전문 아동발달 평가서
          </h1>

          {/* 서브 타이틀 */}
          <div className="text-xl md:text-2xl mb-4 opacity-90">
            2024 개정 표준보육과정 기반으로
          </div>
          <div className="text-xl md:text-2xl mb-12 opacity-90">
            키워드만 입력하면 <strong>30초</strong> 안에 전문가급 평가서가 완성됩니다
          </div>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
              onClick={() => document.getElementById('preorder')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🚀 무료 베타 신청하기
            </button>
            <button
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white border-opacity-30"
              onClick={() => window.open('/generate', '_blank')}
            >
              📁 데모 보기
            </button>
          </div>
        </div>
      </div>

      {/* 우리의 사명과 철학 섹션 - 이미지 2, 3 스타일 */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* 개발자 소개 배지 */}
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              개발자 소개
            </span>
            <h2 className="text-4xl font-bold mb-6">우리의 사명과 철학</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              보육교사의 전문성이 빛날 수 있도록, 문서 작업은 덜어내고 아이들과의 관계에 집중할 수 있게 돕습니다
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 좌측: 프로젝트 사명 카드 */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                💝
              </div>
              <h3 className="text-2xl font-bold mb-4">프로젝트 사명</h3>
              <div className="text-lg mb-6 font-medium">
                "아이를 돌보는 시간, 교사의 전문성이 빛나야 할 시간"
              </div>
              <p className="text-blue-100 leading-relaxed">
                문서 작업에 쓰던 소중한 시간을 아이들 관찰과 상호작용에 온전히 집중할 수 있도록 돕겠습니다.
              </p>
            </div>

            {/* 우측: 핵심 가치들 */}
            <div className="space-y-6">
              {/* 교사 전문성 존중 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-green-700">✓ 교사 전문성 존중</h4>
                  <p className="text-gray-600">보육교사의 관찰력과 전문성을 AI가 지원</p>
                </div>
              </div>

              {/* 아이 중심 철학 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-green-700">✓ 아이 중심 철학</h4>
                  <p className="text-gray-600">아이와의 상호작용 시간을 최우선으로 보장</p>
                </div>
              </div>

              {/* 2024 표준보육과정 준수 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-green-700">✓ 2024 표준보육과정 준수</h4>
                  <p className="text-gray-600">최신 교육과정 기준에 완벽히 부합</p>
                </div>
              </div>
            </div>
          </div>

          {/* 개발자 이야기 */}
          <div className="mt-16">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">👨‍💻</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4">개발자 이야기</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    현장에서 근무하는 보육교사들의 현실적인 고민을 해결하고자 시작된 프로젝트입니다.
                  </p>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-800 font-medium">
                      "평가서 작성에 3시간씩 걸리는 시간을 <span className="text-blue-600 font-bold">30초로 단축</span>하여,
                      선생님들이 정말 중요한 일 - 아이들과의 소통과 관찰에 전념할 수 있게 돕겠습니다."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 기능 섹션 */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">🚀 혁신적인 AI 기능들</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">스마트 AI 분석</h4>
            <p className="text-gray-600">
              아이의 관찰 키워드를 전문적인 발달평가 문장으로 자동 변환합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">시간 90% 단축</h4>
            <p className="text-gray-600">
              3시간 걸리던 평가서 작성을 30초 만에. 아이들과 더 많은 시간을 보내세요.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📜</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">표준과정 준수</h4>
            <p className="text-gray-600">
              2024 개정 표준보육·누리과정을 100% 반영한 전문적인 평가서를 생성합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💝</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">따뜻한 톤앤매너</h4>
            <p className="text-gray-600">
              차가운 AI가 아닌, 따뜻하고 전문적인 교사의 시선으로 평가서를 작성합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 우리의 약속 섹션 - 이미지 4 스타일 적용 */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">성공적인 사업을 위한 우리의 약속</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 사용자 중심 설계 */}
            <div className="bg-white p-8 rounded-xl card-shadow text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">사용자 중심 설계</h4>
              <p className="text-gray-600 text-sm">
                현장 보육교사의 실제 니즈를 반영한 직관적인 인터페이스
              </p>
            </div>

            {/* 압도적 효율성 */}
            <div className="bg-white p-8 rounded-xl card-shadow text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">⚡</div>
              </div>
              <h4 className="text-xl font-semibold mb-3">압도적 효율성</h4>
              <p className="text-gray-600 text-sm">
                시간 90% 단축을 통한 업무 혁신과 생산성 향상
              </p>
            </div>

            {/* 전문성과 신뢰 */}
            <div className="bg-white p-8 rounded-xl card-shadow text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-12 bg-gradient-to-b from-red-400 to-red-600 rounded-lg relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">전문성과 신뢰</h4>
              <p className="text-gray-600 text-sm">
                표준보육과정 준수와 데이터 보안을 통한 안전한 서비스
              </p>
            </div>

            {/* 지속적 소통 */}
            <div className="bg-white p-8 rounded-xl card-shadow text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">💭</div>
              </div>
              <h4 className="text-xl font-semibold mb-3">지속적 소통</h4>
              <p className="text-gray-600 text-sm">
                사용자 피드백을 바탕으로 한 지속적인 서비스 개선
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 사용 후기 섹션 */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">⭐ 베타 테스터들의 생생한 후기</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                김
              </div>
              <div className="ml-3">
                <div className="font-medium">김○○ 교사</div>
                <div className="text-sm text-gray-500">○○어린이집 · 경력 5년</div>
              </div>
            </div>
            <StarRating rating={5} />
            <blockquote className="mt-4 text-gray-600 italic border-l-4 border-gray-200 pl-4">
              "정말 놀라워요! 아이 관찰일지 작성이 이렇게 쉬울 줄 몰랐어요.
              이제 서류 작업 스트레스 없이 아이들과 더 많은 시간을 보낼 수 있어요."
            </blockquote>
          </div>

          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                박
              </div>
              <div className="ml-3">
                <div className="font-medium">박○○ 원장</div>
                <div className="text-sm text-gray-500">△△유치원 · 경력 12년</div>
              </div>
            </div>
            <StarRating rating={5} />
            <blockquote className="mt-4 text-gray-600 italic border-l-4 border-gray-200 pl-4">
              "선생님들이 평가서 작성 때문에 야근하는 일이 확실히 줄었어요.
              품질도 전보다 훨씬 일정하고 전문적으로 나오네요."
            </blockquote>
          </div>

          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                이
              </div>
              <div className="ml-3">
                <div className="font-medium">이○○ 교사</div>
                <div className="text-sm text-gray-500">□□어린이집 · 경력 3년</div>
              </div>
            </div>
            <StarRating rating={5} />
            <blockquote className="mt-4 text-gray-600 italic border-l-4 border-gray-200 pl-4">
              "초보 교사인 제가 쓴 평가서도 경력 많은 선생님 수준으로 나와요.
              학부모님들도 평가서 퀄리티에 대해 더 만족해하세요."
            </blockquote>
          </div>
        </div>
      </div>

      {/* 사전등록 섹션 */}
      <div className="gradient-hero py-20" id="preorder">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-lg mb-4">
              🎁 무료 베타 테스트 신청
            </span>
          </div>

          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            지금 신청하면 런칭 후에도 50% 할인 혜택!
          </h2>
          <p className="text-xl text-center mb-10 text-blue-100">
            베타 테스트에 참여하고 런칭 전 모든 기능을 무료로 체험해보세요.
          </p>

          <div className="bg-white p-8 rounded-xl card-shadow">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일 주소</label>
                <input
                  type="email"
                  placeholder="example@childcare.co.kr"
                  value={preorderData.email}
                  onChange={(e) => setPreorderData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처 (선택)</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={preorderData.phone}
                  onChange={(e) => setPreorderData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">희망 플랜</label>
                  <select
                    value={preorderData.desiredPlan}
                    onChange={(e) => setPreorderData(prev => ({ ...prev, desiredPlan: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="베이직">베이직 (월 9,900원)</option>
                    <option value="프리미엄">프리미엄 (월 19,900원)</option>
                    <option value="프로">프로 (월 29,900원)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">현재 역할</label>
                  <select
                    value={preorderData.currentRole}
                    onChange={(e) => setPreorderData(prev => ({ ...prev, currentRole: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="보육교사">보육교사</option>
                    <option value="유치원교사">유치원교사</option>
                    <option value="원장">원장/관리자</option>
                    <option value="학부모">학부모</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={preorderData.agreeMarketing}
                  onChange={(e) => setPreorderData(prev => ({ ...prev, agreeMarketing: e.target.checked }))}
                  className="mt-1 mr-3"
                />
                <label className="text-sm text-gray-700">
                  베타 테스트 안내 및 서비스 출시 알림 수신에 동의합니다
                </label>
              </div>

              {usageWarning && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {usageWarning}
                </div>
              )}

              <button
                onClick={handlePreorderSubmit}
                disabled={submitLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50"
              >
                {submitLoading ? '신청 처리중...' : '🎁 무료 베타 신청하기'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                신청 완료 시 베타 테스트 초대장과 특별 혜택 안내를 이메일로 보내드립니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 향후 계획 섹션 */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">🗺️ 서비스 로드맵</h2>

        <div className="space-y-8">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-white text-sm">1</span>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">1단계: 베타 테스트</h4>
              <p className="text-gray-600">평가서 생성 및 검토 기능 무료 제공 (2024년 12월)</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-white text-sm">2</span>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">2단계: 정식 출시</h4>
              <p className="text-gray-600">관찰일지, 보육일지 기능 추가 및 유료 서비스 시작 (2025년 2월)</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-white text-sm">3</span>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">3단계: 고급 기능</h4>
              <p className="text-gray-600">맞춤 템플릿 100종, 대시보드, 학부모 소통 기능 (2025년 5월)</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-white text-sm">4</span>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">4단계: AI 고도화</h4>
              <p className="text-gray-600">개별 아동 맞춤형 발달 분석 및 추천 시스템 (2025년 하반기)</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">❓ 자주 묻는 질문</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl card-shadow">
              <h4 className="text-xl font-semibold text-blue-600 mb-3">Q. 2024 개정 표준보육과정을 정확히 반영하나요?</h4>
              <p className="text-gray-600">
                네, 2024년 개정된 최신 표준보육과정과 누리과정 기준에 완벽히 맞춰 개발되었습니다.
                연령별(0-1세, 2세, 3-5세) 발달영역과 세부 내용을 모두 반영합니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl card-shadow">
              <h4 className="text-xl font-semibold text-blue-600 mb-3">Q. 개인정보는 안전한가요?</h4>
              <p className="text-gray-600">
                아동 및 기관의 개인정보는 암호화되어 안전하게 보호됩니다.
                개인정보보호법을 준수하며, 데이터는 평가서 생성 목적으로만 사용됩니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl card-shadow">
              <h4 className="text-xl font-semibold text-blue-600 mb-3">Q. 베타 테스트 기간은 언제까지인가요?</h4>
              <p className="text-gray-600">
                베타 테스트는 2-3개월간 진행되며, 정식 출시 후에도 베타 테스터 혜택은 계속 유지됩니다.
                테스트 참여자에게는 별도 안내를 드립니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl card-shadow">
              <h4 className="text-xl font-semibold text-blue-600 mb-3">Q. 모바일에서도 사용 가능한가요?</h4>
              <p className="text-gray-600">
                네, 모바일과 태블릿에서도 완벽하게 작동합니다.
                언제 어디서나 편리하게 평가서를 작성하고 관리할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 소통하기 섹션 - 이미지 5 스타일 */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">개발자와 직접 소통하세요</h3>
          <p className="text-lg text-gray-600 mb-12">
            프로젝트에 대한 궁금한 점이나 개선 제안사항이 있으시면 언제든 연락 주세요
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500">이메일 문의</div>
                <a href="mailto:support@aichildcare.co.kr" className="text-lg font-medium text-blue-600 hover:text-blue-700">
                  support@aichildcare.co.kr
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500">카카오톡 상담</div>
                <div className="text-lg font-medium text-gray-800">
                  카카오톡 플러스친구
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📄</span>
                <span className="text-xl font-semibold">AI 아동발달 평가서</span>
              </div>
              <p className="text-gray-400">
                보육교사의 업무를 혁신하는 AI 솔루션
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 mb-1">
                문의사항이 있으시면 언제든 연락주세요
              </p>
              <a href="mailto:support@aichildcare.co.kr" className="text-white hover:text-blue-400">
                support@aichildcare.co.kr
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 AI 아동발달 평가서. All rights reserved. •
              <a href="#" className="text-gray-400 hover:text-white"> 개인정보처리방침</a> •
              <a href="#" className="text-gray-400 hover:text-white"> 이용약관</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}