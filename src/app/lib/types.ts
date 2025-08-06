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
  };
  art: {
    aesthetics: string;
    creativity: string;
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