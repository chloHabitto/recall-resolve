import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Trash2, 
  Sun, 
  Moon, 
  Monitor, 
  ChevronRight, 
  Smartphone,
  Download,
  Shield,
  HelpCircle,
  Mail,
  MessageSquare,
  Star,
  Share2,
  FileText,
  Scale,
  ExternalLink
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useEntries } from '@/hooks/useEntries';

const THEME_OPTIONS = [
  { value: 'system', label: 'Auto', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const;

const DISPLAY_NAME_KEY = 'worthit_display_name';

export function AccountPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { entries } = useEntries();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(DISPLAY_NAME_KEY);
    if (stored) {
      setDisplayName(stored);
    }
  }, []);
  const handleClearData = () => {
    localStorage.removeItem('worthit_entries');
    toast.success('All data cleared');
    window.location.reload();
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `worthit-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const entryCount = entries.length;

  const SettingsRow = ({ 
    icon: Icon, 
    label, 
    sublabel, 
    onClick,
    external = false,
    destructive = false 
  }: { 
    icon: React.ElementType; 
    label: string; 
    sublabel?: string;
    onClick?: () => void;
    external?: boolean;
    destructive?: boolean;
  }) => (
    <button 
      onClick={onClick}
      className={`w-full p-4 flex items-center gap-3 transition-colors ${
        destructive 
          ? 'text-destructive hover:bg-destructive/5' 
          : 'hover:bg-muted/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <div className="flex-1 text-left">
        <span className="font-medium">{label}</span>
        {sublabel && (
          <p className={`text-xs ${destructive ? 'text-destructive/70' : 'text-muted-foreground'}`}>
            {sublabel}
          </p>
        )}
      </div>
      {external ? (
        <ExternalLink className="w-4 h-4 opacity-50" />
      ) : (
        <ChevronRight className="w-4 h-4 opacity-50" />
      )}
    </button>
  );

  const SectionCard = ({ 
    title, 
    children,
    delay = 0 
  }: { 
    title: string; 
    children: React.ReactNode;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden"
    >
      <div className="px-5 py-3 bg-muted/30 border-b border-border/50">
        <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border/50">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-serif font-semibold">Account</h1>
        </motion.div>
      </header>

      {/* Content */}
      <div className="px-6 space-y-5">
        {/* Profile Card - Tappable */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/profile')}
          className="w-full bg-card rounded-2xl p-5 shadow-soft border border-border/50 text-left hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{displayName || 'Local User'}</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Data stored on this device</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Memories logged</span>
              <span className="font-semibold text-primary">{entryCount}</span>
            </div>
          </div>
        </motion.button>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-5 shadow-soft border border-border/50"
        >
          <h3 className="font-semibold mb-4">Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === value
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === value ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Icon className={`w-5 h-5 ${theme === value ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <span className={`text-sm font-medium ${theme === value ? 'text-primary' : ''}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Data & Privacy Section */}
        <SectionCard title="Data & Privacy" delay={0.1}>
          <SettingsRow 
            icon={Download} 
            label="Export My Data" 
            sublabel="Download all your memories as JSON"
            onClick={handleExportData}
          />
          <SettingsRow 
            icon={Shield} 
            label="Privacy Policy" 
            sublabel="How we handle your data"
            onClick={() => toast.info('Privacy Policy coming soon')}
            external
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div>
                <SettingsRow 
                  icon={Trash2} 
                  label="Clear All Memories" 
                  sublabel="Permanently delete all logged entries"
                  destructive
                />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all memories?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {entryCount} logged {entryCount === 1 ? 'memory' : 'memories'}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SectionCard>

        {/* Support Section */}
        <SectionCard title="Support" delay={0.15}>
          <SettingsRow 
            icon={HelpCircle} 
            label="Help / FAQ" 
            sublabel="Get answers to common questions"
            onClick={() => navigate('/help')}
          />
          <SettingsRow 
            icon={Mail} 
            label="Contact Us" 
            sublabel="Reach out to our team"
            onClick={() => toast.info('Contact form coming soon')}
          />
          <SettingsRow 
            icon={MessageSquare} 
            label="Send Feedback" 
            sublabel="Help us improve Worth It?"
            onClick={() => toast.info('Feedback form coming soon')}
          />
        </SectionCard>

        {/* About Section */}
        <SectionCard title="About" delay={0.2}>
          <SettingsRow 
            icon={Star} 
            label="Rate Worth It?" 
            sublabel="Leave a review on the app store"
            onClick={() => toast.info('Rating coming soon')}
            external
          />
          <SettingsRow 
            icon={Share2} 
            label="Share with Friends" 
            sublabel="Spread the word"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Worth It?',
                  text: 'Before you do it again… remember how it felt last time.',
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                toast.success('Link copied to clipboard');
              }
            }}
          />
          <SettingsRow 
            icon={FileText} 
            label="Terms of Service" 
            sublabel="Our terms and conditions"
            onClick={() => toast.info('Terms of Service coming soon')}
            external
          />
          <SettingsRow 
            icon={Scale} 
            label="Open Source Licenses" 
            sublabel="Third-party software credits"
            onClick={() => toast.info('Licenses page coming soon')}
            external
          />
        </SectionCard>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="pt-6 pb-4 text-center space-y-1"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Worth It?
          </p>
          <p className="text-xs text-muted-foreground/70">
            v1.0 · Made with 🧡
          </p>
        </motion.div>
      </div>
    </div>
  );
}
