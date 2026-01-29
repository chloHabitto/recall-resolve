import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Cloud, 
  Check,
  Calendar,
  BookOpen,
  Apple,
  Camera,
  Image,
  X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEntries } from '@/hooks/useEntries';
import { toast } from 'sonner';

const DISPLAY_NAME_KEY = 'worthit_display_name';
const PROFILE_IMAGE_KEY = 'worthit_profile_image';

export function ProfilePage() {
  const navigate = useNavigate();
  const { entries } = useEntries();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const storedName = localStorage.getItem(DISPLAY_NAME_KEY);
    if (storedName) {
      setDisplayName(storedName);
    }
    const storedImage = localStorage.getItem(PROFILE_IMAGE_KEY);
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      localStorage.setItem(PROFILE_IMAGE_KEY, base64);
      setProfileImage(base64);
      toast.success('Profile photo updated');
    };
    reader.readAsDataURL(file);
    setShowPhotoSheet(false);
    
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleSaveName = () => {
    const trimmedName = tempName.trim();
    if (trimmedName) {
      localStorage.setItem(DISPLAY_NAME_KEY, trimmedName);
      setDisplayName(trimmedName);
      toast.success('Display name updated');
    }
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setTempName(displayName || '');
    setIsEditing(true);
  };

  const getFirstEntryDate = () => {
    if (entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sorted[0].createdAt;
  };

  const firstEntryDate = getFirstEntryDate();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-serif font-semibold">Profile</h1>
        </motion.div>
      </header>

      {/* Content */}
      <div className="px-6 space-y-5">
        {/* Avatar & Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
        >
          <div className="flex flex-col items-center text-center">
            {/* Editable Avatar */}
            <button
              onClick={() => setShowPhotoSheet(true)}
              className="relative w-24 h-24 rounded-full mb-4 group"
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md border-2 border-background">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </button>
            
            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {isEditing ? (
              <div className="w-full max-w-xs space-y-3">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-center"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    className="flex-1"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="group"
              >
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {displayName || 'Tap to set name'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap to edit
                </p>
              </button>
            )}
          </div>
        </motion.div>

        {/* Sync Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-5 shadow-soft border border-border/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Cloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">iCloud Sync</h3>
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Syncing across your devices
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden"
        >
          <div className="px-5 py-3 bg-muted/30 border-b border-border/50">
            <h3 className="font-semibold text-sm text-muted-foreground">Your Stats</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Memories</p>
                <p className="font-semibold text-lg">{entries.length}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">First Entry</p>
                <p className="font-semibold">
                  {firstEntryDate ? formatDate(firstEntryDate) : 'No entries yet'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign in with Apple - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 opacity-60"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Apple className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-muted-foreground">Sign in with Apple</h3>
              <p className="text-sm text-muted-foreground">
                Coming Soon
              </p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
              Soon
            </span>
          </div>
        </motion.div>
      </div>

      {/* Photo Selection Sheet */}
      <AnimatePresence>
        {showPhotoSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhotoSheet(false)}
              className="fixed inset-0 bg-foreground/40 z-50"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-lg border-t border-border/50 p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Change Profile Photo</h3>
                <button
                  onClick={() => setShowPhotoSheet(false)}
                  className="p-2 -mr-2 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Take Photo</p>
                    <p className="text-sm text-muted-foreground">Use your camera</p>
                  </div>
                </button>
                
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Image className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Choose from Album</p>
                    <p className="text-sm text-muted-foreground">Select an existing photo</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
