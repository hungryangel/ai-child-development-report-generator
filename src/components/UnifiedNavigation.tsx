// src/components/UnifiedNavigation.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import {
//   Group,
//   Text,
//   Box,
//   Tooltip,
//   Burger,
//   Drawer,
//   Stack,
//   Divider,
//   UnstyledButton,
// } from '@mantine/core';                    // Mantine import 주석 처리
// import { useDisclosure } from '@mantine/hooks'; // Mantine hooks 주석 처리
// import {
//   IconFileText,
//   IconForms,
//   IconSearch,
// } from '@tabler/icons-react';              // Tabler icons import 주석 처리

const ROUTES = {
  PREORDER: '/',
  GENERATE: '/generate',
  REVIEW: '/feedback',
} as const;

// 아이콘 대신 간단한 텍스트 사용
const ICON_MAP = {
  IconFileText: '📄',
  IconForms: '✏️',
  IconSearch: '🔍',
};

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: keyof typeof ICON_MAP;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.PREORDER,
    label: '사전등록',
    description: '이메일 인증 후 얼리 액세스',
    icon: 'IconFileText',
  },
  {
    href: ROUTES.GENERATE,
    label: 'AI평가서 작성',
    description: '키워드 → 따뜻한 전문 문장',
    icon: 'IconForms',
  },
  {
    href: ROUTES.REVIEW,
    label: 'AI평가서 검토',
    description: '기존 문서 업로드·피드백',
    icon: 'IconSearch',
  },
];

export default function UnifiedNavigation() {
  const pathname = usePathname();
  const [opened, setOpened] = useState(false);

  const LinkChip = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    const iconEmoji = ICON_MAP[item.icon];

    return (
      <div className="group relative">
        <Link
          href={item.href}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <span className="text-base">{iconEmoji}</span>
          <span>{item.label}</span>
        </Link>

        {/* Tooltip replacement */}
        <div className="invisible group-hover:visible absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
          {item.description}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 메인 네비게이션 바 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* 좌측: 로고 */}
            <Link href={ROUTES.PREORDER} className="flex items-center gap-3 text-decoration-none">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📄</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AI 평가서 도구</span>
            </Link>

            {/* 데스크톱 메뉴 */}
            <div className="hidden sm:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <LinkChip key={item.href} item={item} />
              ))}
            </div>

            {/* 모바일 버거 메뉴 */}
            <button
              className="sm:hidden flex flex-col justify-center items-center w-8 h-8 border-0 bg-transparent cursor-pointer"
              onClick={() => setOpened(!opened)}
              aria-label="메뉴 열기"
            >
              <span className={`block w-5 h-0.5 bg-gray-600 transform transition-all duration-300 ${opened ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all duration-300 ${opened ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transform transition-all duration-300 ${opened ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 드로어 메뉴 */}
      {opened && (
        <div className="fixed inset-0 z-40 sm:hidden">
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setOpened(false)}></div>

          {/* 드로어 */}
          <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">메뉴</h3>
              <button
                onClick={() => setOpened(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const iconEmoji = ICON_MAP[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      block p-3 rounded-xl transition-colors
                      ${isActive ? 'bg-indigo-100' : 'hover:bg-gray-100'}
                    `}
                    onClick={() => setOpened(false)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{iconEmoji}</span>
                      <div>
                        <div className={`font-semibold ${isActive ? 'text-indigo-700' : 'text-gray-900'}`}>
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              <div className="border-t pt-4 mt-6">
                <div className="text-xs text-gray-400">
                  © {new Date().getFullYear()} KidsDev Report
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}