import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Filter } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { EntryCard } from '@/components/EntryCard';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORIES, Category } from '@/types/entry';
import { useNavigate } from 'react-router-dom';

interface LibraryPageProps {
  onLogClick: () => void;
}

export function LibraryPage({ onLogClick }: LibraryPageProps) {
  const { entries, isLoading } = useEntries();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredEntries = selectedCategory === 'all' 
    ? entries 
    : entries.filter(e => e.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-serif font-semibold mb-4">Memory library</h1>
          
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

      {/* Entries */}
      <div className="px-6 flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground mb-4">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'memory' : 'memories'}
            </p>
            <AnimatePresence mode="popLayout">
              {filteredEntries.map((entry, index) => (
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
        ) : (
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
        )}
      </div>
    </div>
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
