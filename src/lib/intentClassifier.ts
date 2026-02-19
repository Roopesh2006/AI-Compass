import type { ModelCategory, SearchIntent } from '@/types';
import { keywordIntentMap } from '@/data/models';

export function classifyIntent(query: string): SearchIntent {
  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery.split(/\s+/);

  // Check for multi-word matches first
  for (let i = words.length; i > 0; i--) {
    for (let j = 0; j <= words.length - i; j++) {
      const phrase = words.slice(j, j + i).join(' ');
      if (keywordIntentMap[phrase]) {
        return {
          category: keywordIntentMap[phrase].category,
          subIntent: keywordIntentMap[phrase].subIntent,
          confidence: 0.8 + (i * 0.05), // Higher confidence for longer matches
        };
      }
    }
  }

  // Check individual words
  const categoryScores: Record<ModelCategory, { score: number; subIntent?: string }> = {
    coding: { score: 0 },
    writing: { score: 0 },
    image: { score: 0 },
    video: { score: 0 },
    audio: { score: 0 },
    research: { score: 0 },
    chatbot: { score: 0 },
    agents: { score: 0 },
    specialized: { score: 0 },
  };

  words.forEach(word => {
    if (keywordIntentMap[word]) {
      const mapping = keywordIntentMap[word];
      categoryScores[mapping.category].score += 1;
      if (mapping.subIntent) {
        categoryScores[mapping.category].subIntent = mapping.subIntent;
      }
    }
  });

  // Find highest scoring category
  let bestCategory: ModelCategory = 'chatbot';
  let bestScore = 0;
  let bestSubIntent: string | undefined;

  (Object.keys(categoryScores) as ModelCategory[]).forEach(category => {
    if (categoryScores[category].score > bestScore) {
      bestScore = categoryScores[category].score;
      bestCategory = category;
      bestSubIntent = categoryScores[category].subIntent;
    }
  });

  // Default to chatbot if no clear match
  if (bestScore === 0) {
    return {
      category: 'chatbot',
      confidence: 0.3,
    };
  }

  return {
    category: bestCategory,
    subIntent: bestSubIntent,
    confidence: Math.min(0.5 + (bestScore * 0.15), 0.9),
  };
}

export function getCategoryLabel(category: ModelCategory): string {
  const labels: Record<ModelCategory, string> = {
    coding: 'Coding & Development',
    writing: 'Writing & Content',
    image: 'Image Generation',
    video: 'Video & Motion',
    audio: 'Audio & Voice',
    research: 'Research & Analysis',
    chatbot: 'Chatbots & Assistants',
    agents: 'AI Agents',
    specialized: 'Specialized Tools',
  };
  return labels[category];
}

export function getCategoryIcon(category: ModelCategory): string {
  const icons: Record<ModelCategory, string> = {
    coding: 'code',
    writing: 'pen',
    image: 'image',
    video: 'video',
    audio: 'mic',
    research: 'search',
    chatbot: 'message',
    agents: 'bot',
    specialized: 'wrench',
  };
  return icons[category];
}

export function getRecommendationReason(
  modelName: string,
  category: ModelCategory,
  subIntent?: string
): string {
  const reasons: Record<string, Record<string, string>> = {
    coding: {
      default: `${modelName} excels at understanding complex code patterns and providing accurate, efficient solutions for development tasks.`,
      debug: `${modelName} specializes in identifying bugs and suggesting precise fixes with clear explanations.`,
      frontend: `${modelName} has strong capabilities in HTML, CSS, JavaScript, and modern frontend frameworks.`,
      backend: `${modelName} excels at API design, database queries, and server-side logic.`,
      fullstack: `${modelName} provides comprehensive support across the entire development stack.`,
      python: `${modelName} has deep expertise in Python development and best practices.`,
      javascript: `${modelName} excels at modern JavaScript and TypeScript development.`,
      react: `${modelName} provides excellent React-specific guidance and component design.`,
    },
    writing: {
      default: `${modelName} produces clear, engaging content with excellent structure and tone adaptation.`,
      blog: `${modelName} creates compelling blog posts with strong hooks and reader engagement.`,
      email: `${modelName} crafts professional, effective emails that get responses.`,
      marketing: `${modelName} excels at persuasive copy that converts readers to customers.`,
      creative: `${modelName} brings creative flair and narrative strength to storytelling.`,
      editing: `${modelName} provides thorough editing with attention to clarity and style.`,
    },
    image: {
      default: `${modelName} generates high-quality images with excellent prompt understanding and artistic detail.`,
      photorealistic: `${modelName} creates stunning photorealistic images indistinguishable from real photos.`,
      artistic: `${modelName} excels at artistic styles with beautiful composition and creativity.`,
      logo: `${modelName} produces clean, professional logo designs suitable for branding.`,
      illustration: `${modelName} creates detailed illustrations perfect for books and publications.`,
    },
    video: {
      default: `${modelName} generates impressive videos with smooth motion and coherent storytelling.`,
      animation: `${modelName} excels at animated content with fluid, natural movement.`,
    },
    audio: {
      default: `${modelName} produces high-quality audio with natural, human-like characteristics.`,
      voice: `${modelName} offers the most realistic text-to-speech with natural intonation.`,
      music: `${modelName} creates original music with impressive composition and production quality.`,
      'voice-clone': `${modelName} provides accurate voice cloning with minimal sample audio.`,
    },
    research: {
      default: `${modelName} delivers comprehensive, accurate research with proper citations.`,
      'current-events': `${modelName} has access to the latest information and real-time data.`,
      academic: `${modelName} excels at scholarly research with proper academic formatting.`,
      analysis: `${modelName} provides deep analytical insights with data-driven conclusions.`,
    },
    chatbot: {
      default: `${modelName} offers well-rounded capabilities with strong reasoning and helpful responses.`,
    },
    agents: {
      default: `${modelName} can autonomously complete complex, multi-step tasks with minimal supervision.`,
    },
    specialized: {
      default: `${modelName} provides expert-level capabilities for its specific domain.`,
    },
  };

  const categoryReasons = reasons[category] || reasons.chatbot;
  return categoryReasons[subIntent || 'default'] || categoryReasons.default;
}
