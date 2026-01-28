import { motion } from 'framer-motion';
import { User, Settings, HelpCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function AccountPage() {
  const handleClearData = () => {
    localStorage.removeItem('worthit_entries');
    toast.success('All data cleared');
    window.location.reload();
  };

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
      <div className="px-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-5 shadow-soft border border-border/50"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-medium">Local User</h2>
              <p className="text-sm text-muted-foreground">Data stored on device</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden"
        >
          <MenuItem icon={Settings} label="Settings" sublabel="Coming soon" disabled />
          <MenuItem icon={HelpCircle} label="Help & Support" sublabel="Coming soon" disabled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full bg-card rounded-xl p-4 shadow-soft border border-border/50 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors">
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Clear all data</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your logged memories. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear all data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground pt-4"
        >
          Worth It? v1.0 · Made with 🧡
        </motion.p>
      </div>
    </div>
  );
}

function MenuItem({ 
  icon: Icon, 
  label, 
  sublabel,
  disabled 
}: { 
  icon: any; 
  label: string;
  sublabel?: string;
  disabled?: boolean;
}) {
  return (
    <button 
      disabled={disabled}
      className={`w-full p-4 flex items-center gap-3 border-b border-border/50 last:border-b-0 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'
      }`}
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div className="flex-1 text-left">
        <span className="font-medium">{label}</span>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </button>
  );
}
