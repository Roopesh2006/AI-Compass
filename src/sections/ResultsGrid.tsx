import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ExternalLink, Scale, Check, Zap, Shield, Wallet, Layers,
  ChevronDown, Sparkles, TrendingUp, MessageSquare, Grid3X3,
  Search, BookOpen, Globe, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIModel, FilterModifier, ModelCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  formatContextWindow, getFreshnessStatus, generateUTMUrl,
  sanitizeInput, validateSearchQuery, isValidUrl,
} from '@/lib/utils';
import { getRecommendationReason, getCategoryLabel } from '@/lib/intentClassifier';

gsap.registerPlugin(ScrollTrigger);

interface ResultsGridProps {
  models: AIModel[];
  allModels: AIModel[];
  selectedCategory: ModelCategory | null;
  activeModifiers: Set<FilterModifier>;
  onToggleModifier: (modifier: FilterModifier) => void;
  onClearModifiers: () => void;
  compareList: string[];
  onAddToCompare: (modelId: string) => void;
  onRemoveFromCompare: (modelId: string) => void;
}

const modifierConfig: {
  id: FilterModifier;
  label: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
    { id: 'free', label: 'Free Only', emoji: '💰', icon: Wallet },
    { id: 'fastest', label: 'Fastest', emoji: '⚡', icon: Zap },
    { id: 'privacy', label: 'Privacy-Focused', emoji: '🔒', icon: Shield },
    { id: 'multimodal', label: 'Multimodal', emoji: '🖼️', icon: Layers },
    { id: 'longContext', label: 'Long Context', emoji: '📚', icon: BookOpen },
    { id: 'openSource', label: 'Open Source', emoji: '🌍', icon: Globe },
  ];

function ModelLogo({ name, className }: { name: string; className?: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-glow/20 to-indigo-glow/20 border border-cyan-glow/30',
      className
    )}>
      <span className="font-heading font-bold text-cyan-glow text-sm">{initials}</span>
    </div>
  );
}

