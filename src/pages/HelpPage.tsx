import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen, ThumbsUp, Mail } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const QUICK_HELP = [
  {
    icon: Sparkles,
    title: 'Getting Started',
    description: 'Learn the basics of Worth It? and how to log your first memory.',
  },
  {
    icon: BookOpen,
    title: 'How Logging Works',
    description: 'Capture experiences with emotions, categories, and personal notes.',
  },
  {
    icon: ThumbsUp,
    title: 'Understanding Ratings',
    description: 'What "Worth It", "Meh", and "Not Worth It" mean for your decisions.',
  },
];

const FAQ_SECTIONS = [
  {
    title: 'General Questions',
    items: [
      {
        question: 'What is Worth It?',
        answer: 'Worth It? is a mindful decision-making companion that helps you remember how experiences actually felt. Before repeating a behavior, you can check how it made you feel last time—helping you make better choices.',
      },
      {
        question: 'How does it help me?',
        answer: 'By logging your experiences and how they made you feel, you build a personal database of memories. Next time you\'re about to do something, you can quickly check if it was worth it before—breaking unhelpful patterns and reinforcing positive ones.',
      },
      {
        question: 'Is my data private?',
        answer: 'Absolutely. All your data is stored locally on your device. We never upload your memories to any server, and you have complete control over your information.',
      },
    ],
  },
  {
    title: 'Logging Memories',
    items: [
      {
        question: 'What should I log?',
        answer: 'Log any experience you might repeat—whether it\'s a late-night snack, a workout, a social activity, or a purchase. Focus on things where knowing "was it worth it?" would help you decide next time.',
      },
      {
        question: 'Can I edit or delete entries?',
        answer: 'Yes! Tap any memory to view its details, then tap the pencil icon to edit any field. You can also delete entries from the detail view if needed.',
      },
      {
        question: 'What are categories for?',
        answer: 'Categories help organize your memories and make searching easier. You can filter by category to see patterns in specific areas of your life, like Food, Sleep, Social, or Habits.',
      },
    ],
  },
  {
    title: 'Data & Privacy',
    items: [
      {
        question: 'Where is my data stored?',
        answer: 'All data stays on your device in local storage. We never upload your memories to any server, ensuring complete privacy.',
      },
      {
        question: 'How do I export my data?',
        answer: 'Go to Account → Data & Privacy → Export My Data. This downloads a JSON file with all your memories that you can save or transfer.',
      },
      {
        question: 'Can I backup my memories?',
        answer: 'Currently, you can export your data as a JSON file for backup. We recommend doing this periodically to ensure you don\'t lose your memories if you clear your browser data.',
      },
    ],
  },
  {
    title: 'Tips & Best Practices',
    items: [
      {
        question: "When's the best time to log?",
        answer: 'Log experiences immediately after they happen, when feelings are fresh. The more accurate your emotional recall, the more helpful the entry will be for future decisions.',
      },
      {
        question: 'How to get the most out of Worth It?',
        answer: 'Be honest with your ratings, add descriptive notes, and most importantly—check your past entries before repeating behaviors. The app works best when it becomes part of your decision-making process.',
      },
    ],
  },
];

export function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_SECTIONS;

    const query = searchQuery.toLowerCase();
    return FAQ_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(
        item =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      ),
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);

  const hasResults = filteredSections.some(section => section.items.length > 0);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-serif font-semibold"
          >
            Help & FAQ
          </motion.h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search help topics..."
          />
        </motion.div>

        {/* Quick Help Section */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="font-semibold text-sm text-muted-foreground px-1">
              Quick Help
            </h2>
            <div className="grid gap-3">
              {QUICK_HELP.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-soft border border-border/50 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Accordion Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: searchQuery ? 0.1 : 0.3 }}
          className="space-y-4"
        >
          <h2 className="font-semibold text-sm text-muted-foreground px-1">
            {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
          </h2>

          {!hasResults ? (
            <div className="bg-card rounded-xl p-8 shadow-soft border border-border/50 text-center">
              <p className="text-muted-foreground">
                No results found for "{searchQuery}"
              </p>
              <Button
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSections.map((section, sectionIndex) => (
                <div
                  key={section.title}
                  className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                  </div>
                  <Accordion type="single" collapsible className="px-4">
                    {section.items.map((item, itemIndex) => (
                      <AccordionItem
                        key={itemIndex}
                        value={`${sectionIndex}-${itemIndex}`}
                        className="border-border/50"
                      >
                        <AccordionTrigger className="text-left text-sm hover:no-underline py-4">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Still Need Help Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 text-center border border-primary/20"
        >
          <h3 className="font-semibold mb-2">Still need help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? We're here to help.
          </p>
          <Button
            onClick={() => toast.info('Contact form coming soon')}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </Button>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
