import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from '@/sections/Navigation';
import { TrendingTicker } from '@/sections/TrendingTicker';
import { Hero } from '@/sections/Hero';
import { CategoryTiles } from '@/sections/CategoryTiles';
import { ResultsGrid } from '@/sections/ResultsGrid';
import { Comparison } from '@/sections/Comparison';
import { Footer } from '@/sections/Footer';
import { SubmitToolModal } from '@/components/SubmitToolModal';
import { useModels } from '@/hooks/useModels';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    query,
    selectedCategory,
    activeModifiers,
    compareList,
    allModels,
    filteredModels,
    compareModels,
    updateQuery,
    selectCategory,
    toggleModifier,
    clearModifiers,
    addToCompare,
    removeFromCompare,
    clearCompare,
  } = useModels();

  // Initial load animation
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Setup global scroll snap for pinned sections
  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);

      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            // Check if within any pinned range (with buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.08 && value <= r.end + 0.08
            );

            if (!inPinned) return value; // Flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={cn(
        'min-h-screen bg-ocean-deep grain-overlay transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Navigation */}
      <Navigation onSubmitClick={() => setIsSubmitModalOpen(true)} />

      {/* Trending Ticker */}
      <div className="pt-16">
        <TrendingTicker />
      </div>

      {/* Main Content */}
      <main>
        {/* Hero with Omnibar */}
        <Hero
          query={query}
          onQueryChange={updateQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={selectCategory}
        />

        {/* Category Tiles */}
        <CategoryTiles onCategorySelect={selectCategory} />

        {/* Results Grid */}
        <ResultsGrid
          models={filteredModels}
          allModels={allModels}
          selectedCategory={selectedCategory}
          activeModifiers={activeModifiers}
          onToggleModifier={toggleModifier}
          onClearModifiers={clearModifiers}
          compareList={compareList}
          onAddToCompare={addToCompare}
          onRemoveFromCompare={removeFromCompare}
        />

        {/* Comparison Section */}
        <Comparison
          models={compareModels}
          onRemoveModel={removeFromCompare}
          onClearAll={clearCompare}
        />
      </main>

      {/* Footer */}
      <Footer onSubmitClick={() => setIsSubmitModalOpen(true)} />

      {/* Submit Tool Modal */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}

export default App;
