import { AgeCalculation, ChildData } from './types';

export function calculateAge(birthDate: string): AgeCalculation {
  const birth = new Date(birthDate);
  const today = new Date();

  let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12;
  ageInMonths -= birth.getMonth();
  ageInMonths += today.getMonth();

  if (today.getDate() < birth.getDate()) {
    ageInMonths--;
  }

  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  return {
    years,
    months,
    totalMonths: ageInMonths
  };
}

export function formatAgeText(age: AgeCalculation): string {
  if (age.totalMonths < 0) return '유효하지 않은 날짜입니다.';
  return `만 ${age.years}세 (${age.totalMonths}개월)`;
}

export function validateChildData(data: Partial<ChildData>): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('아동명을 입력해주세요.');
  if (!data.birthDate) errors.push('생년월일을 입력해주세요.');
  if (!data.className?.trim()) errors.push('반명을 입력해주세요.');
  if (!data.temperament?.trim() || data.temperament.length < 10) {
    errors.push('기질 및 적응도를 10자 이상 상세히 입력해주세요.');
  }
  if (!data.strength?.trim() || data.strength.length < 10) {
    errors.push('주요 강점을 10자 이상 상세히 입력해주세요.');
  }

  return errors;
}

export async function* streamReport(formData: ChildData) {
  try {
    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              yield data.text;
            }
          } catch (parseError) {
            console.warn('Failed to parse stream data:', line);
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    yield '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}