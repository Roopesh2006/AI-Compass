import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Pen, Image, Video, Mic, Search, MessageSquare, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelCategory } from '@/types';
import { categoryTiles } from '@/data/models';

gsap.registerPlugin(ScrollTrigger);

interface CategoryTilesProps {
  onCategorySelect: (category: ModelCategory) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  pen: Pen,
  image: Image,
  video: Video,
  mic: Mic,
  search: Search,
  message: MessageSquare,
  bot: Bot,
};

export function CategoryTiles({ onCategorySelect }: CategoryTilesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const tiles = tilesRef.current;

    if (!section || !heading || !tiles) return;

    const tileElements = tiles.querySelectorAll('.category-tile');

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading,
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Tiles staggered animation
      gsap.fromTo(
        tileElements,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tiles,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleTileClick = (categoryId: ModelCategory) => {
    onCategorySelect(categoryId);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Indigo glow orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58vw] h-[30vh] rounded-full animate-breathe pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123, 97, 255, 0.18) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animationDelay: '2s',
        }}
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary text-center mb-12 sm:mb-16"
        >
          Or choose a category.
        </h2>

        {/* Tiles Grid */}
        <div
          ref={tilesRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          {categoryTiles.map((tile) => {
            const Icon = iconMap[tile.icon];
            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                className={cn(
                  'category-tile group relative flex flex-col items-center justify-center',
                  'p-6 sm:p-8 rounded-xl sm:rounded-2xl',
                  'bg-ocean-surface/60 backdrop-ocean border border-ocean-border',
                  'transition-all duration-300',
                  'hover:border-cyan-glow/40 hover:-translate-y-1 hover:shadow-glow-cyan/20',
                  'active:scale-[0.98]'
                )}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-cyan-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-ocean-deep/50 border border-ocean-border group-hover:border-cyan-glow/30 transition-colors duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-text-secondary group-hover:text-cyan-glow transition-colors duration-300" />
                  </div>
                </div>

                {/* Label */}
                <span className="relative text-sm sm:text-base font-medium text-text-primary group-hover:text-cyan-glow transition-colors duration-300">
                  {tile.label}
                </span>

                {/* Description (visible on larger screens) */}
                <span className="relative hidden sm:block mt-2 text-xs text-text-secondary/70 text-center max-w-[180px]">
                  {tile.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
