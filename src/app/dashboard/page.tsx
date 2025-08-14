// src/app/dashboard/page.tsx (기존 로직 + Mantine 스타일)
'use client';

import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Grid,
  Card,
  Badge,
  ActionIcon,
  Progress,
  SimpleGrid,
  ThemeIcon
} from '@mantine/core';
import {
  IconFileText,
  IconSearch,
  IconTrendingUp,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconChartBar,
  IconUsers,
  IconStar,
  IconArrowRight
} from '@tabler/icons-react';
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
      icon: IconFileText,
      color: 'blue'
    },
    {
      title: '평가서 검토',
      description: '기존 평가서 분석 및 피드백',
      href: '/feedback',
      icon: IconSearch,
      color: 'green'
    },
    {
      title: '템플릿 보기',
      description: '저장된 템플릿 관리',
      href: '/templates',
      icon: IconStar,
      color: 'violet'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generate': return IconFileText;
      case 'analyze': return IconSearch;
      case 'improve': return IconTrendingUp;
      default: return IconFileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'generate': return 'blue';
      case 'analyze': return 'green';
      case 'improve': return 'violet';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <IconCheck size={16} color="var(--mantine-color-green-6)" />;
      case 'in_progress': return <IconClock size={16} color="var(--mantine-color-yellow-6)" />;
      case 'failed': return <IconAlertCircle size={16} color="var(--mantine-color-red-6)" />;
      default: return <IconClock size={16} color="var(--mantine-color-gray-6)" />;
    }
  };

  return (
    <Container size="xl" py="xl">
      {/* 헤더 */}
      <Stack mb="xl">
        <Title order={1} size="h1" c="dark">
          평가서 관리 대시보드
        </Title>
        <Text c="dimmed" size="lg">
          2024 개정 표준보육과정 기반 AI 평가서 통합 관리 시스템
        </Text>
      </Stack>

      {/* 통계 카드 */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500} c="dimmed">생성된 평가서</Text>
              <Text size="xl" fw={700}>{stats.totalReports}</Text>
            </div>
            <ThemeIcon size={48} radius="md" variant="light" color="blue">
              <IconFileText size={24} />
            </ThemeIcon>
          </Group>
          <Group mt="md" gap="xs">
            <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm" c="green" fw={500}>이번 달 +12</Text>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500} c="dimmed">분석 완료</Text>
              <Text size="xl" fw={700}>{stats.analysisCount}</Text>
            </div>
            <ThemeIcon size={48} radius="md" variant="light" color="green">
              <IconSearch size={24} />
            </ThemeIcon>
          </Group>
          <Group mt="md" gap="xs">
            <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm" c="green" fw={500}>이번 주 +8</Text>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500} c="dimmed">평균 점수</Text>
              <Text size="xl" fw={700}>{stats.averageScore}</Text>
            </div>
            <ThemeIcon size={48} radius="md" variant="light" color="yellow">
              <IconChartBar size={24} />
            </ThemeIcon>
          </Group>
          <Group mt="md" gap="xs">
            <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm" c="green" fw={500}>+2.3점 향상</Text>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500} c="dimmed">개선률</Text>
              <Text size="xl" fw={700}>{stats.improvementRate}%</Text>
            </div>
            <ThemeIcon size={48} radius="md" variant="light" color="violet">
              <IconUsers size={24} />
            </ThemeIcon>
          </Group>
          <Group mt="md" gap="xs">
            <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm" c="green" fw={500}>+5.2% 증가</Text>
          </Group>
        </Card>
      </SimpleGrid>

      <Grid>
        {/* 빠른 작업 */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Stack gap="md">
              <div>
                <Title order={3} size="h4">빠른 작업</Title>
                <Text size="sm" c="dimmed">자주 사용하는 기능들</Text>
              </div>

              <Stack gap="sm">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Paper
                      key={index}
                      component={Link}
                      href={action.href}
                      p="md"
                      withBorder
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      className="hover-card"
                    >
                      <Group>
                        <ThemeIcon size={40} radius="md" variant="light" color={action.color}>
                          <Icon size={20} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text fw={500} size="sm">{action.title}</Text>
                          <Text size="xs" c="dimmed">{action.description}</Text>
                        </div>
                        <ActionIcon variant="subtle" color="gray">
                          <IconArrowRight size={16} />
                        </ActionIcon>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>

        {/* 최근 활동 */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Title order={3} size="h4">최근 활동</Title>
                  <Text size="sm" c="dimmed">최근 작업한 평가서들</Text>
                </div>
                <Text
                  component={Link}
                  href="/history"
                  size="sm"
                  c="indigo"
                  fw={500}
                  style={{ textDecoration: 'none' }}
                >
                  전체 보기
                </Text>
              </Group>

              {recentActivities.length > 0 ? (
                <Stack gap="sm">
                  {recentActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const color = getActivityColor(activity.type);

                    return (
                      <Paper key={activity.id} p="md" withBorder bg="gray.0">
                        <Group>
                          <ThemeIcon size={40} radius="md" variant="light" color={color}>
                            <Icon size={20} />
                          </ThemeIcon>
                          <div style={{ flex: 1 }}>
                            <Text fw={500} size="sm">{activity.title}</Text>
                            <Group gap="xs" mt={4}>
                              <Text size="xs" c="dimmed">{activity.timestamp}</Text>
                              {activity.score && (
                                <>
                                  <Text size="xs" c="dimmed">•</Text>
                                  <Text size="xs" fw={500}>
                                    점수: {activity.score}점
                                  </Text>
                                </>
                              )}
                            </Group>
                          </div>
                          <div>
                            {getStatusIcon(activity.status)}
                          </div>
                        </Group>
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Stack align="center" py="xl">
                  <ThemeIcon size={48} radius="md" variant="light" color="gray">
                    <IconFileText size={24} />
                  </ThemeIcon>
                  <div style={{ textAlign: 'center' }}>
                    <Text fw={500} mb="xs">아직 활동이 없습니다</Text>
                    <Text size="sm" c="dimmed" mb="md">새로운 평가서를 생성하거나 기존 평가서를 분석해보세요.</Text>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                      <Paper p="sm" withBorder c="indigo" fw={500} style={{ display: 'inline-block' }}>
                        평가서 생성하기
                      </Paper>
                    </Link>
                  </div>
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--mantine-shadow-md);
          transition: all 0.2s ease;
        }
      `}</style>

      {/* 푸터 */}
      <Group justify="center" mt="xl" pt="xl">
        <Text size="sm" c="dimmed" ta="center">
          Powered by Claude AI · 2024 개정 표준보육과정 기반 · 보육교사 전용 도구
        </Text>
      </Group>


    </Container>
  );
}