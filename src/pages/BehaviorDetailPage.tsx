import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Check, X, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { useBehaviors } from '@/hooks/useBehaviors';
import { ThreadTimeline } from '@/components/ThreadTimeline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types/entry';
import { toast } from 'sonner';

export function BehaviorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries } = useEntries();
  const { behaviors, updateBehavior, getBehaviorStats, getEntriesForBehavior } = useBehaviors(entries);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const behavior = behaviors.find(b => b.id === id);
  const stats = behavior ? getBehaviorStats(behavior.id) : null;
  const behaviorEntries = behavior ? getEntriesForBehavior(behavior.id) : [];
  const category = behavior ? CATEGORIES.find(c => c.value === behavior.category) : null;

  useEffect(() => {
    if (behavior) {
      setEditName(behavior.name);
    }
  }, [behavior]);

  if (!behavior || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <p className="text-muted-foreground mb-4">Behavior pattern not found</p>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const handleSaveEdit = () => {
    if (editName.trim()) {
      updateBehavior(behavior.id, { name: editName.trim() });
      toast.success('Pattern updated');
      setIsEditing(false);
    }
  };

  const trendIcon = {
    improving: <TrendingUp className="w-4 h-4 text-secondary" />,
    declining: <TrendingDown className="w-4 h-4 text-destructive" />,
    stable: <Minus className="w-4 h-4 text-muted-foreground" />,
    new: <Plus className="w-4 h-4 text-primary" />,
  }[stats.trend];

  const trendLabel = {
    improving: 'Getting better',
    declining: 'Needs attention',
    stable: 'Holding steady',
    new: 'New pattern',
  }[stats.trend];

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
            onClick={isEditing ? () => setIsEditing(false) : () => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            {isEditing ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-serif font-medium"
                autoFocus
              />
            ) : (
              <h1 className="text-xl font-serif font-medium">{behavior.name}</h1>
            )}
          </div>
          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="p-2 rounded-full hover:bg-secondary/80 text-primary transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      </header>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Pattern Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{category?.emoji}</span>
            <span className="text-sm text-muted-foreground">{category?.label}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold">{stats.totalEntries}</div>
              <div className="text-xs text-muted-foreground">Total entries</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold text-secondary">{stats.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success rate</div>
            </div>
          </div>

          {/* Trend */}
          <div className="flex items-center justify-center gap-2 py-3 border-t border-border/50">
            {trendIcon}
            <span className="text-sm">{trendLabel}</span>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-around pt-3 border-t border-border/50 text-sm text-muted-foreground">
            <div className="text-center">
              <span className="block text-foreground font-medium">{stats.resistedCount}</span>
              <span>Resisted</span>
            </div>
            <div className="text-center">
              <span className="block text-foreground font-medium">{stats.didItCount}</span>
              <span>Did it</span>
            </div>
            <div className="text-center">
              <span className="block text-foreground font-medium">{stats.reflectionCount}</span>
              <span>Reflections</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            ─────── Memory Thread ───────
          </h3>
          <div className="bg-card rounded-xl shadow-soft border border-border/50 py-2">
            <ThreadTimeline 
              entries={behaviorEntries} 
              behaviorName={behavior.name}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
