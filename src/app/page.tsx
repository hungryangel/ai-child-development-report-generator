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
import { calculateAge, formatAgeText, streamReport } from './lib/utils';

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

  const handleSubmit = async (values: ChildData) => {
    setIsLoading(true);
    setReport('');
    setIsReportGenerated(false);

    try {
      const stream = streamReport(values);
      for await (const chunk of stream) {
        setReport(prev => prev + chunk);
      }

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
      notifications.show({
        title: '오류 발생',
        message: '평가서 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      console.error('Error generating report:', error);
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
              <Title order={3}>1. 아동 기본 정보</Title>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="아동명"
                  placeholder="예: 김다은"
                  withAsterisk
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="반명"
                  placeholder="예: 햇살반"
                  withAsterisk
                  {...form.getInputProps('className')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <DateInput
                  label="생년월일"
                  placeholder="날짜를 선택해주세요"
                  withAsterisk
                  onChange={handleBirthDateChange}
                  maxDate={new Date()}
                  valueFormat="YYYY년 MM월 DD일"
                />
                {calculatedAge && (
                  <Text size="sm" c="indigo" mt={5} fw={500}>
                    현재 연령: {calculatedAge}
                  </Text>
                )}
              </Grid.Col>
            </Grid>
          </Card>

          {/* 2. 특성 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconHeart size={24} color="var(--mantine-color-indigo-6)" />
              <Title order={3}>2. 전반적인 아동 특성</Title>
            </Group>

            <Stack>
                              <Textarea
                label="전반적인 기질 및 어린이집 생활 적응도"
                placeholder="예: 새로운 환경에 호기심이 많고 교사에게 안정적으로 애착을 보입니다. 또래 친구들과의 상호작용을 즐기며 하루 일과에 잘 적응하고 있습니다."
                minRows={3}
                withAsterisk
                {...form.getInputProps('temperament')}
              />
              <Textarea
                label="가장 두드러지는 강점"
                placeholder="예: 호기심이 많고 탐구하는 것을 좋아하며, 감정 표현이 풍부합니다. 새로운 활동에 적극적으로 참여하는 모습을 보입니다."
                minRows={3}
                withAsterisk
                {...form.getInputProps('strength')}
              />
            </Stack>
          </Card>

          {/* 3. 발달 영역 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconPuzzle size={24} color="var(--mantine-color-indigo-6)" />
              <Title order={3}>3. 영역별 발달 관찰 내용</Title>
            </Group>

            <Stack gap="lg">
              {/* 신체운동 및 건강 */}
              <div>
                <Title order={4} c="gray.7" mb="sm">가. 신체운동 및 건강</Title>
                <Stack gap="sm">
                  <Textarea
                    label="신체활동 즐기기"
                    placeholder="예: 계단을 혼자 오르내릴 수 있으며, 공을 발로 차거나 던지는 활동을 즐깁니다. 균형을 잡고 한 발로 서기도 시도합니다."
                    minRows={2}
                    {...form.getInputProps('physical.activity')}
                  />
                  <Textarea
                    label="건강하게 생활하기"
                    placeholder="예: 스스로 숟가락질을 하려고 시도하며, 배변 의사를 표현할 수 있습니다. 손 씻기를 교사와 함께 실천합니다."
                    minRows={2}
                    {...form.getInputProps('physical.health')}
                  />
                  <Textarea
                    label="안전하게 생활하기"
                    placeholder="예: '뜨거워' '위험해' 등의 말에 반응하여 행동을 멈춥니다. 교사 손을 잡고 안전하게 이동합니다."
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
                    placeholder="예: 두 단어를 연결하여 말합니다('엄마, 물'). 간단한 지시를 듣고 따라할 수 있습니다."
                    minRows={2}
                    {...form.getInputProps('communication.listening')}
                  />
                  <Textarea
                    label="읽기와 쓰기에 관심 가지기"
                    placeholder="예: 그림책을 자주 넘겨보며, 끼적이기 도구를 사용해 그림을 그리는 것을 좋아합니다."
                    minRows={2}
                    {...form.getInputProps('communication.literacy')}
                  />
                  <Textarea
                    label="책과 이야기 즐기기"
                    placeholder="예: 교사가 읽어주는 그림책에 집중하며, 익숙한 단어나 의성어를 따라 말합니다."
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
                    placeholder="예: 자신의 물건을 '내 거야'라고 표현하며, 거울 속 자기 모습을 보고 미소짓습니다."
                    minRows={2}
                    {...form.getInputProps('social.selfRespect')}
                  />
                  <Textarea
                    label="더불어 생활하기"
                    placeholder="예: 친구의 행동에 관심을 보이고 모방합니다. 장난감 교환이나 차례 기다리기를 시도합니다."
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
                    placeholder="예: 주변의 새로운 사물이나 그림에 '우와'하며 관심을 보입니다. 밝고 선명한 색깔을 좋아합니다."
                    minRows={2}
                    {...form.getInputProps('art.aesthetics')}
                  />
                  <Textarea
                    label="창의적으로 표현하기"
                    placeholder="예: 노래가 나오면 몸을 흔들거나 손뼉을 칩니다. 다양한 미술 재료를 손으로 탐색하며 표현합니다."
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
                    placeholder="예: 블록을 쌓았다가 무너뜨리기를 반복하며 즐깁니다. 새로운 장난감을 여러 방법으로 탐색합니다."
                    minRows={2}
                    {...form.getInputProps('nature.exploration')}
                  />
                  <Textarea
                    label="생활속에서 탐구하기"
                    placeholder="예: 물놀이를 할 때 물건을 띄워보며 즐거워합니다. 간단한 퍼즐이나 끼워넣기 놀잇감을 탐색합니다."
                    minRows={2}
                    {...form.getInputProps('nature.dailyInquiry')}
                  />
                  <Textarea
                    label="자연과 더불어 살기"
                    placeholder="예: 산책 중 꽃이나 곤충을 발견하면 호기심을 보입니다. 날씨 변화에 관심을 갖고 반응합니다."
                    minRows={2}
                    {...form.getInputProps('nature.withNature')}
                  />
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* 4. 부모님께 드리는 글 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconHeart size={24} color="var(--mantine-color-pink-6)" />
              <Title order={3}>4. 부모님께 드리는 글</Title>
            </Group>

            <Stack>
              <Textarea
                label="특별히 강조하고 싶은 아이의 강점이나 재능"
                placeholder="예: 또래에 비해 언어 발달이 빠른 편이며, 자신의 생각을 명확하게 표현할 수 있습니다. 새로운 활동에 두려움 없이 도전하는 용기가 돋보입니다."
                minRows={3}
                {...form.getInputProps('parentMessage.strengths')}
              />
              <Textarea
                label="가정에서 연계하여 지도하면 좋을 만한 부분"
                placeholder="예: 친구와 갈등이 생겼을 때 말로 표현하는 방법을 격려해주시면 사회성 발달에 도움이 됩니다. 규칙적인 생활 습관을 가정에서도 꾸준히 실천해 주세요."
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
                    navigator.share?.({
                      title: `${form.values.name} 아동발달 평가서`,
                      text: report.substring(0, 200) + '...'
                    });
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