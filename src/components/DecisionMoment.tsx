import { motion } from 'framer-motion';
import { X, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Entry, PHYSICAL_RATINGS, WORTH_IT_OPTIONS, CATEGORIES } from '@/types/entry';
import { formatDistanceToNow } from 'date-fns';

interface DecisionMomentProps {
  entry: Entry;
  onSkip: () => void;
  onDoAnyway: () => void;
  onClose: () => void;
}

export function DecisionMoment({ entry, onSkip, onDoAnyway, onClose }: DecisionMomentProps) {
  const rating = PHYSICAL_RATINGS.find(r => r.value === entry.physicalRating);
  const worth = WORTH_IT_OPTIONS.find(w => w.value === entry.worthIt);
  const category = CATEGORIES.find(c => c.value === entry.category);

  const worthColorClass = {
    yes: 'text-secondary-foreground',
    meh: 'text-accent-foreground',
    no: 'text-destructive',
  }[entry.worthIt];

  const bgGradient = {
    yes: 'from-secondary/20 to-background',
    meh: 'from-accent/10 to-background',
    no: 'from-destructive/10 to-background',
  }[entry.worthIt];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-gradient-to-b ${bgGradient}`}
    >
      <div className="flex flex-col h-full max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl mb-6"
          >
            {rating?.emoji}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              {category?.emoji} {entry.context.join(' · ')} · {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
            </p>
            <h2 className="text-2xl font-serif font-medium mb-4">
              {entry.action}
            </h2>
            <p className={`text-xl font-medium mb-6 ${worthColorClass}`}>
              {worth?.emoji} {entry.worthIt === 'yes' ? 'Worth it' : entry.worthIt === 'meh' ? 'Meh' : 'Not worth it'}
            </p>
          </motion.div>

          {entry.note && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-5 shadow-soft border border-border/50 max-w-sm"
            >
              <p className="text-sm text-muted-foreground mb-1">You wrote:</p>
              <p className="italic">"{entry.note}"</p>
            </motion.div>
          )}

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-xl font-serif font-medium"
          >
            Worth it this time?
          </motion.p>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <Button
            onClick={onSkip}
            variant="secondary"
            size="lg"
            className="flex-1 py-6"
          >
            <ThumbsDown className="w-5 h-5 mr-2" />
            Skip it
          </Button>
          <Button
            onClick={onDoAnyway}
            variant="outline"
            size="lg"
            className="flex-1 py-6"
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            Do it anyway
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
