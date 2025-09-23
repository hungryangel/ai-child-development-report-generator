// src/components/UnifiedNavigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Group,
  Text,
  Box,
  Tooltip,
  Burger,
  Drawer,
  Stack,
  Divider,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconFileText,
  IconForms,
  IconSearch,
} from '@tabler/icons-react';

const ROUTES = {
  PREORDER: '/',
  GENERATE: '/generate',
  REVIEW: '/feedback',
} as const;

// ✨ 수정된 NavItem 타입 정의
type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>; // IconProps를 직접 쓰기보다, Mantine의 유연한 타입 요구사항에 맞춰 any로 설정합니다.
};

const NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.PREORDER,
    label: '사전등록',
    description: '이메일 인증 후 얼리 액세스',
    icon: IconFileText,
  },
  {
    href: ROUTES.GENERATE,
    label: 'AI평가서 작성',
    description: '키워드 → 따뜻한 전문 문장',
    icon: IconForms,
  },
  {
    href: ROUTES.REVIEW,
    label: 'AI평가서 검토',
    description: '기존 문서 업로드·피드백',
    icon: IconSearch,
  },
];

export default function UnifiedNavigation() {
  const pathname = usePathname();
  const [opened, { open, close, toggle }] = useDisclosure(false);

  const LinkChip = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Tooltip label={item.description} position="bottom">
        <Link href={item.href} style={{ textDecoration: 'none' }}>
          <Box
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              backgroundColor: isActive ? 'var(--mantine-color-indigo-1)' : 'transparent',
              color: isActive ? 'var(--mantine-color-indigo-7)' : 'var(--mantine-color-gray-7)',
              transition: 'all .15s ease',
            }}
          >
            <Group gap="xs">
              <Icon size={16} stroke={1.6} />
              <Text size="sm" fw={600}>
                {item.label}
              </Text>
            </Group>
          </Box>
        </Link>
      </Tooltip>
    );
  };

  return (
    <>
      <Box
        style={{
          borderBottom: '1px solid #e9ecef',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 1px 3px rgba(0,0,0,.06)',
        }}
      >
        <Box
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 1rem',
          }}
        >
          <Group justify="space-between" h={60}>
            {/* 좌측: 로고 */}
            <Link href={ROUTES.PREORDER} style={{ textDecoration: 'none' }}>
              <Group gap="sm">
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: 'var(--mantine-color-indigo-6)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconFileText size={18} color="white" />
                </Box>
                <Text size="xl" fw={800} c="dark">
                  AI 평가서 도구
                </Text>
              </Group>
            </Link>

            {/* 데스크톱 메뉴 */}
            <Group gap="xs" visibleFrom="sm">
              {NAV_ITEMS.map((item) => (
                <LinkChip key={item.href} item={item} />
              ))}
            </Group>

            {/* 모바일 버거 */}
            <Box hiddenFrom="sm">
              <Burger opened={opened} onClick={toggle} aria-label="메뉴 열기" />
            </Box>
          </Group>
        </Box>
      </Box>

      {/* 모바일 Drawer 메뉴 */}
      <Drawer
        opened={opened}
        onClose={close}
        padding="md"
        size="xs"
        title={<Text fw={700}>메뉴</Text>}
        overlayProps={{ opacity: 0.2, blur: 2 }}
      >
        <Stack gap="xs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <UnstyledButton key={item.href} onClick={close}>
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Box
                    style={{
                      borderRadius: 12,
                      padding: '12px 10px',
                      background: isActive ? 'var(--mantine-color-indigo-0)' : 'transparent',
                    }}
                  >
                    <Group gap="sm">
                      <Icon size={18} />
                      <div>
                        <Text fw={600} c={isActive ? 'indigo' : undefined}>
                          {item.label}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.description}
                        </Text>
                      </div>
                    </Group>
                  </Box>
                </Link>
              </UnstyledButton>
            );
          })}
          <Divider my="sm" />
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} KidsDev Report
          </Text>
        </Stack>
      </Drawer>
    </>
  );
}