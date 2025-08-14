export interface ChildData {
  name: string;
  birthDate: string;
  className: string;
  temperament: string;
  strength: string;
  physical: {
    activity: string;
    health: string;
    safety: string;
  };
  communication: {
    listening: string;
    literacy: string;
    books: string;
  };
  social: {
    selfRespect: string;
    cooperation: string;
    societyInterest?: string; // 만 3~5세만 사용되는 옵셔널 필드
  };
  art: {
    aesthetics: string;
    creativity: string;
    appreciation?: string; // 만 3~5세만 사용되는 옵셔널 필드
  };
  nature: {
    exploration: string;
    dailyInquiry: string;
    withNature: string;
  };
  parentMessage: {
    strengths: string;
    homeSupport: string;
  };
}

export interface AgeCalculation {
  years: number;
  months: number;
  totalMonths: number;
}

export interface StreamResponse {
  text: string;
}

export interface ApiError {
  error: string;
  details?: string;
}