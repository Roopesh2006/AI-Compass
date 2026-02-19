export interface AIModel {
  id: string;
  name: string;
  company: string;
  logoUrl: string;
  category: ModelCategory;
  tags: string[];
  bestFor: string[];
  description: string;
  freeTier: boolean;
  isOpenSource: boolean;
  speedScore: number; // 0-10
  pricing: {
    type: 'free' | 'freemium' | 'paid' | 'enterprise';
    details?: string;
  };
  contextWindow: number;
  multimodal: boolean;
  benchmarks: {
    reasoning?: number;
    coding?: number;
    writing?: number;
    speed?: number;
    cost?: number;
    lastVerified: string;
  };
  directUrl: string;
  taskScores: {
    coding: number;
    writing: number;
    reasoning: number;
    speed: number;
    cost: number;
    image: number;
    video: number;
    audio: number;
    research: number;
    chatbot: number;
    agents: number;
  };
}

export type ModelCategory = 
  | 'coding'
  | 'writing'
  | 'image'
  | 'video'
  | 'audio'
  | 'research'
  | 'chatbot'
  | 'agents'
  | 'specialized';

export interface CategoryTile {
  id: ModelCategory;
  label: string;
  icon: string;
  description: string;
}

export interface UserQuery {
  text: string;
  category?: ModelCategory;
  subIntent?: string;
}

export interface ComparisonModel {
  model: AIModel;
  selected: boolean;
}

export interface TrendingUpdate {
  id: string;
  text: string;
  type: 'ranking' | 'new' | 'update';
  timestamp: string;
}

export type FilterModifier = 'free' | 'fastest' | 'privacy' | 'multimodal' | 'longContext' | 'openSource';

export interface SearchIntent {
  category: ModelCategory;
  subIntent?: string;
  confidence: number;
}
