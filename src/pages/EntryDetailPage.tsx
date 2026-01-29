import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Pencil, Check, X, GitBranch, Plus, Eye, EyeOff } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { useBehaviors } from '@/hooks/useBehaviors';
import { ThreadTimeline } from '@/components/ThreadTimeline';
import { AddMemoSheet } from '@/components/AddMemoSheet';
import { EditMemoSheet } from '@/components/EditMemoSheet';
import { MemoCard } from '@/components/MemoCard';
import { 
  PHYSICAL_RATINGS, 
  WORTH_IT_OPTIONS, 
  CATEGORIES, 
  TIME_OF_DAY,
  EMOTION_TAGS,
  MEMO_OUTCOMES,
  Entry,
  Memo,
  PhysicalRating,
  WorthIt,
  Category,
  TimeOfDay
} from '@/types/entry';
import { ENTRY_TYPES, Behavior } from '@/types/behavior';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const { entries, deleteEntry, updateEntry, addMemo, updateMemo, deleteMemo } = useEntries();
  const { behaviors, getBehaviorStats, getEntriesForBehavior } = useBehaviors(entries);
  const [isEditing, setIsEditing] = useState(false);
  const [memoSheetOpen, setMemoSheetOpen] = useState(false);
  const [editMemoSheetOpen, setEditMemoSheetOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [showHiddenMemos, setShowHiddenMemos] = useState(false);
  
  const entry = entries.find(e => e.id === id);
  
  // Get linked behavior if any
  const linkedBehavior = entry?.behaviorId 
    ? behaviors.find(b => b.id === entry.behaviorId)
    : undefined;
  const behaviorStats = linkedBehavior ? getBehaviorStats(linkedBehavior.id) : undefined;
  const behaviorEntries = linkedBehavior ? getEntriesForBehavior(linkedBehavior.id) : [];

  // Edit form state
  const [editForm, setEditForm] = useState<{
    action: string;
    category: Category;
    context: TimeOfDay[];
    physicalRating: PhysicalRating;
    emotionalTags: string[];
    worthIt: WorthIt;
    note: string;
  } | null>(null);

  const startEditing = () => {
    if (entry) {
      setEditForm({
        action: entry.action,
        category: entry.category,
        context: [...entry.context],
        physicalRating: entry.physicalRating,
        emotionalTags: [...entry.emotionalTags],
        worthIt: entry.worthIt,
        note: entry.note,
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const saveChanges = () => {
    if (entry && editForm) {
      updateEntry(entry.id, editForm);
      toast.success('Memory updated');
      setIsEditing(false);
      setEditForm(null);
    }
  };

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

  const handleAddMemo = (memo: Omit<Memo, 'id' | 'createdAt'>) => {
    addMemo(entry.id, memo);
    toast.success('Memo added!');
  };

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo);
    setEditMemoSheetOpen(true);
  };

  const handleSaveMemoEdit = (updates: Partial<Memo>) => {
    if (editingMemo) {
      updateMemo(entry.id, editingMemo.id, updates);
      toast.success('Memo updated!');
      setEditingMemo(null);
    }
  };

  const handleDeleteMemo = (memoId: string) => {
    deleteMemo(entry.id, memoId);
    toast.success('Memo deleted');
  };

  const handleToggleMemoStar = (memoId: string, isStarred: boolean) => {
    updateMemo(entry.id, memoId, { isStarred: !isStarred });
    toast.success(isStarred ? 'Unstarred' : 'Starred!');
  };

  const handleToggleMemoHide = (memoId: string, isHidden: boolean) => {
    updateMemo(entry.id, memoId, { isHidden: !isHidden });
    toast.success(isHidden ? 'Memo visible' : 'Memo hidden');
  };

  const toggleContext = (time: TimeOfDay) => {
    if (!editForm) return;
    const newContext = editForm.context.includes(time)
      ? editForm.context.filter(t => t !== time)
      : [...editForm.context, time];
    setEditForm({ ...editForm, context: newContext });
  };

  const toggleEmotion = (tag: string) => {
    if (!editForm) return;
    const newTags = editForm.emotionalTags.includes(tag)
      ? editForm.emotionalTags.filter(t => t !== tag)
      : [...editForm.emotionalTags, tag];
    setEditForm({ ...editForm, emotionalTags: newTags });
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
            onClick={isEditing ? cancelEditing : () => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            {isEditing ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="text-xl font-serif font-medium flex-1">
            {isEditing ? 'Edit memory' : 'Memory details'}
          </h1>
          {isEditing ? (
            <button 
              onClick={saveChanges}
              className="p-2 rounded-full hover:bg-secondary/80 text-primary transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={startEditing}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      </header>

      {/* Content */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {isEditing && editForm ? (
            <EditMode 
              key="edit"
              editForm={editForm}
              setEditForm={setEditForm}
              toggleContext={toggleContext}
              toggleEmotion={toggleEmotion}
            />
          ) : (
            <ViewMode 
              key="view"
              entry={entry}
              rating={rating}
              worth={worth}
              category={category}
              worthColorClass={worthColorClass}
              handleDelete={handleDelete}
              linkedBehavior={linkedBehavior}
              behaviorStats={behaviorStats}
              behaviorEntries={behaviorEntries}
              onAddMemo={() => setMemoSheetOpen(true)}
              onEditMemo={handleEditMemo}
              onDeleteMemo={handleDeleteMemo}
              onToggleMemoStar={handleToggleMemoStar}
              onToggleMemoHide={handleToggleMemoHide}
              showHiddenMemos={showHiddenMemos}
              onToggleShowHidden={() => setShowHiddenMemos(!showHiddenMemos)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Add Memo Sheet */}
      <AddMemoSheet
        open={memoSheetOpen}
        onOpenChange={setMemoSheetOpen}
        onAddMemo={handleAddMemo}
        actionName={entry.action}
      />

      {/* Edit Memo Sheet */}
      <EditMemoSheet
        open={editMemoSheetOpen}
        onOpenChange={setEditMemoSheetOpen}
        memo={editingMemo}
        onSave={handleSaveMemoEdit}
      />
    </div>
  );
}

// View Mode Component
function ViewMode({ 
  entry, 
  rating, 
  worth, 
  category, 
  worthColorClass,
  handleDelete,
  linkedBehavior,
  behaviorStats,
  behaviorEntries,
  onAddMemo,
  onEditMemo,
  onDeleteMemo,
  onToggleMemoStar,
  onToggleMemoHide,
  showHiddenMemos,
  onToggleShowHidden
}: {
  entry: Entry;
  rating: typeof PHYSICAL_RATINGS[0] | undefined;
  worth: typeof WORTH_IT_OPTIONS[0] | undefined;
  category: typeof CATEGORIES[0] | undefined;
  worthColorClass: string;
  handleDelete: () => void;
  linkedBehavior?: Behavior;
  behaviorStats?: import('@/types/behavior').BehaviorStats;
  behaviorEntries: Entry[];
  onAddMemo: () => void;
  onEditMemo: (memo: Memo) => void;
  onDeleteMemo: (memoId: string) => void;
  onToggleMemoStar: (memoId: string, isStarred: boolean) => void;
  onToggleMemoHide: (memoId: string, isHidden: boolean) => void;
  showHiddenMemos: boolean;
  onToggleShowHidden: () => void;
}) {
  const navigate = useNavigate();
  const entryTypeInfo = ENTRY_TYPES.find(t => t.value === entry.entryType) || ENTRY_TYPES[0];
  
  const timeLabels = entry.context.map(c => 
    TIME_OF_DAY.find(t => t.value === c)?.label
  ).filter(Boolean).join(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Entry Type Badge */}
      {entry.entryType && entry.entryType !== 'did-it' && (
        <div className="text-center">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            entry.entryType === 'resisted' 
              ? 'bg-secondary/20 text-secondary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            <span>{entryTypeInfo.emoji}</span>
            {entry.entryType === 'resisted' ? '💪 Resisted!' : 'Reflection'}
          </span>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center">
        {/* Large Emotional Anchor */}
        <div className="text-6xl mb-4">
          {entry.entryType === 'resisted' ? '💪' : rating?.emoji}
        </div>
        
        {/* Action Title */}
        <h2 className="text-2xl font-serif font-medium mb-2">{entry.action}</h2>
        
        {/* Category & Context */}
        <p className="text-sm text-muted-foreground mb-4">
          {category?.emoji} {category?.label} · {timeLabels}
        </p>
        
        {/* Time ago */}
        <p className="text-xs text-muted-foreground mb-4">
          {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
        </p>
        
        {/* Worth It Badge (only for did-it entries) */}
        {entry.entryType !== 'resisted' && (
          <div className="inline-block mb-4">
            <span className={`text-lg font-medium px-5 py-2 rounded-full ${worthColorClass}`}>
              {worth?.emoji} {entry.worthIt === 'yes' ? 'Worth It' : entry.worthIt === 'meh' ? 'Meh' : 'Not Worth It'}
            </span>
          </div>
        )}

        {/* How It Felt - integrated */}
        <div className="border-t border-border/50 pt-4 mt-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xl">{rating?.emoji}</span>
            <span className="text-sm text-muted-foreground">Felt {rating?.label?.toLowerCase()}</span>
          </div>
          
          {entry.emotionalTags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
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
        </div>

        {/* Note - integrated */}
        {entry.note && (
          <div className="border-t border-border/50 pt-4 mt-2">
            <p className="text-sm italic text-muted-foreground">"{entry.note}"</p>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground text-center">
          ─────── Timeline ───────
        </h3>
        
        {/* Original Memory Anchor */}
        <div className="bg-primary/10 rounded-xl p-3 flex items-center gap-3">
          <span className="text-lg">📍</span>
          <span className="text-sm font-medium text-primary">This is the original memory</span>
        </div>
        
        {/* Memos List */}
        {entry.memos && entry.memos.length > 0 ? (
          <div className="space-y-2">
            {/* Show/hide hidden memos toggle */}
            {entry.memos.some(m => m.isHidden) && (
              <button
                onClick={onToggleShowHidden}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                {showHiddenMemos ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Hide hidden memos
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Show {entry.memos.filter(m => m.isHidden).length} hidden
                  </>
                )}
              </button>
            )}
            
            {entry.memos.map((memo, index) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                index={index}
                onEdit={() => onEditMemo(memo)}
                onDelete={() => onDeleteMemo(memo.id)}
                onToggleStar={() => onToggleMemoStar(memo.id, !!memo.isStarred)}
                onToggleHide={() => onToggleMemoHide(memo.id, !!memo.isHidden)}
                showHidden={showHiddenMemos}
              />
            ))}
            
            {/* Add another memo button */}
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={onAddMemo}
            >
              <Plus className="w-4 h-4" />
              Add another memo
            </Button>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50 text-center">
            <p className="text-muted-foreground mb-1">No follow-up memos yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Track what happens next time you face this decision.
            </p>
            <Button variant="outline" className="gap-2" onClick={onAddMemo}>
              <Plus className="w-4 h-4" />
              Add a memo
            </Button>
          </div>
        )}
      </div>

      {/* Behavior Thread Timeline */}
      {linkedBehavior && behaviorStats && behaviorEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 justify-center">
            <GitBranch className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">
              ─────── {linkedBehavior.name} ───────
            </h3>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">
                {behaviorStats.totalEntries} entries
              </span>
              <span className="text-sm font-medium text-secondary">
                {behaviorStats.successRate}% success rate
              </span>
            </div>
            <ThreadTimeline 
              entries={behaviorEntries} 
              behaviorName={linkedBehavior.name}
            />
          </div>
        </motion.div>
      )}

      {/* Delete Button */}
      <div className="pt-4 text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="inline-flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors text-sm">
              <Trash2 className="w-4 h-4" />
              Delete this memory
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
      </div>
    </motion.div>
  );
}

// Edit Mode Component
function EditMode({ 
  editForm, 
  setEditForm,
  toggleContext,
  toggleEmotion
}: {
  editForm: {
    action: string;
    category: Category;
    context: TimeOfDay[];
    physicalRating: PhysicalRating;
    emotionalTags: string[];
    worthIt: WorthIt;
    note: string;
  };
  setEditForm: (form: typeof editForm) => void;
  toggleContext: (time: TimeOfDay) => void;
  toggleEmotion: (tag: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* What did you do? */}
      <div className="space-y-2">
        <label className="text-sm font-medium">What did you do?</label>
        <Input
          value={editForm.action}
          onChange={(e) => setEditForm({ ...editForm, action: e.target.value })}
          placeholder="e.g., Late-night snack"
          className="bg-card"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setEditForm({ ...editForm, category: cat.value })}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                editForm.category === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* When was this? */}
      <div className="space-y-2">
        <label className="text-sm font-medium">When was this?</label>
        <div className="flex flex-wrap gap-2">
          {TIME_OF_DAY.map((time) => (
            <button
              key={time.value}
              onClick={() => toggleContext(time.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                editForm.context.includes(time.value)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Physical Rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium">How did it feel physically?</label>
        <div className="grid grid-cols-4 gap-2">
          {PHYSICAL_RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => setEditForm({ ...editForm, physicalRating: r.value })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                editForm.physicalRating === r.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span className="text-2xl">{r.emoji}</span>
              <span className="text-xs">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emotions */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Emotions (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {EMOTION_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleEmotion(tag)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${
                editForm.emotionalTags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Worth It */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Was it worth it?</label>
        <div className="grid grid-cols-3 gap-2">
          {WORTH_IT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setEditForm({ ...editForm, worthIt: option.value })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                editForm.worthIt === option.value
                  ? option.value === 'yes' 
                    ? 'bg-secondary text-secondary-foreground'
                    : option.value === 'no'
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-accent/30 text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{option.emoji}</span>
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Note (optional)</label>
        <Textarea
          value={editForm.note}
          onChange={(e) => setEditForm({ ...editForm, note: e.target.value.slice(0, 200) })}
          placeholder="A note to your future self..."
          className="bg-card min-h-[100px]"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground text-right">{editForm.note.length}/200</p>
      </div>
    </motion.div>
  );
}
