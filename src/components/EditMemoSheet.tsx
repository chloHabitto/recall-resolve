import { useState, useEffect } from 'react';
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

interface EditMemoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memo: Memo | null;
  onSave: (updates: Partial<Memo>) => void;
}

export function EditMemoSheet({ open, onOpenChange, memo, onSave }: EditMemoSheetProps) {
  const [outcome, setOutcome] = useState<MemoOutcome>('did-again');
  const [feeling, setFeeling] = useState<PhysicalRating>('fine');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (memo) {
      setOutcome(memo.outcome);
      setFeeling(memo.feeling);
      setNote(memo.note);
    }
  }, [memo]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSave = () => {
    onSave({
      outcome,
      feeling,
      note: note.trim(),
    });
    handleClose();
  };

  if (!memo) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center font-serif">Edit Memo</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Outcome */}
          <div className="space-y-2">
            <label className="text-sm font-medium">What happened?</label>
            <div className="space-y-2">
              {MEMO_OUTCOMES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOutcome(opt.value)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    outcome === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="font-medium text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feeling */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How did it feel?</label>
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
                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-xs">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 150))}
              placeholder="A quick note to yourself..."
              className="bg-muted/50 min-h-[80px] resize-none"
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground text-right">{note.length}/150</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
