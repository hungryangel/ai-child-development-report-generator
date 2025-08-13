// src/components/UnifiedNavigation.tsx (Mantine 버전)
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Group, Text, Box, Badge, Tooltip } from '@mantine/core';
import { IconFileText, IconSearch, IconSparkles, IconTrendingUp } from '@tabler/icons-react';

interface NavigationItem {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: '평가서 생성',
    description: '키워드 입력으로 새로운 평가서 작성',
    icon: IconSparkles,
    badge: '생성'
  },
  {
    href: '/feedback',
    label: '평가서 검토',
    description: '기존 평가서 업로드하여 피드백 받기',
    icon: IconSearch,
    badge: '검토'
  },
  {
    href: '/dashboard',
    label: '대시보드',
    description: '통합 관리 및 통계',
    icon: IconTrendingUp,
    badge: '관리'
  }
];

export default function UnifiedNavigation() {
  const pathname = usePathname();

  return (
    <Box
      style={{
        borderBottom: '1px solid #e9ecef',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Box
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <Group justify="space-between" h={60}>
          {/* 로고 */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Group gap="sm">
              <Box
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'var(--mantine-color-indigo-6)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconFileText size={18} color="white" />
              </Box>
              <Text size="xl" fw={700} c="dark">
                AI 평가서 도구
              </Text>
            </Group>
          </Link>

          {/* 네비게이션 메뉴 */}
          <Group gap="xs" visibleFrom="sm">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Tooltip key={item.href} label={item.description} position="bottom">
                  <Link href={item.href} style={{ textDecoration: 'none' }}>
                    <Box
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? 'var(--mantine-color-indigo-1)' : 'transparent',
                        color: isActive ? 'var(--mantine-color-indigo-7)' : 'var(--mantine-color-gray-6)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        ':hover': {
                          backgroundColor: isActive ? 'var(--mantine-color-indigo-1)' : 'var(--mantine-color-gray-1)'
                        }
                      }}
                    >
                      <Group gap="xs">
                        <Icon size={16} stroke={1.5} />
                        <Text size="sm" fw={500}>
                          {item.label}
                        </Text>
                        {item.badge && (
                          <Badge
                            size="xs"
                            variant={isActive ? 'light' : 'outline'}
                            color={isActive ? 'indigo' : 'gray'}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Group>
                    </Box>
                  </Link>
                </Tooltip>
              );
            })}
          </Group>
        </Group>
      </Box>
    </Box>
  );
}