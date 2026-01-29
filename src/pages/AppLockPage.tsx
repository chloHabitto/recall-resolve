import { useNavigate } from 'react-router-dom';
import { AppLockSettings } from '@/components/AppLockSettings';
import { useAppLock } from '@/hooks/useAppLock';

export function AppLockPage() {
  const navigate = useNavigate();
  const {
    settings,
    enableLock,
    disableLock,
    changePin,
    toggleBiometrics,
    setLockTrigger,
    setInactivityTimeout,
    verifyPin,
  } = useAppLock();

  return (
    <AppLockSettings
      settings={settings}
      onEnableLock={enableLock}
      onDisableLock={disableLock}
      onChangePin={changePin}
      onToggleBiometrics={toggleBiometrics}
      onSetLockTrigger={setLockTrigger}
      onSetInactivityTimeout={setInactivityTimeout}
      verifyPin={verifyPin}
      onBack={() => navigate('/account')}
    />
  );
}
