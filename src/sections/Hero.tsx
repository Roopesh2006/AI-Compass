import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Compass, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelCategory } from '@/types';
import { categoryTiles } from '@/data/models';

interface HeroProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: ModelCategory | null;
  onCategorySelect: (category: ModelCategory | null) => void;
}

const cyclingPlaceholders = [
  'Debug my Python script...',
  'Generate a cinematic video...',
  'Write a cold email...',
  'Create a logo for my startup...',
  'Research quantum computing...',
  'Build a React component...',
  'Clone my voice for a podcast...',
  'Analyze this dataset...',
];

export function Hero({
  query,
  onQueryChange,
  selectedCategory,
  onCategorySelect,
}: HeroProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycling placeholders
  useEffect(() => {
    if (isFocused || query) return;

    intervalRef.current = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % cyclingPlaceholders.length);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFocused, query]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowCategories(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding categories to allow clicks
    setTimeout(() => setShowCategories(false), 200);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        // Scroll to results
        document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [query]
  );

  const handleCategoryClick = useCallback(
    (categoryId: ModelCategory) => {
      onCategorySelect(categoryId);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    [onCategorySelect]
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-ocean">
      {/* Ambient Glow Orb */}
      <div
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[62vw] h-[34vh] rounded-full animate-breathe pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.22) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Floating decorative dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-glow/40 animate-float"
          style={{ left: '15%', top: '25%', animationDelay: '0s' }}
        />
        <div
          className="absolute w-1 h-1 rounded-full bg-cyan-glow/30 animate-float"
          style={{ left: '78%', top: '30%', animationDelay: '1s' }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-cyan-glow/25 animate-float"
          style={{ left: '85%', top: '60%', animationDelay: '2s' }}
        />
        <div
          className="absolute w-1 h-1 rounded-full bg-indigo-glow/30 animate-float"
          style={{ left: '12%', top: '65%', animationDelay: '1.5s' }}
        />
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-glow/35 animate-float"
          style={{ left: '70%', top: '75%', animationDelay: '0.5s' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Headline */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-text-primary tracking-tight mb-4">
            Find the best{' '}
            <span className="text-cyan-glow text-glow-cyan">AI</span> for any task.
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto">
            Type a task, compare models, and start working with the right tool in seconds.
          </p>
        </div>

        {/* Omnibar */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto"
        >
          <div
            className={cn(
              'relative group transition-all duration-300',
              isFocused && 'scale-[1.02]'
            )}
          >
            {/* Glow effect */}
            <div
              className={cn(
                'absolute -inset-1 rounded-2xl transition-all duration-500',
                isFocused
                  ? 'bg-cyan-glow/30 blur-xl'
                  : 'bg-cyan-glow/10 blur-lg animate-pulse-glow'
              )}
            />

            {/* Input container */}
            <div className="relative flex items-center bg-ocean-surface/80 backdrop-ocean border border-ocean-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-glow/30">
              {/* Left icon */}
              <div className="flex-shrink-0 pl-4 sm:pl-6">
                <Compass
                  className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300',
                    isFocused ? 'text-cyan-glow' : 'text-text-secondary'
                  )}
                />
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={cyclingPlaceholders[placeholderIndex]}
                maxLength={200}
                className="flex-1 bg-transparent border-none outline-none px-3 sm:px-4 py-4 sm:py-5 text-text-primary placeholder:text-text-secondary/50 text-base sm:text-lg"
              />

              {/* Right button */}
              <button
                type="submit"
                className="flex-shrink-0 m-1.5 sm:m-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-glow text-ocean-deep font-medium rounded-xl hover:bg-cyan-glow/90 transition-all duration-200 flex items-center gap-2"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Find</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div
            className={cn(
              'mt-4 flex flex-wrap justify-center gap-2 transition-all duration-300',
              (showCategories || selectedCategory)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            )}
          >
            {categoryTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleCategoryClick(tile.id)}
                className={cn(
                  'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border',
                  selectedCategory === tile.id
                    ? 'bg-cyan-glow/20 border-cyan-glow/50 text-cyan-glow'
                    : 'bg-ocean-surface/50 border-ocean-border text-text-secondary hover:border-cyan-glow/30 hover:text-text-primary'
                )}
              >
                {tile.label}
              </button>
            ))}
          </div>
        </form>

        {/* Selected category indicator */}
        {selectedCategory && (
          <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
            <span>Showing results for</span>
            <span className="text-cyan-glow font-medium">
              {categoryTiles.find((t) => t.id === selectedCategory)?.label}
            </span>
            <button
              onClick={() => onCategorySelect(null)}
              className="text-text-secondary hover:text-text-primary underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary/60">
        <span className="text-xs font-mono uppercase tracking-wider">
          Scroll to explore categories
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
