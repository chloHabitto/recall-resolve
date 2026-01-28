import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { EntryCard } from '@/components/EntryCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onLogClick: () => void;
}

export function HomePage({ onLogClick }: HomePageProps) {
  const { entries, getRecentEntries, isLoading } = useEntries();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const recentEntries = getRecentEntries(3);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-serif font-semibold mb-1">Worth It?</h1>
          <p className="text-muted-foreground">Before you do it again… remember.</p>
        </motion.div>
      </header>

      {/* Search */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar 
            value={searchQuery} 
            onChange={(q) => {
              setSearchQuery(q);
              if (q.length > 0) {
                navigate(`/search?q=${encodeURIComponent(q)}`);
              }
            }}
          />
        </motion.div>
      </div>

      {/* Quick Log */}
      <div className="px-6 mb-8">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogClick}
          className="w-full flex items-center gap-4 p-5 bg-primary text-primary-foreground rounded-xl shadow-glow"
        >
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-medium text-lg">Log an experience</p>
            <p className="text-primary-foreground/70 text-sm">Quick & easy, under 60 seconds</p>
          </div>
        </motion.button>
      </div>

      {/* Recent Entries */}
      <div className="px-6 flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-medium">Recent memories</h2>
            {entries.length > 3 && (
              <button 
                onClick={() => navigate('/library')}
                className="text-sm text-primary font-medium hover:underline"
              >
                See all
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <EntryCard 
                    entry={entry} 
                    onClick={() => navigate(`/entry/${entry.id}`)}
                    compact 
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No memories yet"
              description="Start by logging your first experience. It only takes a minute."
              action={{
                label: "Log your first experience",
                onClick: onLogClick,
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
