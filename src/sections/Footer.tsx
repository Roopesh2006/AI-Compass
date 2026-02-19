import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Sparkles,
  Mail,
  Github,
  Twitter,
  Send,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onSubmitClick?: () => void;
}

export function Footer({ onSubmitClick }: FooterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const footerLinks = [
    { label: 'Directory', href: '#directory' },
    { label: 'Compare', href: '#compare' },
    { label: 'Trending', href: '#trending' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer
      ref={sectionRef}
      className="relative pt-16 sm:pt-20 pb-8 border-t border-ocean-border"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep to-[#0B1120] pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div ref={contentRef}>
          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-4">
              Submit a tool
            </h2>
            <p className="text-text-secondary mb-8">
              Know a model we should include? Send a link and we'll review it within 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onSubmitClick}
                className="bg-cyan-glow text-ocean-deep hover:bg-cyan-glow/90 font-medium px-8"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Suggest a tool
              </Button>
              <Button
                variant="outline"
                className="border-ocean-border text-text-primary hover:border-cyan-glow/50 hover:text-cyan-glow"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-md mx-auto mb-16">
            <p className="text-sm text-text-secondary text-center mb-4">
              Get weekly AI model updates in your inbox
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-ocean-surface/50 border-ocean-border text-text-primary placeholder:text-text-secondary/50 focus:border-cyan-glow/50"
              />
              <Button
                type="submit"
                disabled={isSubmitted}
                className={cn(
                  'bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 hover:bg-cyan-glow/20',
                  isSubmitted && 'bg-teal-pick/20 text-teal-pick border-teal-pick/30'
                )}
              >
                {isSubmitted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-ocean-border mb-8" />

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <Compass className="w-6 h-6 text-cyan-glow transition-transform duration-300 group-hover:rotate-45" />
              <span className="font-heading font-semibold text-text-primary">
                AI-Compass
              </span>
            </a>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-cyan-glow transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 text-text-secondary hover:text-cyan-glow transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-text-secondary/60">
              © {new Date().getFullYear()} AI-Compass. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
