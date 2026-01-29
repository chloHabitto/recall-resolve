import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Fingerprint, Clock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AppLockSettings as AppLockSettingsType, LockTrigger } from '@/types/appLock';
import { cn } from '@/lib/utils';

interface AppLockSettingsProps {
  settings: AppLockSettingsType;
  onEnableLock: (pin: string) => void;
  onDisableLock: () => void;
  onChangePin: (pin: string) => void;
  onToggleBiometrics: (enabled: boolean) => void;
  onSetLockTrigger: (trigger: LockTrigger) => void;
  onSetInactivityTimeout: (minutes: number) => void;
  verifyPin: (pin: string) => boolean;
  onBack: () => void;
}

const PIN_LENGTH = 4;

type SetupStep = 'enter' | 'confirm';

export function AppLockSettings({
  settings,
  onEnableLock,
  onDisableLock,
  onChangePin,
  onToggleBiometrics,
  onSetLockTrigger,
  onSetInactivityTimeout,
  verifyPin,
  onBack,
}: AppLockSettingsProps) {
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState('');

  const handleDigit = (digit: string, target: 'pin' | 'confirm' | 'current') => {
    const current = target === 'pin' ? pin : target === 'confirm' ? confirmPin : currentPin;
    if (current.length >= PIN_LENGTH) return;
    
    const newValue = current + digit;
    if (target === 'pin') setPin(newValue);
    else if (target === 'confirm') setConfirmPin(newValue);
    else setCurrentPin(newValue);
    
    setError('');
  };

  const handleDelete = (target: 'pin' | 'confirm' | 'current') => {
    if (target === 'pin') setPin(pin.slice(0, -1));
    else if (target === 'confirm') setConfirmPin(confirmPin.slice(0, -1));
    else setCurrentPin(currentPin.slice(0, -1));
    setError('');
  };

  const resetPinSetup = () => {
    setPin('');
    setConfirmPin('');
    setCurrentPin('');
    setSetupStep('enter');
    setError('');
    setShowPinSetup(false);
    setShowPinChange(false);
    setShowDisableConfirm(false);
  };

  const handleSetupComplete = () => {
    if (pin !== confirmPin) {
      setError('PINs do not match');
      setConfirmPin('');
      return;
    }
    onEnableLock(pin);
    toast.success('App lock enabled');
    resetPinSetup();
  };

  const handleChangeComplete = () => {
    if (!verifyPin(currentPin)) {
      setError('Current PIN is incorrect');
      setCurrentPin('');
      return;
    }
    if (pin !== confirmPin) {
      setError('New PINs do not match');
      setConfirmPin('');
      return;
    }
    onChangePin(pin);
    toast.success('PIN changed successfully');
    resetPinSetup();
  };

  const handleDisable = () => {
    if (!verifyPin(currentPin)) {
      setError('Incorrect PIN');
      setCurrentPin('');
      return;
    }
    onDisableLock();
    toast.success('App lock disabled');
    resetPinSetup();
  };

  const NumPad = ({ 
    value, 
    target 
  }: { 
    value: string; 
    target: 'pin' | 'confirm' | 'current';
  }) => (
    <div className="space-y-6">
      {/* PIN Dots */}
      <div className="flex justify-center gap-4">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-all",
              value.length > i 
                ? "bg-primary border-primary"
                : "border-muted-foreground/30"
            )}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-destructive text-sm text-center">{error}</p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((digit, i) => {
          if (digit === '') return <div key={i} />;
          if (digit === 'del') {
            return (
              <Button
                key={i}
                variant="ghost"
                size="lg"
                className="h-14 w-14 rounded-full text-muted-foreground"
                onClick={() => handleDelete(target)}
              >
                ←
              </Button>
            );
          }
          return (
            <Button
              key={i}
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-full text-xl font-medium"
              onClick={() => handleDigit(digit, target)}
            >
              {digit}
            </Button>
          );
        })}
      </div>
    </div>
  );

  const lockTriggerLabels: Record<LockTrigger, string> = {
    on_open: 'When app opens',
    on_background: 'When app goes to background',
    after_inactivity: 'After inactivity',
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-serif font-semibold">App Lock</h1>
        </div>
      </header>

      <div className="px-6 space-y-5">
        {/* Lock Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-soft border border-border/50"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              settings.isEnabled 
                ? "bg-green-500/10" 
                : "bg-muted"
            )}>
              <Lock className={cn(
                "w-6 h-6",
                settings.isEnabled ? "text-green-500" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                {settings.isEnabled ? 'App Lock Enabled' : 'App Lock Disabled'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {settings.isEnabled 
                  ? 'Your app is protected with a PIN' 
                  : 'Protect your app with a PIN or Face ID'}
              </p>
            </div>
          </div>

          {!settings.isEnabled ? (
            <Button
              className="w-full mt-4"
              onClick={() => setShowPinSetup(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Set Up App Lock
            </Button>
          ) : (
            <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPinChange(true)}
              >
                Change PIN
              </Button>
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDisableConfirm(true)}
              >
                Disable App Lock
              </Button>
            </div>
          )}
        </motion.div>

        {/* Settings (only show when enabled) */}
        {settings.isEnabled && (
          <>
            {/* Biometrics */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card rounded-2xl p-5 shadow-soft border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Face ID / Touch ID</h3>
                  <p className="text-sm text-muted-foreground">
                    Use biometrics to unlock
                  </p>
                </div>
                <Switch
                  checked={settings.biometricsEnabled}
                  onCheckedChange={onToggleBiometrics}
                />
              </div>
            </motion.div>

            {/* Lock Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Lock Trigger</h3>
                  <p className="text-sm text-muted-foreground">
                    When should the app lock?
                  </p>
                </div>
              </div>

              <Select
                value={settings.lockTrigger}
                onValueChange={(value) => onSetLockTrigger(value as LockTrigger)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_open">When app opens</SelectItem>
                  <SelectItem value="on_background">When app goes to background</SelectItem>
                  <SelectItem value="after_inactivity">After inactivity</SelectItem>
                </SelectContent>
              </Select>

              {/* Inactivity Timeout */}
              {settings.lockTrigger === 'after_inactivity' && (
                <div className="pt-2">
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Lock after
                  </label>
                  <Select
                    value={settings.inactivityTimeout.toString()}
                    onValueChange={(value) => onSetInactivityTimeout(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xs text-muted-foreground text-center px-4"
        >
          Note: If you forget your PIN, you'll need to clear app data to regain access.
        </motion.p>
      </div>

      {/* PIN Setup Dialog */}
      <Dialog open={showPinSetup} onOpenChange={(open) => !open && resetPinSetup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {setupStep === 'enter' ? 'Create PIN' : 'Confirm PIN'}
            </DialogTitle>
            <DialogDescription>
              {setupStep === 'enter' 
                ? 'Enter a 4-digit PIN to secure your app'
                : 'Enter the same PIN again to confirm'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {setupStep === 'enter' ? (
              <>
                <NumPad value={pin} target="pin" />
                <Button
                  className="w-full mt-6"
                  disabled={pin.length < PIN_LENGTH}
                  onClick={() => {
                    setSetupStep('confirm');
                    setError('');
                  }}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <NumPad value={confirmPin} target="confirm" />
                <Button
                  className="w-full mt-6"
                  disabled={confirmPin.length < PIN_LENGTH}
                  onClick={handleSetupComplete}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Enable App Lock
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Change PIN Dialog */}
      <Dialog open={showPinChange} onOpenChange={(open) => !open && resetPinSetup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentPin.length < PIN_LENGTH 
                ? 'Enter Current PIN' 
                : setupStep === 'enter' 
                  ? 'Enter New PIN' 
                  : 'Confirm New PIN'}
            </DialogTitle>
            <DialogDescription>
              {currentPin.length < PIN_LENGTH 
                ? 'Verify your identity first'
                : setupStep === 'enter'
                  ? 'Choose a new 4-digit PIN'
                  : 'Enter the new PIN again to confirm'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentPin.length < PIN_LENGTH || !verifyPin(currentPin) ? (
              <>
                <NumPad value={currentPin} target="current" />
                <Button
                  className="w-full mt-6"
                  disabled={currentPin.length < PIN_LENGTH}
                  onClick={() => {
                    if (!verifyPin(currentPin)) {
                      setError('Incorrect PIN');
                      setCurrentPin('');
                    }
                  }}
                >
                  Verify
                </Button>
              </>
            ) : setupStep === 'enter' ? (
              <>
                <NumPad value={pin} target="pin" />
                <Button
                  className="w-full mt-6"
                  disabled={pin.length < PIN_LENGTH}
                  onClick={() => setSetupStep('confirm')}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <NumPad value={confirmPin} target="confirm" />
                <Button
                  className="w-full mt-6"
                  disabled={confirmPin.length < PIN_LENGTH}
                  onClick={handleChangeComplete}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Change PIN
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Confirm Dialog */}
      <Dialog open={showDisableConfirm} onOpenChange={(open) => !open && resetPinSetup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable App Lock</DialogTitle>
            <DialogDescription>
              Enter your PIN to disable app lock
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <NumPad value={currentPin} target="current" />
            <Button
              variant="destructive"
              className="w-full mt-6"
              disabled={currentPin.length < PIN_LENGTH}
              onClick={handleDisable}
            >
              Disable App Lock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
