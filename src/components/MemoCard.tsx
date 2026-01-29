import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2, Star, EyeOff, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Memo, MEMO_OUTCOMES, PHYSICAL_RATINGS } from '@/types/entry';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MemoCardProps {
  memo: Memo;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
  onToggleHide: () => void;
  showHidden?: boolean;
}

export function MemoCard({ 
  memo, 
  index, 
  onEdit, 
  onDelete, 
  onToggleStar, 
  onToggleHide,
  showHidden = false 
}: MemoCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const outcomeInfo = MEMO_OUTCOMES.find(o => o.value === memo.outcome);
  const feelingInfo = PHYSICAL_RATINGS.find(r => r.value === memo.feeling);

  // Don't render hidden memos unless showHidden is true
  if (memo.isHidden && !showHidden) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: memo.isHidden ? 0.5 : 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-card rounded-xl p-4 shadow-soft border transition-all ${
          memo.isStarred 
            ? 'border-yellow-400/50 bg-yellow-50/5' 
            : 'border-border/50'
        } ${memo.isHidden ? 'opacity-50' : ''}`}
      >
        <div className="flex items-start gap-3">
          {/* Star indicator */}
          {memo.isStarred && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{outcomeInfo?.emoji}</span>
              <span className="text-sm font-medium">{outcomeInfo?.label}</span>
              <span className="text-lg">{feelingInfo?.emoji}</span>
              {memo.isHidden && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  Hidden
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDistanceToNow(new Date(memo.createdAt), { addSuffix: true })}
              </span>
            </div>
            {memo.note && (
              <p className="text-sm italic text-muted-foreground">"{memo.note}"</p>
            )}
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleStar}>
                <Star className={`w-4 h-4 mr-2 ${memo.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                {memo.isStarred ? 'Unstar' : 'Star as important'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleHide}>
                {memo.isHidden ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Unhide
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this memo?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This memo will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
