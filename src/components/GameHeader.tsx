import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Trophy, Map } from 'lucide-react';
import UserProfile from './UserProfile';

interface GameHeaderProps {
  gradeLevel: number;
  worldNumber: number;
  gameMode: 'standard' | 'listening';
  showMapButton?: boolean;
  onMapClick?: () => void;
  onReportClick: () => void;
  onSettingsClick: () => void;
  onLoginClick: () => void;
}

export default function GameHeader({
  gradeLevel,
  worldNumber,
  gameMode,
  showMapButton = true,
  onMapClick,
  onReportClick,
  onSettingsClick,
  onLoginClick,
}: GameHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-1 tracking-tight drop-shadow-lg">
          Hanzi Realm
        </h1>
        <p className="text-white text-xs sm:text-sm drop-shadow">
          Grade {gradeLevel} - World {worldNumber}
          {gameMode === 'listening' && ' - Listening Mode'}
        </p>
      </div>
      <div className="flex gap-2">
        {showMapButton && onMapClick && (
          <motion.button
            onClick={onMapClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d bg-gradient-to-b from-teal-500 to-teal-600 rounded-xl p-3"
          >
            <Map className="w-6 h-6 text-white" />
          </motion.button>
        )}
        <motion.button
          onClick={onReportClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-3d bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl p-3"
        >
          <Trophy className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button
          onClick={onSettingsClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl p-3"
        >
          <SettingsIcon className="w-6 h-6 text-[#ffd700]" />
        </motion.button>
        <UserProfile onLoginClick={onLoginClick} />
      </div>
    </div>
  );
}
