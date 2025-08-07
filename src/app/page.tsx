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

import { useEffect } from 'react';




export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState('');
  const [calculatedAge, setCalculatedAge] = useState('');
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // ✅ report 상태가 바뀔 때마다 콘솔에 출력
  useEffect(() => {
    if (report) {
      console.log('🧾 최종 report 내용:', report);
    }
  }, [report]);


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

  const
      handleSubmit = async (values: ChildData) => {
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
    setReport(''); // 이전 리포트 초기화
    setIsReportGenerated(false);

    try {
      console.log('평가서 생성 시작');

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      console.log('API 응답 상태:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.log('에러 응답을 JSON으로 파싱할 수 없음');
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // 스트리밍 데이터 읽기
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('스트림 읽기 완료');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // 마지막 불완전한 줄은 다음 반복을 위해 보관
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();

            if (dataStr === '[DONE]') {
              console.log('스트리밍 완료 신호 수신');
              break;
            }

            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  console.log('텍스트 청크 수신:', data.text.substring(0, 50) + '...');
                  // 상태 업데이트 - 이전 텍스트에 추가
                  setReport(prevReport => prevReport + data.text);
                }
              } catch (parseError) {
                console.warn('JSON 파싱 실패:', dataStr.substring(0, 100));
                // 파싱 에러가 있어도 계속 진행
              }
            }
          }
        }
      }

      reader.releaseLock();

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
        message: error instanceof Error ? error.message : '평가서 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([report], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${form.values.name}_평가서_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${form.values.name} 아동 발달 평가서`,
          text: report,
        });
      } catch (error) {
        console.log('공유 실패:', error);
      }
    } else {
      navigator.clipboard.writeText(report);
      notifications.show({
        title: '클립보드에 복사됨',
        message: '평가서 내용이 클립보드에 복사되었습니다.',
        color: 'green',
      });
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* 헤더 */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack align="center" gap="md">
            <IconSparkles size={48} color="#7c3aed" />
            <Title order={1} ta="center">
              AI 아동발달 평가서
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              2024 개정 표준보육과정을 기반으로 전문가 수준의 아동발달 종합 평가서를 AI로 간편하게 생성하세요.
            </Text>
            <Button
              onClick={() => window.location.href = '/'}
              variant="subtle"
              size="sm"
            >
              보육교사 전문 도구
            </Button>
          </Stack>
        </Paper>

        {/* 폼 영역 */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* 1. 기본 정보 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group align="center" mb="md">
                <IconUser size={24} color="#7c3aed" />
                <Title order={3}>1. 기본 정보</Title>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="아동명"
                    placeholder="김다은"
                    required
                    {...form.getInputProps('name')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="생년월일"
                    placeholder="2024-06-04"
                    required
                    value={form.values.birthDate ? new Date(form.values.birthDate) : null}
                    onChange={handleBirthDateChange}
                    maxDate={new Date()}
                  />
                  {calculatedAge && (
                    <Text size="sm" c="dimmed" mt={4}>
                      현재 나이: {calculatedAge}
                    </Text>
                  )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="반명"
                    placeholder="햇살반"
                    required
                    {...form.getInputProps('className')}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* 2. 기질 및 적응 특성 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group align="center" mb="md">
                <IconHeart size={24} color="#7c3aed" />
                <Title order={3}>2. 기질 및 적응 특성</Title>
              </Group>

              <Stack>
                <Textarea
                  label="기질 및 적응도"
                  placeholder="새로운 환경에 호기심이 많고 친구들에게 먼저 다가가는 사교적인 성향입니다. 처음에는 낯가림이 있었으나 현재는 잘 적응하여 즐겁게 생활하고 있습니다."
                  minRows={3}
                  required
                  {...form.getInputProps('temperament')}
                />
                <Textarea
                  label="아동의 주요 강점"
                  placeholder="그림 그리기를 좋아하고, 활발하게 수업에 참여하며 창의적인 생각을 많이 표현합니다. 친구들과 잘 어울리고 양보와 배려를 할 줄 압니다."
                  minRows={3}
                  required
                  {...form.getInputProps('strength')}
                />
              </Stack>
            </Card>

            {/* 3. 발달 영역별 관찰 - 신체운동·건강 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group align="center" mb="md">
                <IconPuzzle size={24} color="#7c3aed" />
                <Title order={3}>3. 발달 영역별 관찰</Title>
              </Group>

              <Stack gap="md">
                <div>
                  <Title order={5} mb="sm">신체운동·건강</Title>
                  <Stack>
                    <Textarea
                      label="신체활동 참여"
                      placeholder="달리기, 점프 등 대근육 활동을 즐기며, 가위질과 그리기 등 소근육 활동도 점차 발달하고 있습니다."
                      minRows={2}
                      {...form.getInputProps('physical.activity')}
                    />
                    <Textarea
                      label="건강한 생활"
                      placeholder="손 씻기, 양치질 등 기본 생활 습관이 잘 형성되어 있으며, 음식을 골고루 먹으려고 노력합니다."
                      minRows={2}
                      {...form.getInputProps('physical.health')}
                    />
                    <Textarea
                      label="안전한 생활"
                      placeholder="놀이 규칙을 잘 지키며, 위험한 상황을 인지하고 조심하는 모습을 보입니다."
                      minRows={2}
                      {...form.getInputProps('physical.safety')}
                    />
                  </Stack>
                </div>

                <Divider />

                {/* 의사소통 */}
                <div>
                  <Title order={5} mb="sm">의사소통</Title>
                  <Stack>
                    <Textarea
                      label="듣기와 말하기"
                      placeholder="친구들과 교사의 이야기를 주의 깊게 듣고, 자신의 생각과 감정을 말로 표현할 수 있습니다."
                      minRows={2}
                      {...form.getInputProps('communication.listening')}
                    />
                    <Textarea
                      label="읽기와 쓰기에 관심 가지기"
                      placeholder="그림책을 보며 글자에 관심을 보이고, 자신의 이름을 쓸 수 있습니다."
                      minRows={2}
                      {...form.getInputProps('communication.literacy')}
                    />
                    <Textarea
                      label="책과 이야기 즐기기"
                      placeholder="동화책 읽기를 좋아하고, 이야기의 내용을 기억하여 다시 말할 수 있습니다."
                      minRows={2}
                      {...form.getInputProps('communication.books')}
                    />
                  </Stack>
                </div>

                <Divider />

                {/* 사회관계 */}
                <div>
                  <Title order={5} mb="sm">사회관계</Title>
                  <Stack>
                    <Textarea
                      label="나를 알고 존중하기"
                      placeholder="자신의 감정을 인식하고 적절하게 표현하며, 스스로 할 수 있는 일을 찾아서 합니다."
                      minRows={2}
                      {...form.getInputProps('social.selfRespect')}
                    />
                    <Textarea
                      label="더불어 생활하기"
                      placeholder="친구들과 놀이할 때 차례를 기다리고, 갈등 상황에서 양보하려고 노력합니다."
                      minRows={2}
                      {...form.getInputProps('social.cooperation')}
                    />
                  </Stack>
                </div>

                <Divider />

                {/* 예술경험 */}
                <div>
                  <Title order={5} mb="sm">예술경험</Title>
                  <Stack>
                    <Textarea
                      label="아름다움 찾아보기"
                      placeholder="주변의 아름다운 것들에 관심을 가지고, 자연과 생활 속에서 아름다움을 발견합니다."
                      minRows={2}
                      {...form.getInputProps('art.aesthetics')}
                    />
                    <Textarea
                      label="창의적으로 표현하기"
                      placeholder="다양한 미술 재료를 이용해 자유롭게 표현하고, 노래와 율동을 즐깁니다."
                      minRows={2}
                      {...form.getInputProps('art.creativity')}
                    />
                  </Stack>
                </div>

                <Divider />

                {/* 자연탐구 */}
                <div>
                  <Title order={5} mb="sm">자연탐구</Title>
                  <Stack>
                    <Textarea
                      label="탐구과정 즐기기"
                      placeholder="궁금한 것을 질문하고, 직접 탐색하며 답을 찾으려고 노력합니다."
                      minRows={2}
                      {...form.getInputProps('nature.exploration')}
                    />
                    <Textarea
                      label="생활 속에서 탐구하기"
                      placeholder="일상생활에서 수와 도형에 관심을 보이고, 간단한 규칙을 이해합니다."
                      minRows={2}
                      {...form.getInputProps('nature.dailyInquiry')}
                    />
                    <Textarea
                      label="자연과 더불어 살기"
                      placeholder="동식물에 관심을 가지고 소중히 여기며, 계절의 변화를 느낍니다."
                      minRows={2}
                      {...form.getInputProps('nature.withNature')}
                    />
                  </Stack>
                </div>
              </Stack>
            </Card>

            {/* 4. 부모님께 드리는 글 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group align="center" mb="md">
                <IconHeart size={24} color="#7c3aed" />
                <Title order={3}>4. 부모님께 드리는 글</Title>
              </Group>

              <Stack>
                <Textarea
                  label="특별히 강조하고 싶은 아이의 강점이나 재능"
                  placeholder="예: 또래에 비해 언어 발달이 빠른 편이며, 자신의 생각을 명확하게 표현할 수 있습니다. 예술적 감각이 뛰어나 그림으로 이야기를 표현하는 것을 좋아합니다."
                  minRows={3}
                  {...form.getInputProps('parentMessage.strengths')}
                />
                <Textarea
                  label="가정에서 연계하여 지도하면 좋을 만한 부분"
                  placeholder="예: 책 읽기를 좋아하므로 다양한 도서를 함께 읽으며 상상력을 키워주시면 좋겠습니다. 규칙적인 생활 습관 형성을 위해 일정한 시간에 잠자리에 들도록 도와주세요."
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

         {/* 생성된 평가서 표시 영역 */}
        {report && (
          <Paper ref={reportRef} shadow="md" p="xl" radius="md" withBorder>
            <LoadingOverlay visible={isLoading} />

            <Group justify="space-between" mb="lg">
              <Title order={2}>생성된 평가서</Title>
              <Group>
                <Tooltip label="인쇄하기">
                  <ActionIcon onClick={handlePrint} variant="light" size="lg">
                    <IconPrinter size={20} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="다운로드">
                  <ActionIcon onClick={handleDownload} variant="light" size="lg">
                    <IconDownload size={20} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="공유하기">
                  <ActionIcon onClick={handleShare} variant="light" size="lg">
                    <IconShare size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            {isReportGenerated && (
              <Alert icon={<IconCheck />} color="green" mb="lg">
                평가서가 성공적으로 생성되었습니다!
                우측 상단의 버튼을 통해 인쇄하거나 공유할 수 있습니다.
              </Alert>
            )}

            <ScrollArea h={600}>
              <div
                className="prose prose-lg max-w-none"
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
                dangerouslySetInnerHTML={{
                  __html: report.replace(/\n/g, '<br />').replace(/#{1,6}\s/g, '<strong>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
              <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: 20, color: '#888' }}>
                {report}
              </pre>
            </ScrollArea>
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