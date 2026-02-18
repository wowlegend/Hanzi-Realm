import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Settings as SettingsIcon, Gift, Trophy, Map,
  BookOpen, RotateCcw, Swords,
} from 'lucide-react';
import UserProfile from './UserProfile';

type ActiveView = 'map' | 'battle';

interface NavBarProps {
  activeView: ActiveView;
  bgmEnabled: boolean;
  onBgmToggle: () => void;
  onSettingsOpen: () => void;
  onGachaOpen: () => void;
  onReportOpen: () => void;
  onWordBookOpen: () => void;
  onFlashcardOpen: () => void;
  onShowMap: () => void;
  onAuthOpen: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'active' | 'gold' | 'green';
  showOnMobile?: boolean;
  badge?: boolean;
}

function NavItem({ icon, label, onClick, variant = 'default', badge }: NavItemProps) {
  const variantStyles = {
    default: 'bg-white/5 hover:bg-white/10 border-white/10',
    active: 'bg-teal-600/40 hover:bg-teal-600/50 border-teal-500/40',
    gold: 'bg-amber-600/30 hover:bg-amber-600/40 border-amber-500/30',
    green: 'bg-emerald-600/30 hover:bg-emerald-600/40 border-emerald-500/30',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors ${variantStyles[variant]}`}
    >
      {icon}
      <span className="text-white/80 text-xs font-semibold hidden lg:inline">{label}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
      )}
    </motion.button>
  );
}

export default function NavBar({
  activeView,
  bgmEnabled,
  onBgmToggle,
  onSettingsOpen,
  onGachaOpen,
  onReportOpen,
  onWordBookOpen,
  onFlashcardOpen,
  onShowMap,
  onAuthOpen,
}: NavBarProps) {
  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 hidden sm:flex items-center justify-between px-4 py-2 bg-black/40 backdrop-blur-md border-b border-white/8"
      >
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {activeView === 'battle' && (
              <motion.button
                key="map-btn"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={onShowMap}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600/40 border border-teal-500/40 hover:bg-teal-600/50 transition-colors"
              >
                <Map className="w-4 h-4 text-teal-300" />
                <span className="text-teal-200 text-xs font-bold">Map</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/8">
            <div className={`w-2 h-2 rounded-full ${activeView === 'map' ? 'bg-teal-400' : 'bg-orange-400'}`} />
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">
              {activeView === 'map' ? 'World Map' : 'Battle'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <NavItem
            icon={<BookOpen className="w-4 h-4 text-emerald-400" />}
            label="Words"
            onClick={onWordBookOpen}
            variant="green"
          />
          <NavItem
            icon={<RotateCcw className="w-4 h-4 text-sky-400" />}
            label="Review"
            onClick={onFlashcardOpen}
          />

          <div className="w-px h-6 bg-white/10 mx-1" />

          <NavItem
            icon={<Trophy className="w-4 h-4 text-blue-400" />}
            label="Stats"
            onClick={onReportOpen}
          />
          <NavItem
            icon={<Gift className="w-4 h-4 text-amber-400" />}
            label="Gacha"
            onClick={onGachaOpen}
            variant="gold"
          />

          <div className="w-px h-6 bg-white/10 mx-1" />

          <motion.button
            onClick={onBgmToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-xl border transition-colors ${
              bgmEnabled
                ? 'bg-green-600/30 border-green-500/30 hover:bg-green-600/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${bgmEnabled ? 'text-green-400' : 'text-gray-500'}`} />
          </motion.button>

          <NavItem
            icon={<SettingsIcon className="w-4 h-4 text-[#ffd700]" />}
            label="Settings"
            onClick={onSettingsOpen}
          />

          <UserProfile onLoginClick={onAuthOpen} />
        </div>
      </motion.nav>

      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-black/60 backdrop-blur-lg border-t border-white/8 px-2 py-1.5 safe-area-pb"
      >
        <div className="flex items-center justify-around">
          <MobileNavItem
            icon={<Map className="w-5 h-5" />}
            label="Map"
            active={activeView === 'map'}
            onClick={onShowMap}
          />
          <MobileNavItem
            icon={<Swords className="w-5 h-5" />}
            label="Battle"
            active={activeView === 'battle'}
            disabled={activeView === 'map'}
          />
          <MobileNavItem
            icon={<BookOpen className="w-5 h-5" />}
            label="Words"
            onClick={onWordBookOpen}
          />
          <MobileNavItem
            icon={<Trophy className="w-5 h-5" />}
            label="Stats"
            onClick={onReportOpen}
          />
          <MobileNavItem
            icon={<SettingsIcon className="w-5 h-5" />}
            label="More"
            onClick={onSettingsOpen}
          />
        </div>
      </motion.nav>
    </>
  );
}

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function MobileNavItem({ icon, label, active, disabled, onClick }: MobileNavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      disabled={disabled}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[52px] ${
        active
          ? 'text-teal-400'
          : disabled
            ? 'text-gray-600'
            : 'text-gray-400 active:text-white'
      }`}
    >
      {icon}
      <span className="text-[9px] font-semibold">{label}</span>
      {active && (
        <motion.div
          layoutId="mobile-nav-indicator"
          className="w-1 h-1 rounded-full bg-teal-400"
        />
      )}
    </motion.button>
  );
}
