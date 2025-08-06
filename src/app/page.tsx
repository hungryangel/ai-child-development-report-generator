'use client';

import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Grid,
  Divider,
  Alert,
  Card,
  LoadingOverlay,
  Badge,
  ActionIcon,
  Tooltip,
  ScrollArea
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconHeart,
  IconPuzzle,
  IconAlertCircle,
  IconCheck,
  IconDownload,
  IconPrinter,
  IconShare,
  IconSparkles
} from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { ChildData } from './lib/types';
import { calculateAge, formatAgeText } from './lib/utils';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState('');
  const [calculatedAge, setCalculatedAge] = useState('');
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChildData>({
    initialValues: {
      name: '',
      birthDate: '',
      className: '',
      temperament: '',
      strength: '',
      physical: { activity: '', health: '', safety: '' },
      communication: { listening: '', literacy: '', books: '' },
      social: { selfRespect: '', cooperation: '' },
      art: { aesthetics: '', creativity: '' },
      nature: { exploration: '', dailyInquiry: '', withNature: '' },
      parentMessage: { strengths: '', homeSupport: '' }
    },
    validate: {
      name: (value) => (value.length < 2 ? '아동명을 2자 이상 입력해주세요' : null),
      birthDate: (value) => (!value ? '생년월일을 선택해주세요' : null),
      className: (value) => (value.length < 1 ? '반명을 입력해주세요' : null),
      temperament: (value) => (value.length < 10 ? '기질과 적응도를 10자 이상 상세히 입력해주세요' : null),
      strength: (value) => (value.length < 10 ? '아이의 강점을 10자 이상 상세히 입력해주세요' : null),
    },
  });

  const handleBirthDateChange = (date: Date | null) => {
    if (date) {
      const birthDateString = date.toISOString().split('T')[0];
      form.setFieldValue('birthDate', birthDateString);

      const age = calculateAge(birthDateString);
      setCalculatedAge(formatAgeText(age));
    } else {
      setCalculatedAge('');
      form.setFieldValue('birthDate', '');
    }
  };

  // 개선된 스트림 처리 함수
  const streamReport = async (formData: ChildData) => {
    console.log('streamReport 시작');

    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // 마지막 불완전한 줄은 다음 반복을 위해 보관
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();

            if (dataStr === '[DONE]') {
              console.log('스트리밍 완료 신호 수신');
              return;
            }

            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  console.log('텍스트 수신:', data.text.substring(0, 50));
                  setReport(prev => prev + data.text);
                }
              } catch (parseError) {
                console.warn('JSON 파싱 실패:', dataStr);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleSubmit = async (values: ChildData) => {
    // 폼 유효성 검사
    if (!form.isValid()) {
      notifications.show({
        title: '입력 오류',
        message: '필수 항목을 모두 입력해주세요.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsLoading(true);
    setReport('');
    setIsReportGenerated(false);

    try {
      console.log('평가서 생성 시작');
      await streamReport(values);

      setIsReportGenerated(true);
      notifications.show({
        title: '평가서 생성 완료',
        message: '아동발달 평가서가 성공적으로 생성되었습니다.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      // 평가서 영역으로 스크롤
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (error) {
      console.error('평가서 생성 오류:', error);
      notifications.show({
        title: '오류 발생',
        message: error instanceof Error ? error.message : '평가서 생성 중 오류가 발생했습니다.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = reportRef.current?.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>아동발달 평가서 - ${form.values.name}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 20px; }
              h1, h2, h3 { color: #1c7ed6; margin-top: 1.5em; }
              .report-content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="report-content">${printContent}</div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  return (
    <Container size="lg" py="xl">
      {/* 헤더 */}
      <Stack align="center" mb="xl">
        <Group>
          <IconSparkles size={32} color="var(--mantine-color-indigo-6)" />
          <Title order={1} size="h1" c="indigo">
            AI 아동발달 평가서
          </Title>
        </Group>
        <Text size="lg" c="dimmed" ta="center" maw={600}>
          2024 개정 표준보육과정을 기반으로 전문가 수준의 아동발달 종합 평가서를 AI로 간편하게 생성하세요.
        </Text>
        <Badge size="lg" variant="light" color="indigo">
          보육교사 전문 도구
        </Badge>
      </Stack>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          {/* 1. 기본 정보 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconUser size={24} color="var(--mantine-color-indigo-6)" />
              <Title order={3}>1. 기본 정보</Title>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="아동명"
                  placeholder="홍길동"
                  required
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="생년월일"
                  placeholder="생년월일 선택"
                  required
                  maxDate={new Date()}
                  onChange={handleBirthDateChange}
                />
                {calculatedAge && (
                  <Text size="sm" c="dimmed" mt={4}>
                    현재 나이: {calculatedAge}
                  </Text>
                )}
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="반명"
                  placeholder="사랑반"
                  required
                  {...form.getInputProps('className')}
                />
              </Grid.Col>
            </Grid>

            <Stack mt="md">
              <Textarea
                label="기질 및 적응 특성"
                placeholder="예: 새로운 환경에 적응하는 시간이 필요하지만, 한번 적응하면 안정적입니다. 차분하고 신중한 성격이며..."
                minRows={2}
                required
                {...form.getInputProps('temperament')}
              />
              <Textarea
                label="아동의 주요 강점"
                placeholder="예: 언어 표현력이 뛰어나고, 또래와 잘 어울리며, 새로운 것에 대한 호기심이 많습니다..."
                minRows={2}
                required
                {...form.getInputProps('strength')}
              />
            </Stack>
          </Card>

          {/* 2. 발달 영역별 관찰 내용 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconPuzzle size={24} color="var(--mantine-color-orange-6)" />
              <Title order={3}>2. 발달 영역별 관찰 내용</Title>
            </Group>

            <Stack>
              {/* 신체운동 건강 */}
              <div>
                <Title order={4} c="gray.7" mb="sm">가. 신체운동 및 건강</Title>
                <Stack gap="sm">
                  <Textarea
                    label="신체 활동"
                    placeholder="예: 대근육 활동을 좋아하며, 달리기와 점프하기를 즐깁니다. 균형감각이 발달하여 한 발로 서기가 가능합니다."
                    minRows={2}
                    {...form.getInputProps('physical.activity')}
                  />
                  <Textarea
                    label="건강한 생활"
                    placeholder="예: 스스로 손 씻기, 이 닦기를 실천하며, 건강한 음식에 관심을 보입니다."
                    minRows={2}
                    {...form.getInputProps('physical.health')}
                  />
                  <Textarea
                    label="안전한 생활"
                    placeholder="예: 위험한 상황을 인지하고 조심스럽게 행동합니다. 안전 규칙을 잘 따릅니다."
                    minRows={2}
                    {...form.getInputProps('physical.safety')}
                  />
                </Stack>
              </div>

              <Divider />

              {/* 의사소통 */}
              <div>
                <Title order={4} c="gray.7" mb="sm">나. 의사소통</Title>
                <Stack gap="sm">
                  <Textarea
                    label="듣기와 말하기"
                    placeholder="예: 다른 사람의 이야기를 주의 깊게 듣고, 자신의 경험을 순서대로 말할 수 있습니다."
                    minRows={2}
                    {...form.getInputProps('communication.listening')}
                  />
                  <Textarea
                    label="읽기와 쓰기에 관심 가지기"
                    placeholder="예: 글자에 관심을 보이며, 자신의 이름을 써보려고 시도합니다. 책의 그림을 보고 이야기를 만들어 말합니다."
                    minRows={2}
                    {...form.getInputProps('communication.literacy')}
                  />
                  <Textarea
                    label="책과 이야기 즐기기"
                    placeholder="예: 책 읽기를 좋아하며, 등장인물에게 감정이입하여 이야기에 몰입합니다."
                    minRows={2}
                    {...form.getInputProps('communication.books')}
                  />
                </Stack>
              </div>

              <Divider />

              {/* 사회관계 */}
              <div>
                <Title order={4} c="gray.7" mb="sm">다. 사회관계</Title>
                <Stack gap="sm">
                  <Textarea
                    label="나를 알고 존중하기"
                    placeholder="예: 자신의 감정을 표현할 수 있으며, 자신의 의견을 당당히 말합니다."
                    minRows={2}
                    {...form.getInputProps('social.selfRespect')}
                  />
                  <Textarea
                    label="더불어 생활하기"
                    placeholder="예: 친구와 협력하여 놀이하며, 갈등 상황에서 타협점을 찾으려고 노력합니다."
                    minRows={2}
                    {...form.getInputProps('social.cooperation')}
                  />
                </Stack>
              </div>

              <Divider />

              {/* 예술경험 */}
              <div>
                <Title order={4} c="gray.7" mb="sm">라. 예술경험</Title>
                <Stack gap="sm">
                  <Textarea
                    label="아름다움 찾아보기"
                    placeholder="예: 자연의 아름다움을 발견하고 감탄하며, 예술 작품에 관심을 보입니다."
                    minRows={2}
                    {...form.getInputProps('art.aesthetics')}
                  />
                  <Textarea
                    label="창의적으로 표현하기"
                    placeholder="예: 다양한 미술 재료를 활용하여 창의적으로 표현하며, 음악에 맞춰 자유롭게 몸을 움직입니다."
                    minRows={2}
                    {...form.getInputProps('art.creativity')}
                  />
                </Stack>
              </div>

              <Divider />

              {/* 자연탐구 */}
              <div>
                <Title order={4} c="gray.7" mb="sm">마. 자연탐구</Title>
                <Stack gap="sm">
                  <Textarea
                    label="탐구과정 즐기기"
                    placeholder="예: 궁금한 것이 있으면 직접 관찰하고 실험해보며, 결과를 예측하려고 합니다."
                    minRows={2}
                    {...form.getInputProps('nature.exploration')}
                  />
                  <Textarea
                    label="생활 속에서 탐구하기"
                    placeholder="예: 수학적 개념(크기, 길이, 무게 등)을 일상에서 발견하고 비교합니다."
                    minRows={2}
                    {...form.getInputProps('nature.dailyInquiry')}
                  />
                  <Textarea
                    label="자연과 더불어 살기"
                    placeholder="예: 동식물을 아끼고 돌보며, 환경 보호의 중요성을 알고 실천합니다."
                    minRows={2}
                    {...form.getInputProps('nature.withNature')}
                  />
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* 3. 부모님께 드리는 글 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconHeart size={24} color="var(--mantine-color-pink-6)" />
              <Title order={3}>3. 부모님께 드리는 글</Title>
            </Group>

            <Stack>
              <Textarea
                label="특별히 강조하고 싶은 아이의 강점이나 재능"
                placeholder="예: 또래에 비해 언어 발달이 빠른 편이며, 자신의 생각을 명확하게 표현할 수 있습니다."
                minRows={3}
                {...form.getInputProps('parentMessage.strengths')}
              />
              <Textarea
                label="가정에서 연계하여 지도하면 좋을 만한 부분"
                placeholder="예: 친구와 갈등이 생겼을 때 말로 표현하는 방법을 격려해주시면 사회성 발달에 도움이 됩니다."
                minRows={3}
                {...form.getInputProps('parentMessage.homeSupport')}
              />
            </Stack>
          </Card>

          {/* 제출 버튼 */}
          <Group justify="center" mt="xl">
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={!form.isValid() || isLoading}
              leftSection={isLoading ? null : <IconSparkles size={20} />}
              variant="gradient"
              gradient={{ from: 'indigo', to: 'blue' }}
              style={{ minWidth: 200 }}
            >
              {isLoading ? '평가서 생성 중...' : '평가서 생성하기'}
            </Button>
          </Group>
        </Stack>
      </form>

      {/* 결과 표시 */}
      {(report || isLoading) && (
        <Paper
          ref={reportRef}
          shadow="lg"
          p="xl"
          mt="xl"
          pos="relative"
          withBorder
          style={{ backgroundColor: '#fafafa' }}
        >
          <LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />

          <Group justify="space-between" align="center" mb="lg">
            <Group>
              <IconSparkles size={24} color="var(--mantine-color-indigo-6)" />
              <Title order={2}>아동 발달 종합 평가서</Title>
            </Group>

            {isReportGenerated && (
              <Group gap="xs">
                <Tooltip label="인쇄하기">
                  <ActionIcon variant="light" size="lg" onClick={handlePrint}>
                    <IconPrinter size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="공유하기">
                  <ActionIcon variant="light" size="lg" onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${form.values.name} 아동발달 평가서`,
                        text: report.substring(0, 200) + '...'
                      });
                    }
                  }}>
                    <IconShare size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>

          {isLoading && (
            <Alert icon={<IconAlertCircle size={16} />} color="blue" mb="md">
              <Group>
                <div>
                  <Text fw={500}>AI가 전문적인 평가서를 생성하고 있습니다</Text>
                  <Text size="sm" c="dimmed">
                    2024 개정 표준보육과정을 기반으로 분석 중입니다...
                  </Text>
                </div>
              </Group>
            </Alert>
          )}

          {report && (
            <Card withBorder p="lg" style={{ backgroundColor: 'white' }}>
              <ScrollArea.Autosize mah={600}>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  {report}
                </div>
              </ScrollArea.Autosize>
            </Card>
          )}

          {isReportGenerated && (
            <Alert icon={<IconCheck size={16} />} color="green" mt="md">
              평가서 생성이 완료되었습니다. 우측 상단의 버튼을 통해 인쇄하거나 공유할 수 있습니다.
            </Alert>
          )}
        </Paper>
      )}

      {/* 푸터 */}
      <Group justify="center" mt="xl" pt="xl">
        <Text size="sm" c="dimmed" ta="center">
          Powered by Claude AI · 2024 개정 표준보육과정 기반 · 보육교사 전용 도구
        </Text>
      </Group>
    </Container>
  );
}