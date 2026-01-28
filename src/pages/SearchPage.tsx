import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEntries } from '@/hooks/useEntries';
import { SearchBar } from '@/components/SearchBar';
import { EntryCard } from '@/components/EntryCard';
import { DecisionMoment } from '@/components/DecisionMoment';
import { EmptyState } from '@/components/EmptyState';
import { Entry } from '@/types/entry';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchEntries } = useEntries();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (query.length > 0) {
      setResults(searchEntries(query));
      setSearchParams({ q: query });
    } else {
      setResults([]);
      setSearchParams({});
    }
  }, [query, searchEntries, setSearchParams]);

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
  };

  const handleDecisionClose = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-serif font-semibold mb-4">Search memories</h1>
          <SearchBar 
            value={query} 
            onChange={setQuery}
            placeholder="How did I feel after..."
          />
        </motion.div>
      </header>

      {/* Results */}
      <div className="px-6 flex-1">
        {query.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Search for past experiences like "coffee late night" or "skipped workout"
            </p>
          </div>
        ) : results.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} {results.length === 1 ? 'memory' : 'memories'} found
            </p>
            {results.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EntryCard 
                  entry={entry} 
                  onClick={() => handleEntryClick(entry)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={Search}
            title="No matches"
            description={`No memories match "${query}". Try a different search term.`}
          />
        )}
      </div>

      {/* Decision Moment Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <DecisionMoment
            entry={selectedEntry}
            onSkip={() => {
              handleDecisionClose();
              // Could log that they skipped
            }}
            onDoAnyway={() => {
              handleDecisionClose();
              // Could prompt to log outcome later
            }}
            onClose={handleDecisionClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