function ModelCard({
  model, category, rank, isInCompare, onAddToCompare, onRemoveFromCompare,
}: {
  model: AIModel;
  category: ModelCategory | null;
  rank?: number;
  isInCompare: boolean;
  onAddToCompare: () => void;
  onRemoveFromCompare: () => void;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const freshness = getFreshnessStatus(model.benchmarks.lastVerified);
  const isRecommended = rank !== undefined && rank < 5;

  const handleOpen = () => {
    if (!isValidUrl(model.directUrl)) return;
    window.open(generateUTMUrl(model.directUrl), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative bg-ocean-surface/60 backdrop-ocean border border-ocean-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-glow/40 hover:-translate-y-1 hover:shadow-ocean">
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-cyan-glow/20 text-cyan-glow border-cyan-glow/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}

      {/* Best For badge */}
      {model.bestFor.length > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-teal-pick/20 text-teal-pick border-teal-pick/30 text-xs">
            {model.bestFor[0]}
          </Badge>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 mb-4 mt-1">
          <ModelLogo name={model.name} className="w-12 h-12 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg text-text-primary truncate">{model.name}</h3>
            <p className="text-sm text-text-secondary">by {model.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {model.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-ocean-deep/60 text-text-secondary rounded-full border border-ocean-border">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {getRecommendationReason(model.name, category || model.category, undefined)}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {model.contextWindow > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-ocean-deep/60 text-text-secondary rounded-lg border border-ocean-border">
              <MessageSquare className="w-3 h-3" />
              {formatContextWindow(model.contextWindow)} tokens
            </span>
          )}
          {model.multimodal && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-ocean-deep/60 text-text-secondary rounded-lg border border-ocean-border">
              <Layers className="w-3 h-3" />
              Multimodal
            </span>
          )}
          {model.freeTier && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-teal-pick/10 text-teal-pick rounded-lg border border-teal-pick/20">
              <Wallet className="w-3 h-3" />
              Free tier
            </span>
          )}
          {model.isOpenSource && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-glow/10 text-indigo-glow rounded-lg border border-indigo-glow/20">
              <Globe className="w-3 h-3" />
              Open Source
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-5 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: freshness.color }} />
          <span className="text-text-secondary/70">
            Verified {freshness.daysAgo === 0 ? 'today' : `${freshness.daysAgo} days ago`}
          </span>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleOpen} className="flex-1 bg-cyan-glow text-ocean-deep hover:bg-cyan-glow/90 font-medium">
            Go There
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={isInCompare ? onRemoveFromCompare : onAddToCompare}
            className={cn(
              'px-3 border-ocean-border hover:border-cyan-glow/50',
              isInCompare && 'bg-cyan-glow/10 border-cyan-glow/50 text-cyan-glow'
            )}
          >
            {isInCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </Button>
        </div>

        <button
          onClick={() => setShowWhy(!showWhy)}
          className="w-full mt-4 pt-4 border-t border-ocean-border flex items-center justify-center gap-1 text-xs text-text-secondary hover:text-cyan-glow transition-colors"
        >
          Why this recommendation?
          <ChevronDown className={cn('w-3 h-3 transition-transform', showWhy && 'rotate-180')} />
        </button>

        {showWhy && (
          <div className="mt-4 pt-4 border-t border-ocean-border">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(model.taskScores)
                .filter(([, score]) => score > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([task, score]) => (
                  <div key={task} className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary capitalize">{task}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-ocean-deep rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-glow rounded-full" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs font-mono text-cyan-glow w-6">{score}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResultsGrid({
  models, allModels, selectedCategory, activeModifiers,
  onToggleModifier, onClearModifiers, compareList,
  onAddToCompare, onRemoveFromCompare,
}: ResultsGridProps) {
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const sanitizedQuery = sanitizeInput(searchQuery);

  const handleSearchChange = (value: string) => {
    const validation = validateSearchQuery(value);
    setSearchError(!validation.valid ? (validation.error || null) : null);
    setSearchQuery(validation.sanitized);
  };

  // Get the top 5 model IDs for "Recommended" badge
  const top5Ids = models.slice(0, 5).map(m => m.id);

  // In "all" mode, get ALL models from the category (unfiltered by modifiers in terms of which models exist)
  const allCategoryModels = viewMode === 'all'
    ? allModels.filter(model => {
      if (selectedCategory) {
        if (selectedCategory === 'coding') return model.category === 'coding' || model.category === 'agents';
        if (selectedCategory === 'agents') return model.category === 'agents' || (model.category === 'coding' && model.taskScores.agents >= 70);
        if (selectedCategory === 'chatbot') return model.category === 'chatbot' || model.taskScores.chatbot >= 85;
        return model.category === selectedCategory;
      }
      return true;
    }).filter(model => {
      if (sanitizedQuery) {
        const q = sanitizedQuery.toLowerCase();
        return model.name.toLowerCase().includes(q) ||
          model.company.toLowerCase().includes(q) ||
          model.tags.some(tag => tag.toLowerCase().includes(q)) ||
          model.category.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      if (selectedCategory) {
        const key = selectedCategory as keyof typeof a.taskScores;
        return (b.taskScores[key] || 0) - (a.taskScores[key] || 0);
      }
      return 0;
    })
    : [];

  const displayModels = viewMode === 'recommended' ? models : allCategoryModels;

  const hasActiveFilters = activeModifiers.size > 0;

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;
    const cards = grid.querySelectorAll('.model-card-wrapper');
    const ctx = gsap.context(() => {
      gsap.fromTo(header, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo(cards, { y: 50, opacity: 0, scale: 0.98 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, section);
    return () => ctx.revert();
  }, [displayModels]);

  return (
    <section ref={sectionRef} id="directory" className="relative py-16 sm:py-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[22vh] pointer-events-none gradient-ocean-top" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-1">
              {viewMode === 'recommended' ? 'Top picks for you' : 'All Models'}
            </h2>
            <p className="text-sm text-text-secondary">
              {hasActiveFilters
                ? `Showing ${displayModels.length} results with filters applied`
                : viewMode === 'recommended'
                  ? `${displayModels.length} models matched your criteria`
                  : selectedCategory
                    ? `${displayModels.length} models in ${getCategoryLabel(selectedCategory)}`
                    : `${displayModels.length} models available`
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <div className="flex items-center gap-3 mr-4">
                <span className="text-sm text-cyan-glow">{compareList.length} in compare</span>
                <a href="#compare" className="text-sm text-cyan-glow hover:underline">View</a>
              </div>
            )}

            <div className="flex items-center bg-ocean-surface/60 border border-ocean-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('recommended')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                  viewMode === 'recommended' ? 'bg-cyan-glow/20 text-cyan-glow' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Recommended</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                  viewMode === 'all' ? 'bg-cyan-glow/20 text-cyan-glow' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">View All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search bar (only in All mode) */}
        {viewMode === 'all' && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search models, companies, tags..."
                maxLength={200}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 bg-ocean-surface/60 border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition-colors',
                  searchError ? 'border-red-500/50 focus:border-red-500' : 'border-ocean-border focus:border-cyan-glow/50'
                )}
              />
            </div>
            {searchError && <p className="mt-2 text-xs text-red-400">{searchError}</p>}
          </div>
        )}

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          {modifierConfig.map((modifier) => {
            const isActive = activeModifiers.has(modifier.id);
            return (
              <button
                key={modifier.id}
                onClick={() => onToggleModifier(modifier.id)}
                className={cn(
                  'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                  isActive
                    ? 'bg-cyan-glow/20 border-cyan-glow/50 text-cyan-glow'
                    : 'bg-ocean-surface/50 border-ocean-border text-text-secondary hover:border-cyan-glow/30 hover:text-text-primary'
                )}
              >
                <span>{modifier.emoji}</span>
                {modifier.label}
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              onClick={onClearModifiers}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/50 transition-all duration-200"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayModels.length > 0 ? (
            displayModels.map((model, index) => (
              <div key={model.id} className="model-card-wrapper">
                <ModelCard
                  model={model}
                  category={selectedCategory}
                  rank={viewMode === 'all' && top5Ids.includes(model.id) ? top5Ids.indexOf(model.id) : (viewMode === 'recommended' ? index : undefined)}
                  isInCompare={compareList.includes(model.id)}
                  onAddToCompare={() => onAddToCompare(model.id)}
                  onRemoveFromCompare={() => onRemoveFromCompare(model.id)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ocean-surface border border-ocean-border flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="font-heading text-lg text-text-primary mb-2">No models found</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                {hasActiveFilters
                  ? 'Try removing some filters to see more results.'
                  : viewMode === 'all' && searchQuery
                    ? 'Try a different search term.'
                    : 'Try adjusting your filters or search for a different task.'}
              </p>
              {(hasActiveFilters || (viewMode === 'all' && searchQuery)) && (
                <div className="mt-4 flex gap-3 justify-center">
                  {hasActiveFilters && (
                    <button onClick={onClearModifiers} className="text-sm text-cyan-glow hover:underline">Clear filters</button>
                  )}
                  {viewMode === 'all' && searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-sm text-cyan-glow hover:underline">Clear search</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {viewMode === 'all' && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setViewMode('recommended')}
              className="inline-flex items-center gap-2 text-sm text-cyan-glow hover:underline"
            >
              <Sparkles className="w-4 h-4" />
              Back to recommended models
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
