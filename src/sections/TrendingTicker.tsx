import { Flame, TrendingUp, Sparkles } from 'lucide-react';
import { trendingUpdates } from '@/data/models';
import { cn } from '@/lib/utils';

interface TrendingTickerProps {
  className?: string;
}

export function TrendingTicker({ className }: TrendingTickerProps) {
  // Double the updates for seamless loop
  const allUpdates = [...trendingUpdates, ...trendingUpdates];

  const getIcon = (type: string) => {
    switch (type) {
      case 'ranking':
        return <TrendingUp className="w-3.5 h-3.5 text-teal-pick" />;
      case 'new':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />;
      case 'update':
        return <Flame className="w-3.5 h-3.5 text-warning-orange" />;
      default:
        return <Flame className="w-3.5 h-3.5 text-cyan-glow" />;
    }
  };

  return (
    <div
      id="trending"
      className={cn(
        'w-full bg-ocean-surface/50 border-y border-ocean-border overflow-hidden',
        className
      )}
    >
      <div className="relative flex items-center h-10">
        {/* Static Label */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 bg-ocean-surface/90 backdrop-ocean z-10 flex items-center gap-2">
          <Flame className="w-4 h-4 text-warning-orange" />
          <span className="text-xs font-mono font-medium text-text-primary uppercase tracking-wider">
            Trending
          </span>
        </div>

        {/* Scrolling Content */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
            {allUpdates.map((update, index) => (
              <div
                key={`${update.id}-${index}`}
                className="flex items-center gap-2 text-sm text-text-secondary"
              >
                {getIcon(update.type)}
                <span>{update.text}</span>
                <span className="text-text-secondary/50 text-xs">
                  {new Date(update.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute left-[100px] top-0 bottom-0 w-8 bg-gradient-to-r from-ocean-surface/90 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ocean-surface/90 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}
