import { motion } from 'framer-motion';
import { User, Trash2, Sun, Moon, Monitor, ChevronRight, Smartphone } from 'lucide-react';
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
  { value: 'system', label: 'Auto', icon: Monitor, description: 'Match device' },
  { value: 'light', label: 'Light', icon: Sun, description: 'Always light' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Always dark' },
] as const;

export function AccountPage() {
  const { theme, setTheme } = useTheme();
  const { entries } = useEntries();

  const handleClearData = () => {
    localStorage.removeItem('worthit_entries');
    toast.success('All data cleared');
    window.location.reload();
  };

  const entryCount = entries.length;

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
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-soft border border-border/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Local User</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Data stored on this device</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Memories logged</span>
              <span className="font-semibold text-primary">{entryCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-5 shadow-soft border border-border/50"
        >
          <h3 className="font-semibold mb-4">Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon, description }) => (
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
                <div className="text-center">
                  <span className={`text-sm font-medium block ${theme === value ? 'text-primary' : ''}`}>
                    {label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden"
        >
          <div className="px-5 py-3 bg-muted/30 border-b border-border/50">
            <h3 className="font-semibold text-sm text-muted-foreground">Data</h3>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full p-4 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors">
                <Trash2 className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <span className="font-medium">Clear all memories</span>
                  <p className="text-xs text-destructive/70">Permanently delete all logged entries</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
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
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
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
