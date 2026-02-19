import { useState } from 'react';
import { Sparkles, Send, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitState = 'idle' | 'submitting' | 'success';

const categoryOptions = [
  { value: 'coding', label: 'Coding & Development' },
  { value: 'writing', label: 'Writing & Content' },
  { value: 'image', label: 'Image Generation' },
  { value: 'video', label: 'Video & Motion' },
  { value: 'audio', label: 'Audio & Voice' },
  { value: 'research', label: 'Research & Analysis' },
  { value: 'chatbot', label: 'Chatbots & Assistants' },
  { value: 'agents', label: 'AI Agents' },
  { value: 'specialized', label: 'Specialized Tools' },
];

export function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [whyRecommend, setWhyRecommend] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !whyRecommend.trim()) return;

    setState('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setState('success');

    setTimeout(() => {
      setName(''); setCompany(''); setCategory(''); setUrl('');
      setWhyRecommend(''); setEmail('');
      setState('idle');
      onClose();
    }, 2500);
  };

  const handleClose = () => {
    if (state !== 'submitting') {
      setName(''); setCompany(''); setCategory(''); setUrl('');
      setWhyRecommend(''); setEmail('');
      setState('idle');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-ocean-surface border-ocean-border text-text-primary max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-glow" />
            Suggest a Tool
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Can't find what you need? Suggest an AI model or tool to add.
          </DialogDescription>
        </DialogHeader>

        {state === 'success' ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-pick/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-teal-pick" />
            </div>
            <h3 className="font-heading text-lg text-text-primary mb-2">
              Thanks for your suggestion!
            </h3>
            <p className="text-sm text-text-secondary">
              Your suggestion is <span className="text-amber-400 font-medium">pending review</span>. We'll review it within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Model / Tool Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Midjourney, Claude, etc."
                className="bg-ocean-deep/50 border-ocean-border text-text-primary placeholder:text-text-secondary/50 focus:border-cyan-glow/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Company
              </label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Anthropic, Google, etc."
                className="bg-ocean-deep/50 border-ocean-border text-text-primary placeholder:text-text-secondary/50 focus:border-cyan-glow/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-ocean-deep/50 border border-ocean-border text-text-primary focus:border-cyan-glow/50 focus:outline-none"
              >
                <option value="" className="bg-ocean-deep text-text-secondary">Select a category...</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-ocean-deep">{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Why do you recommend it? <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={whyRecommend}
                onChange={(e) => setWhyRecommend(e.target.value)}
                placeholder="What makes this tool special? What is it best for?"
                rows={3}
                className="bg-ocean-deep/50 border-ocean-border text-text-primary placeholder:text-text-secondary/50 focus:border-cyan-glow/50 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Link to model
              </label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="bg-ocean-deep/50 border-ocean-border text-text-primary placeholder:text-text-secondary/50 focus:border-cyan-glow/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Your email <span className="text-text-secondary/50">(optional, for follow-up)</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-ocean-deep/50 border-ocean-border text-text-primary placeholder:text-text-secondary/50 focus:border-cyan-glow/50"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={state === 'submitting'}
                className="flex-1 border-ocean-border text-text-secondary hover:text-text-primary hover:border-cyan-glow/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={state === 'submitting' || !name.trim() || !category || !whyRecommend.trim()}
                className={cn(
                  'flex-1 bg-cyan-glow text-ocean-deep hover:bg-cyan-glow/90',
                  state === 'submitting' && 'opacity-70'
                )}
              >
                {state === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Suggestion
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
