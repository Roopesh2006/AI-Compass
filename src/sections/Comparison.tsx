import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Check, Minus, Zap, MessageSquare, Layers, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIModel } from '@/types';
import { Button } from '@/components/ui/button';
import { formatContextWindow, generateUTMUrl, getFreshnessStatus } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ComparisonProps {
  models: AIModel[];
  onRemoveModel: (modelId: string) => void;
  onClearAll: () => void;
}

// Logo placeholder component
function CompareLogo({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-glow/20 to-indigo-glow/20 border border-cyan-glow/30',
        className
      )}
    >
      <span className="font-heading font-bold text-cyan-glow text-xs">{initials}</span>
    </div>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-secondary w-16">{label}</span>
      <div className="flex-1 h-2 bg-ocean-deep rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-glow rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-cyan-glow w-6">{score}</span>
    </div>
  );
}

export function Comparison({ models, onRemoveModel, onClearAll }: ComparisonProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  if (models.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} id="compare" className="py-16 sm:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div ref={contentRef}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-1">
                Compare
              </h2>
              <p className="text-sm text-text-secondary">
                Add models to see specs side by side.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClearAll}
              className="border-ocean-border text-text-secondary hover:text-text-primary hover:border-cyan-glow/50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          </div>

          {/* Comparison Table */}
          <div className="bg-ocean-surface/60 backdrop-ocean border border-ocean-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-ocean-border">
                    <th className="text-left p-4 sm:p-6 text-sm font-medium text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean z-10">
                      Feature
                    </th>
                    {models.map((model) => (
                      <th
                        key={model.id}
                        className="p-4 sm:p-6 text-left min-w-[200px]"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <CompareLogo name={model.name} className="w-10 h-10" />
                            <div>
                              <div className="font-heading font-semibold text-text-primary">
                                {model.name}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {model.company}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveModel(model.id)}
                            className="p-1 text-text-secondary hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-border">
                  {/* Best For */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      Best For
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        <div className="flex flex-wrap gap-1">
                          {model.bestFor.slice(0, 2).map((item) => (
                            <span
                              key={item}
                              className="px-2 py-0.5 text-xs bg-teal-pick/10 text-teal-pick rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Context Window */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Context Window
                      </div>
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        <span className="text-sm text-text-primary">
                          {formatContextWindow(model.contextWindow)} tokens
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Multimodal */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Multimodal
                      </div>
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        {model.multimodal ? (
                          <Check className="w-5 h-5 text-teal-pick" />
                        ) : (
                          <Minus className="w-5 h-5 text-text-secondary/50" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Free Tier */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Free Tier
                      </div>
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        {model.freeTier ? (
                          <span className="inline-flex items-center gap-1 text-sm text-teal-pick">
                            <Check className="w-4 h-4" />
                            Available
                          </span>
                        ) : (
                          <span className="text-sm text-text-secondary/70">Paid only</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Pricing */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      Pricing
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        <span className="text-sm text-text-primary capitalize">
                          {model.pricing.type}
                        </span>
                        {model.pricing.details && (
                          <p className="text-xs text-text-secondary mt-1">
                            {model.pricing.details}
                          </p>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Speed Score */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Speed
                      </div>
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        <ScoreBar score={model.taskScores.speed} label="Speed" />
                      </td>
                    ))}
                  </tr>

                  {/* Benchmark Scores */}
                  {['coding', 'writing', 'reasoning'].map((metric) => (
                    <tr key={metric}>
                      <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean capitalize">
                        {metric}
                      </td>
                      {models.map((model) => (
                        <td key={model.id} className="p-4 sm:p-6">
                          <ScoreBar
                            score={model.taskScores[metric as keyof typeof model.taskScores] as number}
                            label={metric}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Freshness */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-text-secondary sticky left-0 bg-ocean-surface/95 backdrop-ocean">
                      Last Verified
                    </td>
                    {models.map((model) => {
                      const freshness = getFreshnessStatus(model.benchmarks.lastVerified);
                      return (
                        <td key={model.id} className="p-4 sm:p-6">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: freshness.color }}
                            />
                            <span className="text-sm text-text-secondary">
                              {freshness.daysAgo === 0
                                ? 'Today'
                                : `${freshness.daysAgo} days ago`}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-4 sm:p-6 sticky left-0 bg-ocean-surface/95 backdrop-ocean" />
                    {models.map((model) => (
                      <td key={model.id} className="p-4 sm:p-6">
                        <Button
                          onClick={() =>
                            window.open(generateUTMUrl(model.directUrl), '_blank', 'noopener,noreferrer')
                          }
                          className="w-full bg-cyan-glow text-ocean-deep hover:bg-cyan-glow/90"
                        >
                          Open
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Screenshot hint */}
          <p className="mt-4 text-center text-xs text-text-secondary/60">
            Perfect for sharing on social media. Take a screenshot!
          </p>
        </div>
      </div>
    </section>
  );
}
