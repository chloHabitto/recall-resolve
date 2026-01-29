import { motion } from 'framer-motion';
import { Entry, PHYSICAL_RATINGS, WORTH_IT_OPTIONS, CATEGORIES } from '@/types/entry';
import { ENTRY_TYPES } from '@/types/behavior';
import { formatDistanceToNow } from 'date-fns';

interface EntryCardProps {
  entry: Entry;
  onClick?: () => void;
  compact?: boolean;
}

export function EntryCard({ entry, onClick, compact = false }: EntryCardProps) {
  const rating = PHYSICAL_RATINGS.find(r => r.value === entry.physicalRating);
  const worth = WORTH_IT_OPTIONS.find(w => w.value === entry.worthIt);
  const category = CATEGORIES.find(c => c.value === entry.category);
  const entryType = ENTRY_TYPES.find(t => t.value === entry.entryType);

  const worthColorClass = {
    yes: 'bg-secondary text-secondary-foreground',
    meh: 'bg-accent/20 text-accent-foreground',
    no: 'bg-destructive/10 text-destructive',
  }[entry.worthIt];

  const isResisted = entry.entryType === 'resisted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        bg-card rounded-lg shadow-soft border border-border/50 cursor-pointer
        transition-shadow hover:shadow-medium
        ${compact ? 'p-3' : 'p-4'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{category?.emoji}</span>
            <h3 className={`font-medium truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {entry.action}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>{entry.context.join(' · ')}</span>
            <span>·</span>
            <span>{formatDistanceToNow(entry.createdAt, { addSuffix: true })}</span>
          </div>

          {entry.note && !compact && (
            <p className="text-sm text-muted-foreground italic line-clamp-2">
              "{entry.note}"
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-2xl">{isResisted ? '💪' : rating?.emoji}</span>
          {isResisted ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">
              Resisted!
            </span>
          ) : (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${worthColorClass}`}>
              {worth?.emoji} {worth?.label}
            </span>
          )}
        </div>
      </div>

      {!compact && entry.emotionalTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.emotionalTags.map(tag => (
            <span 
              key={tag}
              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
