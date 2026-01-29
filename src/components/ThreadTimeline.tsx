import { motion } from 'framer-motion';
import { Entry, PHYSICAL_RATINGS, WORTH_IT_OPTIONS } from '@/types/entry';
import { ENTRY_TYPES } from '@/types/behavior';
import { format, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ThreadTimelineProps {
  entries: Entry[];
  behaviorName: string;
  onEntryClick?: (entry: Entry) => void;
}

export function ThreadTimeline({ entries, behaviorName, onEntryClick }: ThreadTimelineProps) {
  const navigate = useNavigate();

  const handleClick = (entry: Entry) => {
    if (onEntryClick) {
      onEntryClick(entry);
    } else {
      navigate(`/entry/${entry.id}`);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No entries yet
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />

      <div className="space-y-1">
        {entries.map((entry, index) => {
          const entryTypeInfo = ENTRY_TYPES.find(t => t.value === entry.entryType) || ENTRY_TYPES[0];
          const rating = PHYSICAL_RATINGS.find(r => r.value === entry.physicalRating);
          const worth = WORTH_IT_OPTIONS.find(w => w.value === entry.worthIt);

          const dotColor = {
            'did-it': entry.worthIt === 'yes' ? 'bg-secondary' : entry.worthIt === 'no' ? 'bg-destructive' : 'bg-accent',
            'resisted': 'bg-secondary',
            'reflection': 'bg-muted-foreground',
          }[entry.entryType || 'did-it'];

          const dotStyle = entry.entryType === 'resisted' 
            ? 'ring-2 ring-secondary bg-background' 
            : dotColor;

          return (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleClick(entry)}
              className="relative flex items-start gap-4 w-full text-left p-3 pl-10 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              {/* Timeline dot */}
              <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-full ${dotStyle} z-10`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {format(new Date(entry.createdAt), 'MMM d')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    — {entryTypeInfo.label}
                  </span>
                  {entry.entryType === 'resisted' && (
                    <span className="text-sm">💪</span>
                  )}
                  {entry.entryType === 'did-it' && rating && (
                    <span className="text-sm">{rating.emoji}</span>
                  )}
                </div>

                {entry.note ? (
                  <p className="text-sm text-foreground line-clamp-2 italic">
                    "{entry.note}"
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {entry.entryType === 'resisted' 
                      ? 'Resisted the urge' 
                      : entry.entryType === 'reflection'
                      ? 'Reflected on this behavior'
                      : `Felt ${rating?.label?.toLowerCase() || 'okay'}`
                    }
                  </p>
                )}

                {/* Worth it indicator for did-it entries */}
                {entry.entryType === 'did-it' && worth && (
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.worthIt === 'yes' 
                        ? 'bg-secondary/20 text-secondary-foreground' 
                        : entry.worthIt === 'no'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-accent/20 text-accent-foreground'
                    }`}>
                      {worth.emoji} {worth.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Time ago on hover */}
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
