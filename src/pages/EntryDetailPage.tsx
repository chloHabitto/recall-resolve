import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { PHYSICAL_RATINGS, WORTH_IT_OPTIONS, CATEGORIES } from '@/types/entry';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, deleteEntry } = useEntries();
  
  const entry = entries.find(e => e.id === id);

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <p className="text-muted-foreground mb-4">Entry not found</p>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const rating = PHYSICAL_RATINGS.find(r => r.value === entry.physicalRating);
  const worth = WORTH_IT_OPTIONS.find(w => w.value === entry.worthIt);
  const category = CATEGORIES.find(c => c.value === entry.category);

  const worthColorClass = {
    yes: 'bg-secondary text-secondary-foreground',
    meh: 'bg-accent/20 text-accent-foreground',
    no: 'bg-destructive/10 text-destructive',
  }[entry.worthIt];

  const handleDelete = () => {
    deleteEntry(entry.id);
    toast.success('Memory deleted');
    navigate(-1);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-serif font-medium flex-1">Memory details</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this memory?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This memory will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </header>

      {/* Content */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Card */}
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{category?.emoji} {category?.label}</span>
                  <span>·</span>
                  <span>{entry.context.join(' · ')}</span>
                </div>
                <h2 className="text-2xl font-serif font-medium">{entry.action}</h2>
              </div>
              <span className="text-4xl">{rating?.emoji}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${worthColorClass}`}>
                {worth?.emoji} {entry.worthIt === 'yes' ? 'Worth it' : entry.worthIt === 'meh' ? 'Meh' : 'Not worth it'}
              </span>
              <span className="text-sm text-muted-foreground">
                {format(entry.createdAt, 'MMM d, yyyy · h:mm a')}
              </span>
            </div>

            {entry.emotionalTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.emotionalTags.map(tag => (
                  <span 
                    key={tag}
                    className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {entry.note && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Note to future you:</p>
                <p className="italic">"{entry.note}"</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
