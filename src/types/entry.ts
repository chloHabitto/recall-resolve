import { EntryType } from './behavior';

export type PhysicalRating = 'fine' | 'meh' | 'bad' | 'awful';
export type WorthIt = 'yes' | 'meh' | 'no';
export type Category = 'food' | 'sleep' | 'habit' | 'social' | 'other';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'late-night';

export interface Entry {
  id: string;
  action: string;
  category: Category;
  context: TimeOfDay[];
  physicalRating: PhysicalRating;
  emotionalTags: string[];
  worthIt: WorthIt;
  note: string;
  createdAt: Date;
  // New fields for Behavior Threads
  behaviorId?: string;
  entryType: EntryType;
}

export const PHYSICAL_RATINGS: { value: PhysicalRating; emoji: string; label: string }[] = [
  { value: 'fine', emoji: '😌', label: 'Fine' },
  { value: 'meh', emoji: '😕', label: 'Meh' },
  { value: 'bad', emoji: '😣', label: 'Bad' },
  { value: 'awful', emoji: '🤢', label: 'Awful' },
];

export const WORTH_IT_OPTIONS: { value: WorthIt; emoji: string; label: string }[] = [
  { value: 'yes', emoji: '✓', label: 'Yes' },
  { value: 'meh', emoji: '~', label: 'Meh' },
  { value: 'no', emoji: '✗', label: 'No' },
];

export const CATEGORIES: { value: Category; emoji: string; label: string }[] = [
  { value: 'food', emoji: '🍔', label: 'Food' },
  { value: 'sleep', emoji: '😴', label: 'Sleep' },
  { value: 'habit', emoji: '🔄', label: 'Habit' },
  { value: 'social', emoji: '👥', label: 'Social' },
  { value: 'other', emoji: '📝', label: 'Other' },
];

export const TIME_OF_DAY: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'late-night', label: 'Late Night' },
];

export const EMOTION_TAGS = [
  'regret', 'tired', 'anxious', 'guilty', 'satisfied', 'energized', 'calm', 'stressed'
];
