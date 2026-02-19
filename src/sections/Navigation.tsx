import { useState, useEffect } from 'react';
import { Menu, X, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  onSubmitClick?: () => void;
}

export function Navigation({ onSubmitClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Directory', href: '#directory' },
    { label: 'Compare', href: '#compare' },
    { label: 'Trending', href: '#trending' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-ocean-deep/90 backdrop-ocean border-b border-ocean-border'
            : 'bg-transparent'
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <Compass className="w-7 h-7 text-cyan-glow transition-transform duration-300 group-hover:rotate-45" />
                <div className="absolute inset-0 bg-cyan-glow/20 blur-lg rounded-full" />
              </div>
              <span className="font-heading font-semibold text-lg text-text-primary">
                AI-Compass
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={onSubmitClick}
                className="bg-cyan-glow/10 hover:bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30 hover:border-cyan-glow/50 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Submit a Tool
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-primary hover:text-cyan-glow transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-ocean-deep/95 backdrop-ocean"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            'absolute top-16 left-0 right-0 bg-ocean-surface border-b border-ocean-border p-6 transition-transform duration-300',
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          )}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg text-text-primary hover:text-cyan-glow transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-ocean-border my-2" />
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onSubmitClick?.();
              }}
              className="w-full bg-cyan-glow text-ocean-deep hover:bg-cyan-glow/90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Submit a Tool
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
