export type EntryType = 'did-it' | 'resisted' | 'reflection';

export interface Behavior {
  id: string;
  name: string;
  category: import('./entry').Category;
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BehaviorStats {
  totalEntries: number;
  resistedCount: number;
  didItCount: number;
  reflectionCount: number;
  successRate: number; // percentage of resisted vs did-it
  lastEntryDate: Date | null;
  firstEntryDate: Date | null;
  trend: 'improving' | 'stable' | 'declining' | 'new';
}

export const ENTRY_TYPES: { value: EntryType; emoji: string; label: string; description: string }[] = [
  { value: 'did-it', emoji: '●', label: 'Did it', description: 'I did this behavior' },
  { value: 'resisted', emoji: '○', label: 'Resisted', description: 'I wanted to but didn\'t' },
  { value: 'reflection', emoji: '◐', label: 'Reflection', description: 'Just noting my thoughts' },
];
