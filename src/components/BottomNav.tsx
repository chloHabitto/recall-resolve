import { Home, Search, Library, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BottomNavProps {
  onLogClick: () => void;
}

export function BottomNav({ onLogClick }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/library', icon: Library, label: 'Library' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border/50 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around px-4 py-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          // Insert the log button after the first two items
          if (index === 1) {
            return (
              <div key="nav-group" className="contents">
                <NavItem 
                  icon={Icon}
                  label={item.label}
                  isActive={isActive}
                  onClick={() => navigate(item.path)}
                />
                <button
                  onClick={onLogClick}
                  className="relative -mt-8 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-glow"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            );
          }

          return (
            <NavItem 
              key={item.path}
              icon={Icon}
              label={item.label}
              isActive={isActive}
              onClick={() => navigate(item.path)}
            />
          );
        })}
      </div>
    </nav>
  );
}

function NavItem({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-2 px-4"
    >
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
      >
        <Icon 
          className={`w-6 h-6 transition-colors ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        />
      </motion.div>
      <span className={`text-xs transition-colors ${
        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
      }`}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
        />
      )}
    </button>
  );
}
