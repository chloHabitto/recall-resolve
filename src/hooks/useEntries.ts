import { useState, useEffect, useCallback } from 'react';
import { Entry, Memo } from '@/types/entry';

const STORAGE_KEY = 'worthit_entries';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed.map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          // Default entryType for existing entries without it
          entryType: e.entryType || 'did-it',
          // Parse memo dates if they exist
          memos: e.memos?.map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt),
          })) || [],
        })));
      } catch {
        setEntries([]);
      }
    }
    setIsLoading(false);
  }, []);

  const saveEntries = useCallback((newEntries: Entry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    setEntries(newEntries);
  }, []);

  const addEntry = useCallback((entry: Omit<Entry, 'id' | 'createdAt'>) => {
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      memos: [],
    };
    const newEntries = [newEntry, ...entries];
    saveEntries(newEntries);
    return newEntry;
  }, [entries, saveEntries]);

  const updateEntry = useCallback((id: string, updates: Partial<Entry>) => {
    const newEntries = entries.map(e => 
      e.id === id ? { ...e, ...updates } : e
    );
    saveEntries(newEntries);
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    const newEntries = entries.filter(e => e.id !== id);
    saveEntries(newEntries);
  }, [entries, saveEntries]);

  const addMemo = useCallback((entryId: string, memo: Omit<Memo, 'id' | 'createdAt'>) => {
    const newMemo: Memo = {
      ...memo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    const newEntries = entries.map(e => {
      if (e.id === entryId) {
        return {
          ...e,
          memos: [...(e.memos || []), newMemo],
        };
      }
      return e;
    });
    saveEntries(newEntries);
    return newMemo;
  }, [entries, saveEntries]);

  const searchEntries = useCallback((query: string) => {
    const q = query.toLowerCase();
    return entries.filter(e => 
      e.action.toLowerCase().includes(q) ||
      e.note.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.emotionalTags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [entries]);

  const getRecentEntries = useCallback((limit = 5) => {
    return entries.slice(0, limit);
  }, [entries]);

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    addMemo,
    searchEntries,
    getRecentEntries,
  };
}
