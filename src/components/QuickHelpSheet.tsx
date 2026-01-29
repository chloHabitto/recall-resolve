import { motion } from 'framer-motion';
import { X, Sparkles, BookOpen, ThumbsUp, LucideIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type HelpTopic = 'getting-started' | 'logging' | 'ratings';

interface QuickHelpSheetProps {
  topic: HelpTopic | null;
  onClose: () => void;
}

const HELP_CONTENT: Record<HelpTopic, {
  icon: LucideIcon;
  title: string;
  sections: { heading: string; content: string }[];
}> = {
  'getting-started': {
    icon: Sparkles,
    title: 'Getting Started',
    sections: [
      {
        heading: 'Welcome to Worth It?',
        content: 'Worth It? helps you make better decisions by remembering how experiences actually felt. Before repeating a behavior, check how it made you feel last time.',
      },
      {
        heading: 'Your First Memory',
        content: 'Tap the + button on the home screen to log your first experience. Describe what you did, how it felt, and whether it was worth it.',
      },
      {
        heading: 'The Core Loop',
        content: 'Log → Search → Decide. Log experiences after they happen. Search your memories before repeating behaviors. Make better choices based on real feelings.',
      },
      {
        heading: 'Build the Habit',
        content: 'The more you log, the more useful Worth It? becomes. Try logging at least one experience per day for the first week.',
      },
    ],
  },
  'logging': {
    icon: BookOpen,
    title: 'How Logging Works',
    sections: [
      {
        heading: 'What to Log',
        content: 'Log any experience you might repeat—late-night snacks, workouts, social activities, purchases. Focus on things where knowing "was it worth it?" helps you decide next time.',
      },
      {
        heading: 'The 4 Steps',
        content: '1. What did you do? — Name the action\n2. Context — When did it happen?\n3. How did it feel? — Physical state + emotions\n4. Worth it? — Yes, Meh, or No',
      },
      {
        heading: 'Be Honest',
        content: 'Log how you actually felt, not how you think you should have felt. Honest entries lead to better future decisions.',
      },
      {
        heading: 'Add Notes',
        content: 'Use the notes field to capture details you\'ll want to remember. "Felt tired the next morning" or "Best decision I made all week" adds context.',
      },
    ],
  },
  'ratings': {
    icon: ThumbsUp,
    title: 'Understanding Ratings',
    sections: [
      {
        heading: 'Worth It ✓',
        content: 'You\'d do it again. The experience was positive overall and you\'re glad it happened. This doesn\'t mean it was perfect—just that it was worthwhile.',
      },
      {
        heading: 'Meh ~',
        content: 'It was okay, but not memorable. You neither regret it nor feel great about it. Useful for identifying things that aren\'t really adding value.',
      },
      {
        heading: 'Not Worth It ✗',
        content: 'You wish you hadn\'t done it. Maybe it felt good in the moment but bad afterward, or maybe it just wasn\'t what you hoped. Next time, you\'ll think twice.',
      },
      {
        heading: 'No Wrong Answers',
        content: 'Ratings are personal. A "Not Worth It" for you might be "Worth It" for someone else. What matters is building your own personal reference guide.',
      },
    ],
  },
};

export function QuickHelpSheet({ topic, onClose }: QuickHelpSheetProps) {
  if (!topic) return null;

  const content = HELP_CONTENT[topic];
  const Icon = content.icon;

  return (
    <Sheet open={!!topic} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-0">
        <SheetHeader className="px-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-xl font-serif">{content.title}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="px-6 py-6 space-y-6 overflow-y-auto h-[calc(85vh-80px)]">
          {content.sections.map((section, index) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <h3 className="font-semibold text-foreground">{section.heading}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
