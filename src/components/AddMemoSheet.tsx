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

  const handleOutcomeSelect = (selected: MemoOutcome) => {
    setOutcome(selected);
    setStep('feeling');
  };

  const handleFeelingSelect = (selected: PhysicalRating) => {
    setFeeling(selected);
    setStep('note');
  };

  const handleSubmit = () => {
    if (outcome && feeling) {
      onAddMemo({
        outcome,
        feeling,
        note: note.trim(),
      });
      handleClose();
    }
  };

  const handleBack = () => {
    if (step === 'feeling') setStep('outcome');
    else if (step === 'note') setStep('feeling');
  };

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
                  onClick={() => handleOutcomeSelect(opt.value)}
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
                    onClick={() => handleFeelingSelect(r.value)}
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
              <button
                onClick={handleBack}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
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
                  {MEMO_OUTCOMES.find(o => o.value === outcome)?.emoji}
                </span>
                <span className="text-xl">
                  {PHYSICAL_RATINGS.find(r => r.value === feeling)?.emoji}
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

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Add Memo
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
