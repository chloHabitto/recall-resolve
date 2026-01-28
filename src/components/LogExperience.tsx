import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Entry,
  Category,
  TimeOfDay,
  PhysicalRating,
  WorthIt,
  CATEGORIES,
  TIME_OF_DAY,
  PHYSICAL_RATINGS,
  WORTH_IT_OPTIONS,
  EMOTION_TAGS,
} from '@/types/entry';

interface LogExperienceProps {
  onSave: (entry: Omit<Entry, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const QUICK_PICKS = [
  'ate junk food',
  'stayed up late',
  'skipped workout',
  'had coffee',
  'drank alcohol',
  'scrolled social media',
  'skipped meal',
];

export function LogExperience({ onSave, onClose }: LogExperienceProps) {
  const [step, setStep] = useState(1);
  const [action, setAction] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [context, setContext] = useState<TimeOfDay[]>([]);
  const [physicalRating, setPhysicalRating] = useState<PhysicalRating>('meh');
  const [emotionalTags, setEmotionalTags] = useState<string[]>([]);
  const [worthIt, setWorthIt] = useState<WorthIt>('meh');
  const [note, setNote] = useState('');

  const canProceed = step === 1 ? action.length > 0 : true;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onSave({
        action,
        category,
        context,
        physicalRating,
        emotionalTags,
        worthIt,
        note,
      });
    }
  };

  const toggleContext = (t: TimeOfDay) => {
    setContext(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const toggleEmotionTag = (tag: string) => {
    setEmotionalTags(prev => 
      prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
    >
      <div className="flex flex-col h-full max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - extra padding to prevent focus ring clipping */}
        <div className="flex-1 overflow-y-auto overflow-x-visible px-1 -mx-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-serif font-medium mb-2">What did you do?</h2>
                  <p className="text-muted-foreground">Be specific so future you can remember.</p>
                </div>
                
                <Input
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., ate spicy ramen at midnight"
                  className="text-lg py-6"
                  autoFocus
                />

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Quick picks:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PICKS.map(pick => (
                      <button
                        key={pick}
                        onClick={() => setAction(pick)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          action === pick 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        {pick}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Category:</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                          category === c.value 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <span>{c.emoji}</span>
                        <span className="text-sm">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-serif font-medium mb-2">When was this?</h2>
                  <p className="text-muted-foreground">Context helps you remember.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {TIME_OF_DAY.map(t => (
                    <button
                      key={t.value}
                      onClick={() => toggleContext(t.value)}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        context.includes(t.value) 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-serif font-medium mb-2">How did it feel after?</h2>
                  <p className="text-muted-foreground">Be honest with yourself.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 p-1 -m-1">
                  {PHYSICAL_RATINGS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setPhysicalRating(r.value)}
                      className={`p-5 rounded-lg border text-center transition-all ${
                        physicalRating === r.value 
                          ? 'bg-primary text-primary-foreground border-primary scale-105' 
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-3xl block mb-1">{r.emoji}</span>
                      <span className="text-sm font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">How did you feel emotionally?</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOTION_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleEmotionTag(tag)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${
                          emotionalTags.includes(tag) 
                            ? 'bg-secondary text-secondary-foreground border-secondary' 
                            : 'bg-card border-border hover:border-secondary/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-serif font-medium mb-2">Was it worth it?</h2>
                  <p className="text-muted-foreground">Would you do it again?</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 p-1 -m-1">
                  {WORTH_IT_OPTIONS.map(w => {
                    const colorClass = {
                      yes: worthIt === w.value ? 'bg-secondary text-secondary-foreground border-secondary' : '',
                      meh: worthIt === w.value ? 'bg-accent/30 text-accent-foreground border-accent' : '',
                      no: worthIt === w.value ? 'bg-destructive/20 text-destructive border-destructive/50' : '',
                    }[w.value];

                    return (
                      <button
                        key={w.value}
                        onClick={() => setWorthIt(w.value)}
                        className={`p-5 rounded-lg border text-center transition-all ${
                          worthIt === w.value 
                            ? `${colorClass} scale-105` 
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{w.emoji}</span>
                        <span className="text-sm font-medium">{w.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Note to future you (optional):</p>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g., Not worth the stomachache..."
                    className="min-h-[100px]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1"
          >
            {step === 4 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
