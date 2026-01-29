import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, Delete, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LockScreenProps {
  onUnlock: () => void;
  verifyPin: (pin: string) => boolean;
  biometricsEnabled: boolean;
  onBiometricAuth?: () => Promise<boolean>;
}

const PIN_LENGTH = 4;

export function LockScreen({ 
  onUnlock, 
  verifyPin, 
  biometricsEnabled,
  onBiometricAuth 
}: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;
    
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === PIN_LENGTH) {
      // Verify PIN
      setTimeout(() => {
        if (verifyPin(newPin)) {
          setSuccess(true);
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }, 100);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleBiometric = async () => {
    if (onBiometricAuth) {
      const result = await onBiometricAuth();
      if (result) {
        setSuccess(true);
        setTimeout(onUnlock, 300);
      }
    }
  };

  // Try biometric auth on mount if enabled
  useEffect(() => {
    if (biometricsEnabled && onBiometricAuth) {
      handleBiometric();
    }
  }, []);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Worth It?</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your PIN to unlock</p>
      </motion.div>

      {/* PIN Dots */}
      <motion.div 
        className="flex gap-4 mb-8"
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-all",
              pin.length > i 
                ? success 
                  ? "bg-green-500 border-green-500" 
                  : error 
                    ? "bg-destructive border-destructive" 
                    : "bg-primary border-primary"
                : "border-muted-foreground/30"
            )}
            animate={pin.length > i ? { scale: [1, 1.2, 1] } : {}}
          />
        ))}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-destructive text-sm mb-4"
          >
            Incorrect PIN. Try again.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-500 mb-4"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Unlocked</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4 max-w-[280px]">
        {digits.map((digit, i) => {
          if (digit === '') {
            return <div key={i} />;
          }
          
          if (digit === 'del') {
            return (
              <Button
                key={i}
                variant="ghost"
                size="lg"
                className="h-16 w-16 rounded-full"
                onClick={handleDelete}
                disabled={pin.length === 0}
              >
                <Delete className="w-6 h-6" />
              </Button>
            );
          }

          return (
            <Button
              key={i}
              variant="ghost"
              size="lg"
              className="h-16 w-16 rounded-full text-2xl font-medium hover:bg-muted"
              onClick={() => handleDigit(digit)}
            >
              {digit}
            </Button>
          );
        })}
      </div>

      {/* Biometric Button */}
      {biometricsEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button
            variant="outline"
            size="lg"
            className="gap-2 rounded-full px-6"
            onClick={handleBiometric}
          >
            <Fingerprint className="w-5 h-5" />
            Use Face ID
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
