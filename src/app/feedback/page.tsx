// src/app/feedback/page.tsx - 최종 개선된 버전
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container, Title, Text, Paper, Textarea, Button, Group, Stack, Tabs,
  Progress, Badge, Card, Grid, Alert, Select, TextInput, Loader, Box
} from '@mantine/core';
import {
  IconUpload, IconFileText, IconCheck, IconAlertCircle, IconTarget,
  IconTrendingUp, IconDownload, IconInfoCircle, IconCalendar, IconUser,
  IconHeart, IconSparkles, IconSearch
} from '@tabler/icons-react';

// ------ 타입(가볍게) ------
type DomainDetail = {
  score: number;
  strengths: string[];
  improvements: string[];
};
type AnalysisResult = {
  overallScore: number;
  basicInfo?: { childName?: string; age?: string; className?: string };
  domainAnalysis: Record<string, DomainDetail>;
  positiveAspects: string[];
  suggestions: string[];
};

const ReportFeedbackSystem = () => {
  // 입력값
  const [uploadedText, setUploadedText] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childName, setChildName] = useState('');

  // 분석/개선 공통 상태
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'improved'>('upload');
  const [validationError, setValidationError] = useState('');

  // 분석 진행 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // 진행 중 안내 문구(분석)
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  // 개선 생성 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [currentGenerationMessage, setCurrentGenerationMessage] = useState('');
  const [generationMessageIndex, setGenerationMessageIndex] = useState(0);
  const [improvedReport, setImprovedReport] = useState('');

  // 격려 메시지들
  const encouragingMessages = [
    "AI는 글을 작성해줄 수 있지만, 선생님은 사랑을 줄 수 있습니다 💝",
    "선생님의 세심한 관찰이 아이들의 성장을 이끌어냅니다 🌱",
    "오늘도 아이들을 위해 수고하시는 선생님께 감사합니다 🙏",
    "한 아이의 성장 기록은 선생님의 소중한 노력의 결실입니다 📝",
    "아이들의 밝은 미래는 선생님의 따뜻한 마음에서 시작됩니다 ☀️",
    "평가서 하나하나에 담긴 선생님의 애정을 AI가 더욱 빛내드릴게요 ✨",
    "잠시만 기다려주세요. 선생님만큼 꼼꼼하게 분석하고 있어요 🔍"
  ];

  // 개선된 평가서 생성 중 격려 메시지들
  const generationMessages = [
    "선생님의 관찰 내용을 더욱 전문적으로 다듬고 있어요 ✍️",
    "2024 개정 표준보육과정 기준에 맞춰 개선하고 있습니다 📚",
    "구체적인 발달 사례로 풍성하게 만들어드리고 있어요 🌟",
    "선생님의 소중한 관찰을 더욱 체계적으로 정리하고 있습니다 📋",
    "전문적인 교육과정 용어로 업그레이드하고 있어요 🎯",
    "영역별 균형을 맞춰 완성도 높은 평가서로 만들어드립니다 ⚖️",
    "선생님의 교육철학이 담긴 따뜻한 평가서를 완성하고 있어요 💖"
  ];

  // 연령 옵션
  const ageOptions = [
    { value: '0', label: '만 0세 (0~11개월)' },
    { value: '1', label: '만 1세 (12~23개월)' },
    { value: '2', label: '만 2세 (24~35개월)' },
    { value: '3', label: '만 3세 (36~47개월)' },
    { value: '4', label: '만 4세 (48~59개월)' },
    { value: '5', label: '만 5세 (60~71개월)' },
    { value: '6', label: '만 6세 (72개월 이상)' }
  ];

  // 메시지 순환 효과
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % encouragingMessages.length);
      }, 3000); // 3초마다 메시지 변경

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // 개선된 평가서 생성 중 메시지 순환 효과
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationMessageIndex((prev) => (prev + 1) % generationMessages.length);
      }, 3000); // 3초마다 메시지 변경

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // 현재 메시지 업데이트
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentMessage(encouragingMessages[messageIndex]);
    }
  }, [messageIndex, isAnalyzing]);

  // 현재 생성 메시지 업데이트
  useEffect(() => {
    if (isGenerating) {
      setCurrentGenerationMessage(generationMessages[generationMessageIndex]);
    }
  }, [generationMessageIndex, isGenerating]);

  // 입력 유효성 검사
  const validateInputs = () => {
    if (!uploadedText.trim()) {
      setValidationError('평가서 내용을 입력해주세요.');
      return false;
    }
    if (uploadedText.length < 100) {
      setValidationError('분석을 위해 평가서 내용을 최소 100자 이상 입력해주세요.');
      return false;
    }
    if (!childAge) {
      setValidationError('아동의 연령을 선택해주세요. 정확한 분석을 위해 필수입니다.');
      return false;
    }
    if (!childName.trim()) {
      setValidationError('아동명을 입력해주세요.');
      return false;
    }
    setValidationError('');
    return true;
  };

  // 분석 로직 (개선된 버전)
  const analyzeReport = async () => {
    if (!validateInputs()) {
      return;
    }

    // 중복 실행 방지
    if (isAnalyzing || isAnalysisComplete) {
      return;
    }

    setIsAnalyzing(true);
    setIsAnalysisComplete(false);
    setAnalysisStartTime(Date.now());
    setMessageIndex(0);
    setCurrentMessage(encouragingMessages[0]);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportText: `[아동명: ${childName}] [나이: 만 ${childAge}세] ${uploadedText}`,
          analysisType: 'full'
        }),
      });

      if (!response.ok) {
        throw new Error(`분석 요청 실패: ${response.status}`);
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
      setIsAnalysisComplete(true);
      setActiveTab('results');

    } catch (error) {
      console.error('분석 오류:', error);
      setValidationError(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');
      setIsAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isAnalyzing) return '분석 중...';
    if (isAnalysisComplete) return '평가서 분석 완료';
    return '평가서 분석 시작';
  };

  // 버튼 색상 결정
  const getButtonColor = () => {
    if (isAnalysisComplete) return 'green';
    if (isAnalyzing) return 'blue';
    return 'indigo';
  };

  // 예상 소요 시간 계산
  const getEstimatedTime = () => {
    const wordCount = uploadedText.length;
    if (wordCount < 500) return '약 30초';
    if (wordCount < 1000) return '약 1분';
    if (wordCount < 2000) return '약 1-2분';
    return '약 2-3분';
  };

  // 개선된 평가서 생성 버튼 텍스트 결정
  const getGenerationButtonText = () => {
    if (isGenerating) return '개선된 평가서 생성 중...';
    if (isGenerationComplete) return '개선된 평가서 생성 완료';
    return '개선된 평가서 생성하기';
  };

  // 개선된 평가서 생성 버튼 색상 결정
  const getGenerationButtonColor = () => {
    if (isGenerationComplete) return 'green';
    if (isGenerating) return 'blue';
    return 'indigo';
  };

  // 예상 생성 시간 계산
  const getEstimatedGenerationTime = () => {
    const wordCount = uploadedText.length;
    if (wordCount < 500) return '약 1분';
    if (wordCount < 1000) return '약 1-2분';
    if (wordCount < 2000) return '약 2-3분';
    return '약 3-4분';
  };

  // 개선된 평가서 생성
  const generateImprovement = async () => {
    if (!analysis) return;

    // 중복 실행 방지
    if (isGenerating || isGenerationComplete) {
      return;
    }

    setIsGenerating(true);
    setIsGenerationComplete(false);
    setGenerationMessageIndex(0);
    setCurrentGenerationMessage(generationMessages[0]);

    try {
      const response = await fetch('/api/improve-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalReport: uploadedText,
          analysisResult: analysis,
          improvementLevel: 'comprehensive'
        }),
      });

      if (!response.ok) {
        throw new Error('개선 요청 실패');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('스트림 읽기 실패');

      const decoder = new TextDecoder();
      let buffer = '';
      let improvedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') {
              setImprovedReport(improvedContent);
              setIsGenerationComplete(true);
              setActiveTab('improved');
              return;
            }
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  improvedContent += data.text;
                  setImprovedReport(improvedContent);
                }
              } catch (e) {
                // JSON 파싱 실패 시 무시
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('개선 오류:', error);
      setImprovedReport(`# 개선된 평가서\n\n죄송합니다. 개선 과정에서 오류가 발생했습니다.\n다시 시도해주세요.`);
      setIsGenerationComplete(false);
      setActiveTab('improved');
    } finally {
      setIsGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 80) return 'blue';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  const getAgeGroupInfo = (age: string) => {
    const ageNum = parseInt(age);
    if (ageNum <= 2) {
      return {
        group: '영아',
        curriculum: '2024 개정 표준보육과정',
        domains: ['신체운동·건강', '의사소통', '사회관계 (2개 세부영역)', '예술경험 (2개 세부영역)', '자연탐구'],
        note: '영아기는 급속한 발달이 일어나는 시기로, 세밀한 관찰이 중요합니다.'
      };
    } else {
      return {
        group: '유아',
        curriculum: '2024 개정 표준보육과정 및 누리과정',
        domains: ['신체운동·건강', '의사소통', '사회관계 (3개 세부영역)', '예술경험 (3개 세부영역)', '자연탐구'],
        note: '유아기는 사회성과 예술 감상 능력이 확장되는 시기입니다.'
      };
    }
  };

  return (
    <Container size="lg" py="xl">
      {/* 헤더 */}
      <Paper p="xl" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>

        <Stack align="center" gap="md">

          <IconSearch size={48} />
          <Title order={1} ta="center" size="h2">
            AI 평가서 피드백 시스템
          </Title>
          <Text ta="center" size="lg" opacity={0.9}>
            기존 평가서를 업로드하여 2024 개정 표준보육과정 기준으로 피드백받고 개선하세요
          </Text>
          <Group>
            <Badge color="rgba(255,255,255,0.2)" size="lg">보육교사 전문 도구</Badge>
            <Badge color="rgba(255,255,255,0.2)" size="lg">연령별 맞춤 분석</Badge>
          </Group>
        </Stack>
      </Paper>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
        <Tabs.List grow>
          <Tabs.Tab value="upload" leftSection={<IconUpload size={16} />}>
            평가서 업로드 및 정보 입력
          </Tabs.Tab>
          <Tabs.Tab value="results" leftSection={<IconTarget size={16} />} disabled={!analysis}>
            분석 결과
          </Tabs.Tab>
          <Tabs.Tab value="improved" leftSection={<IconTrendingUp size={16} />} disabled={!improvedReport}>
            개선된 평가서
          </Tabs.Tab>
        </Tabs.List>

        {/* 업로드 및 정보 입력 탭 */}
        <Tabs.Panel value="upload">
          <Stack gap="lg">
            {/* 연령 정보 입력의 중요성 안내 */}
            <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
              <Text fw={500} mb="xs">정확한 분석을 위해 연령 정보가 필수입니다</Text>
              <Text size="sm">
                • <strong>0~2세</strong>: 영아기 발달 특성 (사회관계 2개, 예술경험 2개 세부영역)<br/>
                • <strong>3~5세</strong>: 유아기 누리과정 (사회관계 3개, 예술경험 3개 세부영역 - 사회관심, 예술감상 추가)<br/>
                • 연령별로 평가 기준과 발달 영역이 달라 정확한 연령 정보 없이는 적절한 분석이 불가능합니다.
              </Text>
            </Alert>

            {/* 아동 기본 정보 입력 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="md">
                <IconUser size={24} color="var(--mantine-color-indigo-6)" />
                <Title order={3}>아동 기본 정보</Title>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="아동명"
                    placeholder="아동의 이름을 입력하세요"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    required
                    leftSection={<IconUser size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="아동 연령"
                    placeholder="아동의 연령을 선택하세요"
                    data={ageOptions}
                    value={childAge}
                    onChange={(value) => setChildAge(value || '')}
                    required
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
              </Grid>

              {/* 선택된 연령에 따른 정보 표시 */}
              {childAge && (
                <Alert variant="light" color="green" mt="md">
                  <Text fw={500}>선택된 연령: 만 {childAge}세 ({getAgeGroupInfo(childAge).group})</Text>
                  <Text size="sm" mt="xs">
                    <strong>적용 기준:</strong> {getAgeGroupInfo(childAge).curriculum}<br/>
                    <strong>평가 영역:</strong> {getAgeGroupInfo(childAge).domains.join(', ')}<br/>
                    <strong>특징:</strong> {getAgeGroupInfo(childAge).note}
                  </Text>
                </Alert>
              )}
            </Card>

            {/* 평가서 텍스트 입력 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                <Group>
                  <IconFileText size={20} />
                  기존 평가서 내용
                </Group>
              </Title>

              <Textarea
                placeholder={`기존에 작성된 평가서 내용을 붙여넣어 주세요.

예시:
1. 전반적인 아동 특성 및 어린이집 생활 적응
...

2. 영역별 발달 관찰 내용
가. 신체운동 및 건강
...
나. 의사소통
...
다. 사회관계
...
라. 예술경험
...
마. 자연탐구
...

3. 부모님께 전달하고 싶은 특별한 내용
...

분석을 위해 최소 100자 이상 입력해주세요.`}
                value={uploadedText}
                onChange={(e) => setUploadedText(e.target.value)}
                minRows={8}
                maxRows={15}
                autosize
              />

              <Group justify="space-between" mt="xs">
                <Text size="xs" c="dimmed">
                  {uploadedText.length}/100자 이상 (현재: {uploadedText.length}자)
                </Text>
                {uploadedText.length > 0 && (
                  <Text size="xs" c="blue">
                    예상 분석 시간: {getEstimatedTime()}
                  </Text>
                )}
              </Group>
            </Card>

            {validationError && (
              <Alert variant="light" color="red" mt="md" icon={<IconAlertCircle />}>
                {validationError}
              </Alert>
            )}

            {/* 분석 시작 버튼 */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {isAnalyzing && (
                <Box mb="md">
                  <Group justify="center" gap="md">
                    <Loader size="md" color="blue" />
                    <div>
                      <Text fw={500} size="lg" ta="center">
                        평가서를 꼼꼼히 분석하고 있어요
                      </Text>
                      <Text size="sm" c="dimmed" ta="center" mt="xs">
                        예상 소요 시간: {getEstimatedTime()}
                      </Text>
                    </div>
                  </Group>

                  <Box
                    mt="md"
                    p="md"
                    style={{
                      backgroundColor: 'var(--mantine-color-blue-0)',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <Group justify="center" gap="xs" mb="xs">
                      <IconHeart size={16} color="var(--mantine-color-red-6)" />
                      <IconSparkles size={16} color="var(--mantine-color-yellow-6)" />
                    </Group>
                    <Text
                      size="sm"
                      fw={500}
                      style={{
                        color: 'var(--mantine-color-blue-7)',
                        lineHeight: 1.4,
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {currentMessage}
                    </Text>
                  </Box>
                </Box>
              )}

              <Button
                fullWidth
                size="lg"
                color={getButtonColor()}
                onClick={analyzeReport}
                disabled={isAnalyzing || isAnalysisComplete}
                leftSection={
                  isAnalysisComplete ? <IconCheck size={20} /> :
                  isAnalyzing ? <Loader size={20} /> :
                  <IconTarget size={20} />
                }
              >
                {getButtonText()}
              </Button>

              {isAnalysisComplete && (
                <Alert variant="light" color="green" mt="md" icon={<IconCheck />}>
                  <Text fw={500}>분석이 완료되었습니다!</Text>
                  <Text size="sm" mt="xs">
                    분석 결과 탭에서 상세한 피드백을 확인하세요.
                    다른 평가서를 분석하려면 페이지를 새로고침하세요.
                  </Text>
                </Alert>
              )}
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* 분석 결과 탭 */}
        <Tabs.Panel value="results">
          {analysis && (
            <Stack gap="lg">
              {/* 분석 기준 안내 */}
              <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
                <Text fw={500} mb="xs">📊 분석 점수에 대한 안내</Text>
                <Text size="sm">
                  이 점수는 <strong>아동의 발달 수준</strong>이 아닌, <strong>선생님이 작성하신 평가서의 품질</strong>을 평가한 것입니다.<br/>
                  다음 4가지 기준으로 평가서의 전문성을 분석합니다:
                </Text>
                <ul style={{ marginTop: '0.5rem', fontSize: 'var(--mantine-font-size-sm)' }}>
                  <li><strong>2024 개정 표준보육과정 반영도:</strong> 최신 교육과정 기준 용어와 영역 구조 활용</li>
                  <li><strong>발달 영역 균형성:</strong> 5개 영역(신체운동·건강, 의사소통, 사회관계, 예술경험, 자연탐구)이 고르게 기술되었는지</li>
                  <li><strong>구체적 행동 사례:</strong> "잘한다"가 아닌 "○○ 상황에서 ○○하는 모습" 형태의 구체적 관찰 내용</li>
                  <li><strong>전문적 용어 사용:</strong> 발달적 의미 해석과 교육과정 전문 용어의 적절한 활용</li>
                </ul>
              </Alert>

              {/* 전체 점수 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>전체 분석 결과</Title>
                  <Badge size="xl" color={getScoreColor(analysis.overallScore)}>
                    {analysis.overallScore}점
                  </Badge>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text><strong>아동명:</strong> {analysis.basicInfo?.childName || childName}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text><strong>연령:</strong> {analysis.basicInfo?.age || `만 ${childAge}세`}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text><strong>반명:</strong> {analysis.basicInfo?.className || '-'}</Text>
                  </Grid.Col>
                </Grid>

                <Progress
                  value={analysis.overallScore}
                  color={getScoreColor(analysis.overallScore)}
                  size="xl"
                  mt="md"
                />
              </Card>

              {/* 영역별 분석 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>영역별 세부 분석</Title>
                  <Badge size="sm" variant="light" color="blue">
                    {childAge ? `만 ${childAge}세 기준` : '연령별 기준'}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mb="md">
                  각 영역별로 평가서의 기술 수준을 분석한 결과입니다. 점수가 높을수록 해당 영역이 전문적이고 구체적으로 기술되었음을 의미합니다.
                </Text>

                <Grid>
                  {Object.entries(analysis.domainAnalysis).map(([domain, data]: [string, DomainDetail]) => (
                    <Grid.Col span={{ base: 12, md: 6 }} key={domain}>
                      <Paper p="md" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500}>{domain}</Text>
                          <Badge color={getScoreColor(data.score)}>{data.score}점</Badge>
                        </Group>

                        <Text size="sm" c="green" mb="xs">
                          <strong>강점:</strong>
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                          {data.strengths.map((strength: string, idx: number) => (
                            <li key={idx} style={{ fontSize: 'var(--mantine-font-size-sm)' }}>
                              {strength}
                            </li>
                          ))}
                        </ul>

                        <Text size="sm" c="orange" mt="xs" mb="xs">
                          <strong>개선사항:</strong>
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                          {data.improvements.map((improvement: string, idx: number) => (
                            <li key={idx} style={{ fontSize: 'var(--mantine-font-size-sm)' }}>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Card>

              {/* 우수한 점 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">✨ 현재 평가서의 우수한 점</Title>
                <Text size="sm" c="dimmed" mb="md">
                  작성하신 평가서에서 발견된 강점과 잘 작성된 부분들입니다.
                </Text>
                <ul>
                  {analysis.positiveAspects.map((aspect: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                      {aspect}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 개선 제안 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">📝 평가서 작성 개선 제안</Title>
                <Text size="sm" c="dimmed" mb="md">
                  더욱 전문적이고 완성도 높은 평가서 작성을 위한 구체적인 제안사항입니다.
                </Text>
                <ul>
                  {analysis.suggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 종합 안내 */}
              <Alert variant="light" color="blue">
                <Text fw={500} mb="xs">💡 평가서 개선 활용 방법</Text>
                <Text size="sm">
                  1. <strong>개선 제안</strong>을 참고하여 부족한 영역을 보완해보세요<br/>
                  2. <strong>우수한 점</strong>은 다른 평가서 작성 시에도 계속 활용하세요<br/>
                  3. 아래 "개선된 평가서 생성하기" 버튼으로 AI가 제안하는 개선 버전을 확인할 수 있습니다<br/>
                  4. 생성된 개선 버전을 참고하여 본인만의 스타일로 재작성해보세요
                </Text>
              </Alert>

              {/* 개선된 평가서 생성 버튼 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                {isGenerating && (
                  <Box mb="md">
                    <Group justify="center" gap="md">
                      <Loader size="md" color="blue" />
                      <div>
                        <Text fw={500} size="lg" ta="center">
                          개선된 평가서를 생성하고 있어요
                        </Text>
                        <Text size="sm" c="dimmed" ta="center" mt="xs">
                          예상 소요 시간: {getEstimatedGenerationTime()}
                        </Text>
                      </div>
                    </Group>

                    <Box
                      mt="md"
                      p="md"
                      style={{
                        backgroundColor: 'var(--mantine-color-green-0)',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <Group justify="center" gap="xs" mb="xs">
                        <IconSparkles size={16} color="var(--mantine-color-green-6)" />
                        <IconFileText size={16} color="var(--mantine-color-blue-6)" />
                      </Group>
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: 'var(--mantine-color-green-7)',
                          lineHeight: 1.4,
                          minHeight: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {currentGenerationMessage}
                      </Text>
                    </Box>
                  </Box>
                )}

                <Button
                  fullWidth
                  size="lg"
                  color={getGenerationButtonColor()}
                  onClick={generateImprovement}
                  disabled={isGenerating || isGenerationComplete}
                  leftSection={
                    isGenerationComplete ? <IconCheck size={20} /> :
                    isGenerating ? <Loader size={20} /> :
                    <IconTrendingUp size={20} />
                  }
                >
                  {getGenerationButtonText()}
                </Button>

                {isGenerationComplete && (
                  <Alert variant="light" color="green" mt="md" icon={<IconCheck />}>
                    <Text fw={500}>개선된 평가서 생성이 완료되었습니다!</Text>
                    <Text size="sm" mt="xs">
                      개선된 평가서 탭에서 결과를 확인하세요.
                      다른 평가서를 개선하려면 페이지를 새로고침하세요.
                    </Text>
                  </Alert>
                )}
              </Card>
            </Stack>
          )}
        </Tabs.Panel>

        {/* 개선된 평가서 탭 */}
        <Tabs.Panel value="improved">
          {improvedReport && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>개선된 평가서</Title>
                <Button
                  leftSection={<IconDownload size={16} />}
                  onClick={() => {
                    const blob = new Blob([improvedReport], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `개선된_평가서_${childName || '아동'}_${new Date().toISOString().split('T')[0]}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  다운로드
                </Button>
              </Group>

              <Paper p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {improvedReport}
                </Text>
              </Paper>
            </Card>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default ReportFeedbackSystem;