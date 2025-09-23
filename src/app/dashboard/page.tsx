// src/app/dashboard/page.tsx (TailwindCSS 스타일)
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalReports: number;
  analysisCount: number;
  averageScore: number;
  improvementRate: number;
}

interface RecentActivity {
  id: string;
  type: 'generate' | 'analyze' | 'improve';
  title: string;
  score?: number;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'failed';
}

export default function Dashboard() {
  const [stats] = useState<DashboardStats>({
    totalReports: 156,
    analysisCount: 89,
    averageScore: 84.2,
    improvementRate: 23.5
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'generate',
      title: '김하늘 - 만 4세 평가서 생성',
      score: 92,
      timestamp: '2시간 전',
      status: 'completed'
    },
    {
      id: '2',
      type: 'analyze',
      title: '이봄이 평가서 분석',
      score: 78,
      timestamp: '3시간 전',
      status: 'completed'
    },
    {
      id: '3',
      type: 'improve',
      title: '박여름 평가서 개선',
      score: 89,
      timestamp: '5시간 전',
      status: 'completed'
    }
  ]);

  const quickActions = [
    {
      title: '새 평가서 생성',
      description: '키워드 입력으로 평가서 작성',
      href: '/',
      icon: '📄',
      color: 'blue'
    },
    {
      title: '평가서 검토',
      description: '기존 평가서 분석 및 피드백',
      href: '/feedback',
      icon: '🔍',
      color: 'green'
    },
    {
      title: '템플릿 보기',
      description: '저장된 템플릿 관리',
      href: '/templates',
      icon: '⭐',
      color: 'violet'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generate': return '📄';
      case 'analyze': return '🔍';
      case 'improve': return '📈';
      default: return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'generate': return 'text-blue-600 bg-blue-50';
      case 'analyze': return 'text-green-600 bg-green-50';
      case 'improve': return 'text-violet-600 bg-violet-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <span className="text-green-600">✓</span>;
      case 'in_progress': return <span className="text-yellow-600">⏳</span>;
      case 'failed': return <span className="text-red-600">⚠️</span>;
      default: return <span className="text-gray-600">•</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">
            평가서 생성 및 분석 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalReports}</span>
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">총 생성 평가서</h3>
            <p className="text-sm text-gray-500">누적 생성된 평가서 수</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.analysisCount}</span>
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">분석 완료</h3>
            <p className="text-sm text-gray-500">평가서 품질 분석 횟수</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}</span>
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">평균 점수</h3>
            <p className="text-sm text-gray-500">평가서 품질 평균 점수</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">+{stats.improvementRate}%</span>
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">품질 개선률</h3>
            <p className="text-sm text-gray-500">AI 개선 후 점수 향상</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 빠른 작업 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">빠른 작업</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="block p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{action.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {action.description}
                        </p>
                      </div>
                      <div className="text-indigo-400 group-hover:text-indigo-600 transition-colors">
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">최근 활동</h2>
                <Link
                  href="/history"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  전체 보기 →
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {activity.timestamp}
                        </span>
                        {activity.score && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-500">점수:</span>
                            <span className={`text-sm font-medium ${
                              activity.score >= 80 ? 'text-green-600' :
                              activity.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {activity.score}점
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                ))}
              </div>

              {recentActivities.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    아직 활동이 없습니다
                  </h3>
                  <p className="text-gray-500 mb-6">
                    첫 번째 평가서를 생성해보세요!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <span>평가서 생성하기</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 진행률 차트 (간단한 버전) */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">이번 달 활동</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                <div className="text-sm text-gray-600">생성된 평가서</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">18</div>
                <div className="text-sm text-gray-600">분석 완료</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">12</div>
                <div className="text-sm text-gray-600">개선 완료</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-violet-600 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}