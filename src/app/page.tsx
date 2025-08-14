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
  const [streamError, setStreamError] = useState('');
  const [childAgeInYears, setChildAgeInYears] = useState<number>(0);
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
      social: { selfRespect: '', cooperation: '', societyInterest: '' },
      art: { aesthetics: '', creativity: '', appreciation: '' },
      nature: { exploration: '', dailyInquiry: '', withNature: '' },
      parentMessage: { strengths: '', homeSupport: '' }
    },
    validate: {
      name: (value) => (value.length < 2 ? '아동명을 2자 이상 입력해주세요' : null),
      birthDate: (value) => (!value ? '생년월일을 선택해주세요' : null),
      className: (value) => (value.length < 1 ? '반명을 입력해주세요' : null),
      temperament: (value) => (value.length < 10 ? '기질과 적응도를 10자 이상 상세히 입력해주세요' : null),
      strength: (value) => (value.length < 10 ? '주요 강점을 10자 이상 상세히 입력해주세요' : null),
    },
  });

  // 연령 계산 및 동적 필드 업데이트
  const handleBirthDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      form.setFieldValue('birthDate', dateString);

      const ageData = calculateAge(dateString);
      const ageText = formatAgeText(ageData);
      setCalculatedAge(ageText);
      setChildAgeInYears(ageData.years);

      // 3세 이상일 때만 추가 필드 초기화
      if (ageData.years >= 3) {
        form.setFieldValue('social.societyInterest', '');
        form.setFieldValue('art.appreciation', '');
      }
    } else {
      form.setFieldValue('birthDate', '');
      setCalculatedAge('');
      setChildAgeInYears(0);
    }
  };

  // 3세 이상인지 확인하는 헬퍼 함수
  const isAge3Plus = childAgeInYears >= 3;

  // 개선된 스트림 처리 함수
  const streamReport = async (formData: ChildData & { ageGroup: string; calculatedAge: string }) => {
    console.log('스트림 처리 시작');
    setStreamError('');

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('API 응답 상태:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP 오류: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('API 오류 상세:', errorData);
        } catch (e) {
          console.error('응답을 JSON으로 파싱할 수 없음');
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('응답 스트림을 읽을 수 없습니다.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        let hasReceivedContent = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('스트림 읽기 완료');
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();

              if (dataStr === '[DONE]') {
                console.log('스트리밍 완료 신호 수신');
                if (!hasReceivedContent) {
                  setStreamError('평가서 내용을 받지 못했습니다. 다시 시도해주세요.');
                }
                return;
              }

              if (dataStr) {
                try {
                  const data = JSON.parse(dataStr);
                  if (data.text) {
                    console.log('텍스트 수신:', data.text.substring(0, 50) + '...');
                    hasReceivedContent = true;
                    setReport(prev => prev + data.text);
                  }
                  if (data.error) {
                    setStreamError(data.error);
                    return;
                  }
                } catch (parseError) {
                  console.warn('JSON 파싱 실패:', dataStr.substring(0, 100));
                }
              }
            }
          }
        }

        if (!hasReceivedContent) {
          setStreamError('평가서 내용이 생성되지 않았습니다. 다시 시도해주세요.');
        }

      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('스트림 처리 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setStreamError(errorMessage);
      throw error;
    }
  };

  // 통합된 폼 제출 함수 (수정됨)
  const handleFormSubmit = async (values: ChildData) => {
    console.log('폼 제출:', values);

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

    try {
      setIsLoading(true);
      setReport('');
      setStreamError('');
      setIsReportGenerated(false);

      // 연령대별 프롬프트 구성
      const ageGroup = childAgeInYears >= 3 ? '3-5세' : '0-2세';

      const formDataWithAge = {
        ...values,
        ageGroup,
        calculatedAge
      };

      console.log('평가서 생성 시작:', ageGroup);

      await streamReport(formDataWithAge);

      if (streamError) {
        throw new Error(streamError);
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
      console.error('평가서 생성 오류:', error);
      setStreamError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      notifications.show({
        title: '오류 발생',
        message: error instanceof Error ? error.message : '평가서 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (report) {
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${form.values.name || '아동'}_발달평가서.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    if (navigator.share && report) {
      try {
        await navigator.share({
          title: `${form.values.name} 발달평가서`,
          text: report,
        });
      } catch (error) {
        console.log('공유 취소됨:', error);
      }
    } else {
      navigator.clipboard.writeText(report);
      notifications.show({
        title: '복사 완료',
        message: '평가서가 클립보드에 복사되었습니다.',
        color: 'blue',
        icon: <IconCheck size={16} />,
      });
    }
  }; // 수정: 누락된 중괄호 추가

  const handlePrint = () => {
    if (!report) return;

    const printContent = `
      <html>
        <head>
          <title>아동발달 평가서 - ${form.values.name}</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              line-height: 1.6; 
              padding: 20px; 
              color: #333;
            }
            h1, h2, h3 { 
              color: #1c7ed6; 
              margin-top: 1.5em; 
            }
            .report-content { 
              white-space: pre-wrap; 
            }
            @media print {
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="report-content">${report}</div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* 헤더 */}
        <Paper p="xl" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Stack align="center" gap="md">
            <IconSparkles size={48} />
            <Title order={1} ta="center" size="h2">
              AI 아동발달 평가서 생성기
            </Title>
            <Text ta="center" size="lg" opacity={0.9}>
              2024 개정 표준보육과정 기반 · 전문가 수준의 평가서를 손쉽게 작성하세요
            </Text>
            <Group gap="xs">
              <Badge color="rgba(255,255,255,0.2)" size="lg">영아 0~2세</Badge>
              <Badge color="rgba(255,255,255,0.2)" size="lg">유아 3~5세</Badge>
              <Badge color="rgba(255,255,255,0.2)" size="lg">누리과정 연계</Badge>
            </Group>
          </Stack>
        </Paper>

        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack gap="lg">
            {/* 1. 기본 정보 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconUser size={24} color="var(--mantine-color-indigo-6)" />
                <Title order={3}>1. 아동 기본 정보</Title>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="아동명"
                    placeholder="아동의 이름을 입력하세요"
                    {...form.getInputProps('name')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <DateInput
                    label="생년월일"
                    placeholder="생년월일을 선택하세요"
                    value={form.values.birthDate ? new Date(form.values.birthDate) : null}
                    onChange={handleBirthDateChange}
                    maxDate={new Date()}
                  />
                  {calculatedAge && (
                    <Text size="sm" c="blue" mt={4}>
                      {calculatedAge}
                      {isAge3Plus && (
                        <Badge ml="xs" color="green" size="sm">3~5세 (누리과정)</Badge>
                      )}
                    </Text>
                  )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="반명"
                    placeholder="소속 반명을 입력하세요"
                    {...form.getInputProps('className')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="기질 및 적응도"
                    placeholder="아이의 기질과 어린이집 적응도를 구체적으로 서술하세요"
                    minRows={3}
                    {...form.getInputProps('temperament')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="주요 강점"
                    placeholder="아이가 특별히 잘하거나 좋아하는 활동을 구체적으로 서술하세요"
                    minRows={3}
                    {...form.getInputProps('strength')}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* 2. 신체운동·건강 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconHeart size={24} color="var(--mantine-color-red-6)" />
                <Title order={3}>2. 신체운동·건강</Title>
              </Group>

              <Stack>
                <Textarea
                  label="신체활동 즐기기"
                  placeholder="대근육, 소근육 발달 상황과 신체 움직임 특성을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('physical.activity')}
                />
                <Textarea
                  label="건강하게 생활하기"
                  placeholder="식사, 배변, 수면 등 건강한 생활습관 형성 정도를 기록하세요"
                  minRows={3}
                  {...form.getInputProps('physical.health')}
                />
                <Textarea
                  label="안전하게 생활하기"
                  placeholder="안전 규칙 인식과 위험 상황 대처 능력을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('physical.safety')}
                />
              </Stack>
            </Card>

            {/* 3. 의사소통 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconPuzzle size={24} color="var(--mantine-color-green-6)" />
                <Title order={3}>3. 의사소통</Title>
              </Group>

              <Stack>
                <Textarea
                  label="듣기와 말하기"
                  placeholder="언어 이해력, 표현력, 대화 능력 등을 구체적으로 기록하세요"
                  minRows={3}
                  {...form.getInputProps('communication.listening')}
                />
                <Textarea
                  label="읽기와 쓰기에 관심 가지기"
                  placeholder="문자에 대한 관심, 쓰기 시도, 책 읽기 관심 등을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('communication.literacy')}
                />
                <Textarea
                  label="책과 이야기 즐기기"
                  placeholder="동화책 선호도, 이야기 듣기 태도, 상상력 표현 등을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('communication.books')}
                />
              </Stack>
            </Card>

            {/* 4. 사회관계 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconUser size={24} color="var(--mantine-color-blue-6)" />
                <Title order={3}>4. 사회관계</Title>
                {isAge3Plus && (
                  <Badge color="green" variant="light">만 3~5세 확장 영역</Badge>
                )}
              </Group>

              <Stack>
                <Textarea
                  label="나를 알고 존중하기"
                  placeholder="자아 인식, 자기 감정 표현, 자신감 등을 구체적으로 기록하세요"
                  minRows={3}
                  {...form.getInputProps('social.selfRespect')}
                />
                <Textarea
                  label="더불어 생활하기"
                  placeholder="친구와의 관계, 협력하는 모습, 배려하는 행동 등을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('social.cooperation')}
                />

                {/* 만 3~5세만 표시되는 추가 영역 */}
                {isAge3Plus && (
                  <Textarea
                    label="사회에 관심가지기"
                    placeholder="지역사회, 직업, 사회 규칙 등에 대한 관심과 이해를 기록하세요"
                    minRows={3}
                    {...form.getInputProps('social.societyInterest')}
                    style={{
                      border: '2px solid var(--mantine-color-green-3)',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </Stack>
            </Card>

            {/* 5. 예술경험 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconSparkles size={24} color="var(--mantine-color-violet-6)" />
                <Title order={3}>5. 예술경험</Title>
                {isAge3Plus && (
                  <Badge color="green" variant="light">만 3~5세 확장 영역</Badge>
                )}
              </Group>

              <Stack>
                <Textarea
                  label="아름다움 찾아보기"
                  placeholder="자연과 예술작품의 아름다움에 관심을 보이는 모습을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('art.aesthetics')}
                />
                <Textarea
                  label="창의적 표현"
                  placeholder="음악, 움직임, 미술 등으로 창의적으로 표현하는 모습을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('art.creativity')}
                />
                {/* 만 3~5세만 표시되는 추가 영역 */}
                {isAge3Plus && (
                  <Textarea
                    label="예술 감상하기"
                    placeholder="음악, 미술작품, 공연 등을 감상하고 느낌을 표현하는 모습을 기록하세요"
                    minRows={3}
                    {...form.getInputProps('art.appreciation')}
                    style={{
                      border: '2px solid var(--mantine-color-green-3)',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </Stack>
            </Card>

            {/* 6. 자연탐구 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconPuzzle size={24} color="var(--mantine-color-teal-6)" />
                <Title order={3}>6. 자연탐구</Title>
              </Group>

              <Stack>
                <Textarea
                  label="탐구과정 즐기기"
                  placeholder="호기심을 갖고 탐구하며 문제를 해결하려는 모습을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('nature.exploration')}
                />
                <Textarea
                  label="생활 속에서 탐구하기"
                  placeholder="수학적, 과학적 개념에 대한 관심과 탐구하는 모습을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('nature.dailyInquiry')}
                />
                <Textarea
                  label="자연과 더불어 살기"
                  placeholder="동식물과 자연환경에 관심을 갖고 소중히 여기는 모습을 기록하세요"
                  minRows={3}
                  {...form.getInputProps('nature.withNature')}
                />
              </Stack>
            </Card>

            <Divider my="xl" />

            {/* 7. 부모님께 드리는 글 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconHeart size={24} color="var(--mantine-color-pink-6)" />
                <Title order={3}>7. 부모님께 드리는 글</Title>
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
                {isLoading ? 'AI가 평가서를 작성하고 있습니다...' : '✨ AI 평가서 생성하기'}
              </Button>
            </Group>
          </Stack>
        </form>

        {/* 최적화된 결과 표시 */}
        {(report || isLoading || streamError) && (
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

              {isReportGenerated && report && !streamError && (
                <Group gap="xs">
                  <Tooltip label="인쇄하기">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="lg"
                      onClick={handlePrint}
                    >
                      <IconPrinter size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="파일로 저장">
                    <ActionIcon
                      variant="light"
                      color="green"
                      size="lg"
                      onClick={handleDownload}
                    >
                      <IconDownload size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="공유하기">
                    <ActionIcon
                      variant="light"
                      color="grape"
                      size="lg"
                      onClick={handleShare}
                    >
                      <IconShare size={18} />
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

            {streamError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                <div>
                  <Text fw={500}>오류가 발생했습니다</Text>
                  <Text size="sm">{streamError}</Text>
                  <Text size="sm" mt="xs">
                    문제가 지속되면 브라우저 개발자 도구(F12)를 열어 콘솔을 확인해보세요.
                  </Text>
                </div>
              </Alert>
            )}

            {report && !streamError && (
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

            {isReportGenerated && report && !streamError && (
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
      </Stack>
    </Container>
  );
}