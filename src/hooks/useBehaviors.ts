import { useState, useEffect, useCallback, useMemo } from 'react';
import { Behavior, BehaviorStats } from '@/types/behavior';
import { Entry, Category } from '@/types/entry';

const STORAGE_KEY = 'worthit_behaviors';

// Normalize action text for similarity comparison
function normalizeAction(action: string): string {
  return action
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity between two strings (Jaccard similarity on words)
function calculateSimilarity(a: string, b: string): number {
  const wordsA = new Set(normalizeAction(a).split(' '));
  const wordsB = new Set(normalizeAction(b).split(' '));
  
  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export function useBehaviors(entries: Entry[]) {
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load behaviors from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBehaviors(parsed.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
        })));
      } catch {
        setBehaviors([]);
      }
    }
    setIsLoading(false);
  }, []);

  const saveBehaviors = useCallback((newBehaviors: Behavior[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBehaviors));
    setBehaviors(newBehaviors);
  }, []);

  // Create a new behavior
  const createBehavior = useCallback((
    name: string, 
    category: Category,
    triggers: string[] = []
  ): Behavior => {
    const newBehavior: Behavior = {
      id: crypto.randomUUID(),
      name,
      category,
      triggers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveBehaviors([...behaviors, newBehavior]);
    return newBehavior;
  }, [behaviors, saveBehaviors]);

  // Update a behavior
  const updateBehavior = useCallback((id: string, updates: Partial<Behavior>) => {
    const newBehaviors = behaviors.map(b =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
    );
    saveBehaviors(newBehaviors);
  }, [behaviors, saveBehaviors]);

  // Delete a behavior
  const deleteBehavior = useCallback((id: string) => {
    const newBehaviors = behaviors.filter(b => b.id !== id);
    saveBehaviors(newBehaviors);
  }, [behaviors, saveBehaviors]);

  // Get entries for a specific behavior
  const getEntriesForBehavior = useCallback((behaviorId: string): Entry[] => {
    return entries
      .filter(e => e.behaviorId === behaviorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [entries]);

  // Calculate stats for a behavior
  const getBehaviorStats = useCallback((behaviorId: string): BehaviorStats => {
    const behaviorEntries = getEntriesForBehavior(behaviorId);
    
    const didItCount = behaviorEntries.filter(e => e.entryType === 'did-it').length;
    const resistedCount = behaviorEntries.filter(e => e.entryType === 'resisted').length;
    const reflectionCount = behaviorEntries.filter(e => e.entryType === 'reflection').length;
    const total = behaviorEntries.length;
    
    // Success rate: resisted / (resisted + did-it)
    const actionableCount = resistedCount + didItCount;
    const successRate = actionableCount > 0 
      ? Math.round((resistedCount / actionableCount) * 100) 
      : 0;
    
    // Calculate trend based on recent entries
    let trend: BehaviorStats['trend'] = 'new';
    if (total >= 3) {
      const recentEntries = behaviorEntries.slice(0, 3);
      const recentResisted = recentEntries.filter(e => e.entryType === 'resisted').length;
      const olderEntries = behaviorEntries.slice(3, 6);
      const olderResisted = olderEntries.filter(e => e.entryType === 'resisted').length;
      
      if (olderEntries.length > 0) {
        const recentRate = recentResisted / recentEntries.length;
        const olderRate = olderResisted / olderEntries.length;
        
        if (recentRate > olderRate + 0.1) trend = 'improving';
        else if (recentRate < olderRate - 0.1) trend = 'declining';
        else trend = 'stable';
      }
    }
    
    return {
      totalEntries: total,
      resistedCount,
      didItCount,
      reflectionCount,
      successRate,
      lastEntryDate: behaviorEntries[0]?.createdAt || null,
      firstEntryDate: behaviorEntries[total - 1]?.createdAt || null,
      trend,
    };
  }, [getEntriesForBehavior]);

  // Find similar existing behaviors to an action
  const findSimilarBehaviors = useCallback((action: string, threshold = 0.5): Behavior[] => {
    return behaviors.filter(b => calculateSimilarity(action, b.name) >= threshold);
  }, [behaviors]);

  // Auto-group entries by similarity (for initial migration)
  const autoGroupEntries = useCallback((): Map<string, Entry[]> => {
    const groups = new Map<string, Entry[]>();
    const unlinkedEntries = entries.filter(e => !e.behaviorId);
    
    for (const entry of unlinkedEntries) {
      let foundGroup = false;
      
      // Check existing groups
      for (const [groupName, groupEntries] of groups) {
        if (calculateSimilarity(entry.action, groupName) >= 0.5) {
          groupEntries.push(entry);
          foundGroup = true;
          break;
        }
      }
      
      // Check existing behaviors
      if (!foundGroup) {
        const similar = findSimilarBehaviors(entry.action, 0.5);
        if (similar.length > 0) {
          const behaviorName = similar[0].name;
          if (groups.has(behaviorName)) {
            groups.get(behaviorName)!.push(entry);
          } else {
            groups.set(behaviorName, [entry]);
          }
          foundGroup = true;
        }
      }
      
      // Create new group
      if (!foundGroup) {
        groups.set(entry.action, [entry]);
      }
    }
    
    return groups;
  }, [entries, findSimilarBehaviors]);

  // Get all behaviors with their stats
  const behaviorsWithStats = useMemo(() => {
    return behaviors.map(b => ({
      behavior: b,
      stats: getBehaviorStats(b.id),
    }));
  }, [behaviors, getBehaviorStats]);

  // Get behaviors sorted by recent activity
  const recentBehaviors = useMemo(() => {
    return [...behaviorsWithStats]
      .filter(b => b.stats.totalEntries > 0)
      .sort((a, b) => {
        const aDate = a.stats.lastEntryDate?.getTime() || 0;
        const bDate = b.stats.lastEntryDate?.getTime() || 0;
        return bDate - aDate;
      });
  }, [behaviorsWithStats]);

  return {
    behaviors,
    isLoading,
    createBehavior,
    updateBehavior,
    deleteBehavior,
    getEntriesForBehavior,
    getBehaviorStats,
    findSimilarBehaviors,
    autoGroupEntries,
    behaviorsWithStats,
    recentBehaviors,
  };
}
