import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MEMO_OUTCOMES, 
  PHYSICAL_RATINGS,
  Memo,
  MemoOutcome,
  PhysicalRating 
} from '@/types/entry';

interface AddMemoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMemo: (memo: Omit<Memo, 'id' | 'createdAt'>) => void;
  actionName: string;
}

export function AddMemoSheet({ open, onOpenChange, onAddMemo, actionName }: AddMemoSheetProps) {
  const [step, setStep] = useState<'outcome' | 'feeling' | 'note'>('outcome');
  const [outcome, setOutcome] = useState<MemoOutcome | null>(null);
  const [feeling, setFeeling] = useState<PhysicalRating | null>(null);
  const [note, setNote] = useState('');

  const resetForm = () => {
    setStep('outcome');
    setOutcome(null);
    setFeeling(null);
    setNote('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  };

  const handleNext = () => {
    if (step === 'outcome' && outcome) setStep('feeling');
    else if (step === 'feeling' && feeling) setStep('note');
  };

  const handleSkip = () => {
    if (step === 'outcome') {
      setOutcome('reflecting');
      setStep('feeling');
    } else if (step === 'feeling') {
      setFeeling('meh');
      setStep('note');
    }
  };

  const handleBack = () => {
    if (step === 'feeling') setStep('outcome');
    else if (step === 'note') setStep('feeling');
  };

  const handleSubmit = () => {
    const finalOutcome = outcome || 'reflecting';
    const finalFeeling = feeling || 'meh';
    onAddMemo({
      outcome: finalOutcome,
      feeling: finalFeeling,
      note: note.trim(),
    });
    handleClose();
  };

  const canProceed = () => {
    if (step === 'outcome') return !!outcome;
    if (step === 'feeling') return !!feeling;
    return true;
  };

  const NavigationButtons = ({ showSkip = true }: { showSkip?: boolean }) => (
    <div className="flex gap-3 mt-6">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="flex-1"
        disabled={step === 'outcome'}
      >
        Back
      </Button>
      {showSkip && step !== 'note' && (
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1"
        >
          Skip
        </Button>
      )}
      {step === 'note' ? (
        <Button onClick={handleSubmit} className="flex-1">
          Save
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={!canProceed()}
        >
          Next
        </Button>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center font-serif">
            {step === 'outcome' && 'What happened?'}
            {step === 'feeling' && 'How did it feel?'}
            {step === 'note' && 'Any thoughts?'}
          </SheetTitle>
          <p className="text-sm text-muted-foreground text-center">
            Following up on: {actionName}
          </p>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {step === 'outcome' && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {MEMO_OUTCOMES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOutcome(opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    outcome === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
              <NavigationButtons />
            </motion.div>
          )}

          {step === 'feeling' && (
            <motion.div
              key="feeling"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-4 gap-2">
                {PHYSICAL_RATINGS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setFeeling(r.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                      feeling === r.value
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-xs">{r.label}</span>
                  </button>
                ))}
              </div>
              <NavigationButtons />
            </motion.div>
          )}

          {step === 'note' && (
            <motion.div
              key="note"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3 py-2">
                <span className="text-xl">
                  {MEMO_OUTCOMES.find(o => o.value === outcome)?.emoji || '💭'}
                </span>
                <span className="text-xl">
                  {PHYSICAL_RATINGS.find(r => r.value === feeling)?.emoji || '😕'}
                </span>
              </div>
              
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 150))}
                placeholder="A quick note to yourself... (optional)"
                className="bg-muted/50 min-h-[80px] resize-none"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">{note.length}/150</p>

              <NavigationButtons showSkip={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
