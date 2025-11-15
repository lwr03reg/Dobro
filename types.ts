
export enum WorkflowStage {
  TRENDS = 'TRENDS',
  DRAFT = 'DRAFT',
  VALIDATE = 'VALIDATE',
  ENRICH = 'ENRICH',
  PACKAGE = 'PACKAGE',
  REVIEW = 'REVIEW',
  DEPLOY = 'DEPLOY',
}

export interface TrendingTopic {
  topic: string;
  category: string;
  icon: string;
  description?: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface GuideStep {
  what: string;
  how: string;
  tool: string;
  example: string;
}

export interface Guide {
  topic: string;
  title: string;
  quote: string;
  steps: GuideStep[];
  quick_action: string;
  mistakes: string[];
  bonus: string;
  checklist?: string[];
  quiz?: QuizQuestion[];
}

export interface MarketingKit {
  socialPosts: string[];
  email: string;
  ozonDescription: string;
}

export interface GuidePackage {
  pdf: string;
  cover: string;
  metadata: {
    title: string;
    description: string;
    price: number;
  };
}

export interface OzonMetadata {
    name: string;
    description_rich: string;
    category_id_suggestions: number[];
    keywords: string[];
    price: number;
    vat: string;
}


export interface PublicationInfo {
  ozonId: string;
  telegramMessage: string;
  ozonMetadata: OzonMetadata;
  miniAppManifest: string;
}

export interface ErrorLogEntry {
  message: string;
  timestamp: string;
  stage: WorkflowStage;
}

export interface LogEntry {
  topic: string;
  ozonId: string;
  date: string;
}