import { useState, useMemo, useCallback } from 'react';
import type { ModelCategory, FilterModifier, SearchIntent } from '@/types';
import { aiModels } from '@/data/models';
import { classifyIntent } from '@/lib/intentClassifier';

export function useModels() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | null>(null);
  const [activeModifiers, setActiveModifiers] = useState<Set<FilterModifier>>(new Set());
  const [compareList, setCompareList] = useState<string[]>([]);
  const [intent, setIntent] = useState<SearchIntent | null>(null);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setCompareList([]);
    if (newQuery.trim()) {
      const detectedIntent = classifyIntent(newQuery);
      setIntent(detectedIntent);
      setSelectedCategory(detectedIntent.category);
    } else {
      setIntent(null);
      setSelectedCategory(null);
    }
  }, []);

  const selectCategory = useCallback((category: ModelCategory | null) => {
    setSelectedCategory(category);
    setCompareList([]);
    if (category) {
      setIntent({ category, confidence: 0.9 });
    } else {
      setIntent(null);
    }
  }, []);

  const toggleModifier = useCallback((modifier: FilterModifier) => {
    setActiveModifiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modifier)) {
        newSet.delete(modifier);
      } else {
        newSet.add(modifier);
      }
      return newSet;
    });
  }, []);

  const clearModifiers = useCallback(() => {
    setActiveModifiers(new Set());
  }, []);

  const addToCompare = useCallback((modelId: string) => {
    setCompareList(prev => {
      if (prev.includes(modelId)) return prev;
      if (prev.length >= 5) return prev;
      return [...prev, modelId];
    });
  }, []);

  const removeFromCompare = useCallback((modelId: string) => {
    setCompareList(prev => prev.filter(id => id !== modelId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback((modelId: string) => {
    return compareList.includes(modelId);
  }, [compareList]);

  // Strict category matching — models must belong to the queried category
  const getCategoryModels = useCallback((category: ModelCategory | null) => {
    if (!category) return [...aiModels];

    // For coding, also show agents (they overlap)
    if (category === 'coding') {
      return aiModels.filter(m => m.category === 'coding' || m.category === 'agents');
    }
    // For agents, also show coding tools with agent scores
    if (category === 'agents') {
      return aiModels.filter(m => m.category === 'agents' || (m.category === 'coding' && m.taskScores.agents >= 70));
    }
    // For chatbot (general), show chatbot + high-scoring models from other categories
    if (category === 'chatbot') {
      return aiModels.filter(m => m.category === 'chatbot' || m.taskScores.chatbot >= 85);
    }
    // STRICT: other categories only show models from that exact category
    return aiModels.filter(m => m.category === category);
  }, []);

  const filteredModels = useMemo(() => {
    let models = getCategoryModels(selectedCategory);

    // Apply filter modifiers
    if (activeModifiers.has('free')) {
      models = models.filter(m => m.freeTier);
    }

    if (activeModifiers.has('multimodal')) {
      models = models.filter(m => m.multimodal);
    }

    if (activeModifiers.has('longContext')) {
      models = models.filter(m => m.contextWindow >= 1000000);
    }

    if (activeModifiers.has('openSource')) {
      models = models.filter(m => m.isOpenSource);
    }

    if (activeModifiers.has('privacy')) {
      models = models.filter(m => m.isOpenSource);
    }

    if (activeModifiers.has('fastest')) {
      models = models.filter(m => m.speedScore >= 7);
    }

    // Sort by relevance to intent
    if (intent) {
      models.sort((a, b) => {
        const scoreKey = intent.category as keyof typeof a.taskScores;
        const scoreA = a.taskScores[scoreKey] || 0;
        const scoreB = b.taskScores[scoreKey] || 0;

        let adjustedA = scoreA;
        let adjustedB = scoreB;

        if (activeModifiers.has('fastest')) {
          adjustedA = adjustedA * 0.7 + a.taskScores.speed * 0.3;
          adjustedB = adjustedB * 0.7 + b.taskScores.speed * 0.3;
        }

        if (activeModifiers.has('free')) {
          if (a.freeTier) adjustedA += 5;
          if (b.freeTier) adjustedB += 5;
        }

        return adjustedB - adjustedA;
      });
    }

    return models;
  }, [selectedCategory, intent, activeModifiers, getCategoryModels]);

  const compareModels = useMemo(() => {
    return aiModels.filter(m => compareList.includes(m.id));
  }, [compareList]);

  return {
    query,
    selectedCategory,
    activeModifiers,
    compareList,
    intent,
    allModels: aiModels,
    filteredModels,
    compareModels,
    updateQuery,
    selectCategory,
    toggleModifier,
    clearModifiers,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  };
}
