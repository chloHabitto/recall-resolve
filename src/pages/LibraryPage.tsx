import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, GitBranch, List, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { useBehaviors } from '@/hooks/useBehaviors';
import { EntryCard } from '@/components/EntryCard';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORIES, Category } from '@/types/entry';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface LibraryPageProps {
  onLogClick: () => void;
}

type ViewMode = 'entries' | 'threads';

export function LibraryPage({ onLogClick }: LibraryPageProps) {
  const { entries, isLoading } = useEntries();
  const { recentBehaviors } = useBehaviors(entries);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('entries');

  const filteredEntries = selectedCategory === 'all' 
    ? entries 
    : entries.filter(e => e.category === selectedCategory);

  const filteredBehaviors = selectedCategory === 'all'
    ? recentBehaviors
    : recentBehaviors.filter(b => b.behavior.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-serif font-semibold mb-4">Memory library</h1>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('entries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'entries'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              <List className="w-4 h-4" />
              Entries
            </button>
            <button
              onClick={() => setViewMode('threads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'threads'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              Threads
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            <FilterChip
              label="All"
              isActive={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            />
            {CATEGORIES.map(c => (
              <FilterChip
                key={c.value}
                label={`${c.emoji} ${c.label}`}
                isActive={selectedCategory === c.value}
                onClick={() => setSelectedCategory(c.value)}
              />
            ))}
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <div className="px-6 flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'entries' ? (
            <EntriesView 
              key="entries"
              entries={filteredEntries}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              onLogClick={onLogClick}
              navigate={navigate}
            />
          ) : (
            <ThreadsView
              key="threads"
              behaviors={filteredBehaviors}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              onLogClick={onLogClick}
              navigate={navigate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EntriesView({
  entries,
  isLoading,
  selectedCategory,
  onLogClick,
  navigate,
}: {
  entries: ReturnType<typeof useEntries>['entries'];
  isLoading: boolean;
  selectedCategory: Category | 'all';
  onLogClick: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Library}
        title={selectedCategory === 'all' ? 'No memories yet' : 'No memories in this category'}
        description={
          selectedCategory === 'all' 
            ? 'Start logging experiences to build your memory library.'
            : 'Try selecting a different category or log a new experience.'
        }
        action={selectedCategory === 'all' ? {
          label: "Log your first experience",
          onClick: onLogClick,
        } : undefined}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      <p className="text-sm text-muted-foreground mb-4">
        {entries.length} {entries.length === 1 ? 'memory' : 'memories'}
      </p>
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.03 }}
          >
            <EntryCard 
              entry={entry} 
              onClick={() => navigate(`/entry/${entry.id}`)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function ThreadsView({
  behaviors,
  isLoading,
  selectedCategory,
  onLogClick,
  navigate,
}: {
  behaviors: ReturnType<typeof useBehaviors>['recentBehaviors'];
  isLoading: boolean;
  selectedCategory: Category | 'all';
  onLogClick: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (behaviors.length === 0) {
    return (
      <EmptyState
        icon={GitBranch}
        title={selectedCategory === 'all' ? 'No behavior threads yet' : 'No threads in this category'}
        description={
          selectedCategory === 'all' 
            ? 'Threads are created when you log similar experiences over time.'
            : 'Try selecting a different category.'
        }
        action={selectedCategory === 'all' ? {
          label: "Log an experience",
          onClick: onLogClick,
        } : undefined}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      <p className="text-sm text-muted-foreground mb-4">
        {behaviors.length} {behaviors.length === 1 ? 'pattern' : 'patterns'}
      </p>
      <AnimatePresence mode="popLayout">
        {behaviors.map(({ behavior, stats }, index) => {
          const category = CATEGORIES.find(c => c.value === behavior.category);
          const trendIcon = {
            improving: <TrendingUp className="w-4 h-4 text-secondary" />,
            declining: <TrendingDown className="w-4 h-4 text-destructive" />,
            stable: <Minus className="w-4 h-4 text-muted-foreground" />,
            new: null,
          }[stats.trend];

          return (
            <motion.button
              key={behavior.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => navigate(`/behavior/${behavior.id}`)}
              className="w-full bg-card rounded-xl p-4 shadow-soft border border-border/50 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
            >
              {/* Category Icon */}
              <div className="text-2xl">{category?.emoji}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{behavior.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.totalEntries} entries · {stats.successRate}% success
                  {stats.lastEntryDate && (
                    <> · Last {formatDistanceToNow(new Date(stats.lastEntryDate), { addSuffix: true })}</>
                  )}
                </p>
              </div>

              {/* Trend & Arrow */}
              <div className="flex items-center gap-2">
                {trendIcon}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

function FilterChip({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-card border border-border hover:border-primary/50'
      }`}
    >
      {label}
    </button>
  );
}
