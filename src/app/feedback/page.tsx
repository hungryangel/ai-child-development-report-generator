// src/app/feedback/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Container, Title, Text, Paper, Textarea, Button, Group, Stack, Tabs,
  Progress, Badge, Card, Grid, Alert, Select, TextInput
} from '@mantine/core';
import {
  IconUpload, IconFileText, IconCheck, IconAlertCircle, IconTarget,
  IconTrendingUp, IconDownload, IconInfoCircle, IconCalendar, IconUser
} from '@tabler/icons-react';

const ReportFeedbackSystem = () => {
  const [uploadedText, setUploadedText] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childName, setChildName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [improvedReport, setImprovedReport] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [validationError, setValidationError] = useState('');

  // 연령 옵션 (실제 개월수까지 세분화)
  const ageOptions = [
    { value: '0', label: '만 0세 (0~11개월)' },
    { value: '1', label: '만 1세 (12~23개월)' },
    { value: '2', label: '만 2세 (24~35개월)' },
    { value: '3', label: '만 3세 (36~47개월)' },
    { value: '4', label: '만 4세 (48~59개월)' },
    { value: '5', label: '만 5세 (60~71개월)' },
    { value: '6', label: '만 6세 (72개월 이상)' }
  ];

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

  // 분석 로직 (연령 정보 포함)
  const analyzeReport = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsAnalyzing(true);

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
      setActiveTab('results');

    } catch (error) {
      console.error('분석 오류:', error);
      setValidationError(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 개선된 평가서 생성
  const generateImprovement = async () => {
    if (!analysis) return;

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
      setActiveTab('improved');
    }
  };

  const getScoreColor = (score) => {
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
    <Container size="xl" py="xl">
      {/* 헤더 */}
      <Stack align="center" mb="xl">
        <Group>
          <IconFileText size={32} color="var(--mantine-color-indigo-6)" />
          <Title order={1} c="indigo">AI 평가서 피드백 시스템</Title>
        </Group>
        <Text size="lg" c="dimmed" ta="center">
          기존 평가서를 업로드하여 2024 개정 표준보육과정 기준으로 피드백받고 개선하세요
        </Text>
        <Group>
          <Badge size="lg" variant="light" color="indigo">보육교사 전문 도구</Badge>
          <Badge size="lg" variant="light" color="green">연령별 맞춤 분석</Badge>
        </Group>
      </Stack>

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
                    placeholder="연령을 선택하세요"
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
              <Title order={3} mb="md">평가서 내용 입력</Title>
              <Textarea
                value={uploadedText}
                onChange={(e) => setUploadedText(e.target.value)}
                placeholder="기존에 작성하신 평가서 내용을 여기에 붙여넣어 주세요..."
                minRows={15}
                maxRows={20}
                description={`현재 ${uploadedText.length}자 (최소 100자 필요)`}
              />

              {validationError && (
                <Alert variant="light" color="red" mt="md" icon={<IconAlertCircle />}>
                  {validationError}
                </Alert>
              )}

              <Button
                fullWidth
                size="md"
                mt="lg"
                onClick={analyzeReport}
                loading={isAnalyzing}
                disabled={!uploadedText.trim() || !childAge || !childName.trim()}
                leftSection={<IconTarget size={16} />}
              >
                {isAnalyzing ? '분석 중...' : '평가서 분석 시작'}
              </Button>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* 분석 결과 탭 */}
        <Tabs.Panel value="results">
          {analysis && (
            <Stack gap="lg">
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
                    <Text><strong>아동명:</strong> {analysis.basicInfo.childName}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text><strong>연령:</strong> {analysis.basicInfo.age}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text><strong>반명:</strong> {analysis.basicInfo.className}</Text>
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
                <Title order={3} mb="md">영역별 세부 분석</Title>
                <Grid>
                  {Object.entries(analysis.domainAnalysis).map(([domain, data]) => (
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
                          {data.strengths.map((strength, idx) => (
                            <li key={idx} style={{ fontSize: 'var(--mantine-font-size-sm)' }}>
                              {strength}
                            </li>
                          ))}
                        </ul>

                        <Text size="sm" c="orange" mt="xs" mb="xs">
                          <strong>개선사항:</strong>
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                          {data.improvements.map((improvement, idx) => (
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

              {/* 개선 제안 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">구체적 개선 제안</Title>
                <ul>
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 우수한 점 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">현재 평가서의 우수한 점</Title>
                <ul>
                  {analysis.positiveAspects.map((aspect, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                      {aspect}
                    </li>
                  ))}
                </ul>
              </Card>

              <Button
                fullWidth
                size="lg"
                onClick={generateImprovement}
                leftSection={<IconTrendingUp size={20} />}
              >
                개선된 평가서 생성하기
              </Button>
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