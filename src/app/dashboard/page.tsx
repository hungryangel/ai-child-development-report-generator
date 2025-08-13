// src/app/layout.tsx (수정된 레이아웃)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import UnifiedNavigation from '@/components/UnifiedNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI 아동발달 평가서 시스템',
  description: '2024 개정 표준보육과정 기반 AI 평가서 생성 및 피드백 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <UnifiedNavigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}

// src/app/dashboard/page.tsx (새로운 통합 대시보드)
'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Star,
  ArrowRight
} from 'lucide-react';
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
      href: '/generate',
      icon: FileText,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: '평가서 검토',
      description: '기존 평가서 분석 및 피드백',
      href: '/feedback',
      icon: Search,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: '템플릿 보기',
      description: '저장된 템플릿 관리',
      href: '/templates',
      icon: Star,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generate': return FileText;
      case 'analyze': return Search;
      case 'improve': return TrendingUp;
      default: return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'generate': return 'text-blue-600 bg-blue-100';
      case 'analyze': return 'text-green-600 bg-green-100';
      case 'improve': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          평가서 관리 대시보드
        </h1>
        <p className="text-gray-600">
          2024 개정 표준보육과정 기반 AI 평가서 통합 관리 시스템
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">생성된 평가서</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>이번 달 +12</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">분석 완료</p>
              <p className="text-3xl font-bold text-gray-900">{stats.analysisCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>이번 주 +8</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">평균 점수</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+2.3점 향상</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">개선률</p>
              <p className="text-3xl font-bold text-gray-900">{stats.improvementRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+5.2% 증가</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 빠른 작업 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">빠른 작업</h2>
              <p className="text-sm text-gray-600 mt-1">자주 사용하는 기능들</p>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 ${action.color} ${action.hoverColor} rounded-lg flex items-center justify-center mr-4 transition-colors`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
                  <p className="text-sm text-gray-600 mt-1">최근 작업한 평가서들</p>
                </div>
                <Link
                  href="/history"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  전체 보기
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClass = getActivityColor(activity.type);

                    return (
                      <div key={activity.id} className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center mr-4`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600">{activity.timestamp}</span>
                            {activity.score && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm font-medium text-gray-700">
                                  점수: {activity.score}점
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(activity.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">아직 활동이 없습니다</h3>
                  <p className="text-gray-600 mb-4">새로운 평가서를 생성하거나 기존 평가서를 분석해보세요.</p>
                  <Link
                    href="/generate"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    평가서 생성하기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}