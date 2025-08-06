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
  console.log('streamReport 함수 시작');

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

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('스트림 완료');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();

            if (dataStr === '[DONE]') {
              console.log('스트림 종료 신호 수신');
              return;
            }

            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  console.log('텍스트 청크 수신:', data.text.substring(0, 50) + '...');
                  yield data.text;
                }
              } catch (parseError) {
                console.warn('JSON 파싱 실패:', dataStr.substring(0, 100));
                // 파싱 오류가 있어도 계속 진행
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

  } catch (error) {
    console.error('스트림 오류:', error);

    if (error instanceof Error) {
      yield `오류가 발생했습니다: ${error.message}`;
    } else {
      yield '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }
}