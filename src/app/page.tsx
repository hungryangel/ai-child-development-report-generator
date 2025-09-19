// path: src/app/page.tsx
'use client';

import {
  Container, Title, Text, Paper, Card, Grid, Group, Button, Badge, List, ThemeIcon, Divider
} from '@mantine/core';
import { IconCheck, IconShieldCheck, IconClock, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <Paper radius="md" p="xl" style={{
        background: 'linear-gradient(180deg, var(--mantine-color-indigo-0), #fff 60%)'
      }}>
        <Container size="lg">
          <Grid align="center" gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Badge size="lg" variant="light" color="indigo">사전등록 오픈</Badge>
              <Title order={1} mt="sm">
                교사의 관찰 키워드 → <Text span c="indigo.7">따뜻한 전문 문장</Text>으로 자동 완성
              </Title>
              <Text mt="md" c="dimmed" fz="lg">
                2024 개정 표준 보육·누리과정 항목과 맵핑된 템플릿으로 평가서를 빠르고 품질 있게.
              </Text>

              <Group mt="lg">
                <Link href="#preorder">
                  <Button size="md" radius="md" leftSection={<IconChevronRight size={18} />} variant="gradient" gradient={{ from: 'indigo', to: 'blue' }}>
                    사전등록 하기
                  </Button>
                </Link>
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card radius="md" withBorder>
                <Title order={4}>바로 느껴지는 장점</Title>
                <List mt="sm" spacing="sm" size="sm" icon={
                  <ThemeIcon color="indigo" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }>
                  <List.Item>연령/영역 자동 분기 · 교사 톤 유지 · 부모 친화 서술</List.Item>
                  <List.Item>인쇄/PDF · 공유 · 템플릿 보정</List.Item>
                  <List.Item>개인정보는 해시+암호화로 안전하게 저장</List.Item>
                </List>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Paper>

      {/* 신뢰 섹션 */}
      <Container size="lg" mt="xl">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md">
              <Group gap="xs"><IconShieldCheck size={20} /><b>표준 맵핑</b></Group>
              <Text mt="xs" c="dimmed" fz="sm">2024 개정 표준 보육·누리과정 항목 구조를 참고/반영</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md">
              <Group gap="xs"><IconCheck size={20} /><b>문장 품질</b></Group>
              <Text mt="xs" c="dimmed" fz="sm">교사 페르소나 톤으로 매끄럽고 따뜻한 문장</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md">
              <Group gap="xs"><IconClock size={20} /><b>시간 절약</b></Group>
              <Text mt="xs" c="dimmed" fz="sm">평균 30~40분 단축(내보내기까지 원클릭)</Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/* 사전등록 폼(더블옵트인/OTP 없이 이메일 유효성만) */}
      <Container id="preorder" size="lg" mt="xl">
        <Card withBorder radius="md" p="xl">
          <Title order={3}>사전등록</Title>
          <Text mt="xs" c="dimmed" fz="sm">
            이메일 확인 후 얼리 액세스 순서대로 초대해 드립니다. 등록 완료 메일이 발송됩니다.
          </Text>

          <form action="/api/preorder" method="post" style={{ marginTop: 16 }}>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <input
                  name="email" type="email" required
                  placeholder="이메일"
                  className="mantine-input input"
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--mantine-color-gray-3)' }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <input
                  name="orgName" placeholder="기관명(선택)"
                  className="mantine-input input"
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--mantine-color-gray-3)' }}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <label style={{ fontSize: 14 }}>
                  <input type="checkbox" name="consent" required style={{ marginRight: 8 }} />
                  (필수) 개인정보 처리 및 사전 안내 메일 수신에 동의합니다.
                </label>
              </Grid.Col>
              <Grid.Col span={12}>
                <Button type="submit" radius="md" size="md" leftSection={<IconChevronRight size={18} />}>
                  제출하기
                </Button>
              </Grid.Col>
            </Grid>
          </form>

          <Divider my="lg" />
          <Text c="dimmed" fz="sm">
            사전등록 완료 후, 상단 내비게이션에서 카톡 커뮤니티 링크가 노출됩니다(작업 중 표시 로직).
          </Text>
        </Card>
      </Container>

      {/* 팀/개발 철학(간략) */}
      <Container size="lg" my="xl">
        <Title order={3}>개발 철학 · 팀 소개</Title>
        <Text mt="xs" c="dimmed" fz="sm">
          아이를 돌보는 시간, 교사의 전문성이 빛나야 할 시간입니다. 문서 작업은 덜어내고 관찰과 관계에 집중할 수 있게 돕습니다.
        </Text>
      </Container>

      {/* 푸터 */}
      <Container size="lg" my="xl">
        <Text c="dimmed" fz="xs">© {new Date().getFullYear()} KidsDev Report · 개인정보는 해시/암호화로 안전하게 처리됩니다.</Text>
      </Container>
    </main>
  );
}
