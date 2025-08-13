// src/components/UnifiedNavigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Search, Sparkles, TrendingUp } from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: '평가서 생성',
    description: '키워드 입력으로 새로운 평가서 작성',
    icon: Sparkles,
    badge: '생성'
  },
  {
    href: '/feedback',
    label: '평가서 검토',
    description: '기존 평가서 업로드하여 피드백 받기',
    icon: Search,
    badge: '검토'
  },
  {
    href: '/compare',
    label: '평가서 비교',
    description: '여러 평가서 간 비교 분석',
    icon: TrendingUp,
    badge: '비교'
  },
  {
    href: '/templates',
    label: '템플릿 관리',
    description: '평가서 템플릿 저장 및 관리',
    icon: FileText,
    badge: 'NEW'
  }
];

export default function UnifiedNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                AI 평가서 도구
              </span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative group px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-500'} />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${isActive
                          ? 'bg-indigo-200 text-indigo-800'
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* 툴팁 */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {item.description}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 (숨겨진 상태) */}
        <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-500'} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${isActive
                          ? 'bg-indigo-200 text-indigo-800'
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}