// src/app/feedback/page.tsx (기존 로직 + Mantine 스타일)
'use client';

import React, { useState } from 'react';
import { Container, Title, Text, Paper, Textarea, Button, Group, Stack, Tabs, Progress, Badge, Card, Grid } from '@mantine/core';
import { IconUpload, IconFileText, IconCheck, IconAlertCircle, IconTarget, IconTrendingUp, IconDownload } from '@tabler/icons-react';

const ReportFeedbackSystem = () => {
  const [uploadedText, setUploadedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [improvedReport, setImprovedReport] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  // 기존 분석 로직 그대로 유지
  const analyzeReport = async (reportText) => {
    setIsAnalyzing(true);

    try {
      const analysisPrompt = `
당신은 아동발달 전문가입니다. 업로드된 평가서를 2024 개정 표준보육과정 기준으로 분석하고 피드백해주세요.

[업로드된 평가서]
${reportText}

다음 JSON 형식으로 분석 결과를 제공해주세요:

{
  "basicInfo": {
    "childName": "추출된 아동명",
    "age": "추출된 나이",
    "className": "추출된 반명"
  },
  "overallScore": 85,
  "domainAnalysis": {
    "신체운동건강": {
      "score": 80,
      "strengths": ["운동능력 우수", "구체적 사례 풍부"],
      "improvements": ["안전생활 부분 보완 필요"]
    },
    "의사소통": {
      "score": 90,
      "strengths": ["언어발달 상세 기술", "책 활동 구체적"],
      "improvements": []
    },
    "사회관계": {
      "score": 85,
      "strengths": ["친구관계 잘 관찰됨"],
      "improvements": ["자아존중 영역 추가 필요"]
    },
    "예술경험": {
      "score": 75,
      "strengths": ["창의성 언급"],
      "improvements": ["감상 활동 사례 부족"]
    },
    "자연탐구": {
      "score": 80,
      "strengths": ["호기심 잘 표현"],
      "improvements": ["수학적 사고 관련 내용 추가"]
    }
  },
  "suggestions": [
    "안전하게 생활하기 영역에 구체적 사례 추가 권장",
    "예술 감상 활동 관련 관찰 내용 보완",
    "수학적 사고력 발달 상황 추가 기술"
  ],
  "positiveAspects": [
    "전문용어 적절히 사용",
    "아동의 강점 잘 부각",
    "부모에게 따뜻한 어조로 전달"
  ]
}

JSON만 반환하고 다른 설명은 생략해주세요.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: analysisPrompt }]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;

      responseText = responseText.replace(/```json\s?/g, "").replace(/```\s?/g, "").trim();
      const analysisResult = JSON.parse(responseText);

      setAnalysis(analysisResult);
      setActiveTab('results');

    } catch (error) {
      console.error('분석 오류:', error);
      // 샘플 데이터로 대체 (기존 로직 그대로)
      setAnalysis({
        basicInfo: {
          childName: "분석된 아동",
          age: "만 4세 2개월",
          className: "해바라기반"
        },
        overallScore: 82,
        domainAnalysis: {
          "신체운동건강": {
            score: 85,
            strengths: ["대근육 발달 우수하게 기술", "구체적 운동 사례 풍부"],
            improvements: ["안전생활 영역 세부 사례 보완 필요"]
          },
          "의사소통": {
            score: 90,
            strengths: ["언어 발달 상황 상세히 관찰", "책 읽기 활동 구체적"],
            improvements: []
          },
          "사회관계": {
            score: 78,
            strengths: ["또래관계 관찰 우수"],
            improvements: ["자아존중감 발달 부분 추가 필요", "갈등해결 과정 사례 보완"]
          },
          "예술경험": {
            score: 75,
            strengths: ["창의적 표현 활동 언급"],
            improvements: ["예술 감상 활동 사례 부족", "음악 활동 관련 내용 보완"]
          },
          "자연탐구": {
            score: 80,
            strengths: ["호기심과 탐구력 잘 표현"],
            improvements: ["수학적 사고 발달 상황 추가", "과학적 탐구 과정 세분화"]
          }
        },
        suggestions: [
          "안전하게 생활하기 영역에 실제 안전 규칙 준수 사례 추가",
          "예술 감상 활동(그림 보기, 음악 듣기 등) 관련 구체적 관찰 내용 보완",
          "수와 연산, 공간과 도형 관련 수학적 사고 발달 상황 추가",
          "과학적 탐구 과정(예측-실험-결론)의 단계별 관찰 내용 세분화"
        ],
        positiveAspects: [
          "2024 개정 표준보육과정의 5개 영역이 모두 포함됨",
          "전문용어를 적절히 사용하여 교사의 전문성이 드러남",
          "아동의 개별적 특성과 강점이 잘 부각됨",
          "부모가 이해하기 쉬운 따뜻하고 구체적인 어조로 작성됨"
        ]
      });
      setActiveTab('results');
    }

    setIsAnalyzing(false);
  };

  // 기존 개선된 평가서 생성 로직 그대로 유지
  const generateImprovedReport = async () => {
    if (!analysis) return;

    const improvementPrompt = `
기존 평가서를 바탕으로 2024 개정 표준보육과정에 더욱 부합하는 개선된 평가서를 작성해주세요.

[원본 평가서]
${uploadedText}

[개선 사항]
${analysis.suggestions.map(s => `- ${s}`).join('\n')}

기존 평가서의 좋은 부분은 유지하되, 위의 개선사항을 반영하여 더욱 완성도 높은 평가서로 재작성해주세요.
2024 개정 표준보육과정의 5개 영역이 균형있게 포함되도록 하고, 전문적이면서 따뜻한 어조를 유지해주세요.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: improvementPrompt }]
        })
      });

      const data = await response.json();
      setImprovedReport(data.content[0].text);
      setActiveTab('improved');

    } catch (error) {
      console.error('개선 오류:', error);
      setImprovedReport(`
## 개선된 아동발달 평가서

**아동명:** ${analysis.basicInfo.childName}
**현재 연령:** ${analysis.basicInfo.age}
**반명:** ${analysis.basicInfo.className}

[샘플 개선된 평가서 내용...]
      `);
      setActiveTab('improved');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'green';
    if (score >= 80) return 'blue';
    if (score >= 70) return 'yellow';
    return 'red';
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
      </Stack>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
        <Tabs.List grow>
          <Tabs.Tab value="upload" leftSection={<IconUpload size={16} />}>
            평가서 업로드
          </Tabs.Tab>
          <Tabs.Tab value="results" leftSection={<IconTarget size={16} />} disabled={!analysis}>
            분석 결과
          </Tabs.Tab>
          <Tabs.Tab value="improved" leftSection={<IconTrendingUp size={16} />} disabled={!improvedReport}>
            개선된 평가서
          </Tabs.Tab>
        </Tabs.List>

        {/* 업로드 탭 */}
        <Tabs.Panel value="upload">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Title order={3}>평가서 텍스트 입력</Title>
              <Textarea
                value={uploadedText}
                onChange={(e) => setUploadedText(e.target.value)}
                placeholder="기존에 작성하신 평가서 내용을 여기에 붙여넣어 주세요..."
                minRows={15}
                maxRows={20}
              />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  최소 500자 이상 입력해주세요 (현재: {uploadedText.length}자)
                </Text>
                <Button
                  onClick={() => analyzeReport(uploadedText)}
                  disabled={uploadedText.length < 500 || isAnalyzing}
                  loading={isAnalyzing}
                  leftSection={<IconTarget size={16} />}
                >
                  AI 분석 시작
                </Button>
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 분석 결과 탭 */}
        <Tabs.Panel value="results">
          {analysis && (
            <Stack gap="lg">
              {/* 전체 점수 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>전체 평가</Title>
                  <Group>
                    <Text size="xl" fw={700} c={getScoreColor(analysis.overallScore)}>
                      {analysis.overallScore}점
                    </Text>
                    <Badge color={getScoreColor(analysis.overallScore)} variant="light">
                      {analysis.overallScore >= 90 ? '우수' : analysis.overallScore >= 80 ? '양호' : '보통'}
                    </Badge>
                  </Group>
                </Group>
                <Progress value={analysis.overallScore} color={getScoreColor(analysis.overallScore)} size="lg" />
              </Card>

              {/* 영역별 분석 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">영역별 분석</Title>
                <Grid>
                  {Object.entries(analysis.domainAnalysis).map(([domain, data]) => (
                    <Grid.Col key={domain} span={{ base: 12, md: 6, lg: 4 }}>
                      <Paper p="md" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500}>{domain}</Text>
                          <Badge color={getScoreColor(data.score)} variant="light">
                            {data.score}점
                          </Badge>
                        </Group>

                        {data.strengths.length > 0 && (
                          <Stack gap="xs" mb="sm">
                            <Text size="sm" fw={500} c="green">✓ 우수한 부분</Text>
                            {data.strengths.map((strength, idx) => (
                              <Text key={idx} size="xs" c="green">• {strength}</Text>
                            ))}
                          </Stack>
                        )}

                        {data.improvements.length > 0 && (
                          <Stack gap="xs">
                            <Text size="sm" fw={500} c="orange">⚡ 개선 포인트</Text>
                            {data.improvements.map((improvement, idx) => (
                              <Text key={idx} size="xs" c="orange">• {improvement}</Text>
                            ))}
                          </Stack>
                        )}
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Card>

              {/* 피드백 */}
              <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group mb="md">
                      <IconAlertCircle size={20} color="var(--mantine-color-orange-6)" />
                      <Title order={4}>개선 제안사항</Title>
                    </Group>
                    <Stack gap="sm">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <Group key={idx} gap="sm" align="flex-start">
                          <Badge size="sm" variant="outline" color="orange">{idx + 1}</Badge>
                          <Text size="sm">{suggestion}</Text>
                        </Group>
                      ))}
                    </Stack>
                    <Button
                      onClick={generateImprovedReport}
                      mt="md"
                      fullWidth
                      leftSection={<IconTrendingUp size={16} />}
                      color="orange"
                    >
                      개선된 평가서 생성하기
                    </Button>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group mb="md">
                      <IconCheck size={20} color="var(--mantine-color-green-6)" />
                      <Title order={4}>우수한 부분</Title>
                    </Group>
                    <Stack gap="sm">
                      {analysis.positiveAspects.map((aspect, idx) => (
                        <Group key={idx} gap="sm" align="flex-start">
                          <IconCheck size={16} color="var(--mantine-color-green-6)" />
                          <Text size="sm">{aspect}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
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
                  variant="light"
                  onClick={() => {
                    const printContent = `
                      <html>
                        <head>
                          <title>개선된 아동발달 평가서</title>
                          <style>
                            body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 20px; }
                            h1, h2, h3 { color: #1c7ed6; }
                          </style>
                        </head>
                        <body>
                          <div style="white-space: pre-wrap;">${improvedReport}</div>
                        </body>
                      </html>
                    `;
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(printContent);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                >
                  인쇄/저장
                </Button>
              </Group>

              <Paper p="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Text component="pre" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
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