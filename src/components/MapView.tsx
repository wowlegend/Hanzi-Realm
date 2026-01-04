import { motion } from 'framer-motion';
import { Volume2, Settings as SettingsIcon, Gift, Trophy } from 'lucide-react';
import { GameSettings, PlayerInventory, MapNode, Companion, SessionStats } from '../types';
import WorldMap from './WorldMap';
import GradeBackground from './GradeBackground';
import MusicManager from './MusicManager';
import SettingsModal from './SettingsModal';
import GachaModal from './GachaModal';
import ReportCard from './ReportCard';
import CompanionDisplay from './CompanionDisplay';
import DebugLog from './DebugLog';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

interface MapViewProps {
  settings: GameSettings;
  inventory: PlayerInventory;
  mapNodes: MapNode[];
  worldNumber: number;
  jade: number;
  bgmEnabled: boolean;
  activeCompanion: Companion | null;
  companionHappy: boolean;
  sessionStats: SessionStats;
  debugMessage: string;
  debugIsError: boolean;
  isSettingsOpen: boolean;
  isGachaOpen: boolean;
  isReportOpen: boolean;
  isAuthModalOpen: boolean;
  onNodeSelect: (node: MapNode) => void;
  onBgmToggle: () => void;
  onSettingsOpen: () => void;
  onSettingsClose: () => void;
  onGachaOpen: () => void;
  onGachaClose: () => void;
  onReportOpen: () => void;
  onReportClose: () => void;
  onAuthOpen: () => void;
  onAuthClose: () => void;
  onSettingsChange: (settings: GameSettings) => void;
  onInventoryChange: (inventory: PlayerInventory) => void;
  onGachaRoll: (companion: Companion) => void;
  onDebugClose: () => void;
}

export default function MapView({
  settings,
  inventory,
  mapNodes,
  worldNumber,
  jade,
  bgmEnabled,
  activeCompanion,
  companionHappy,
  sessionStats,
  debugMessage,
  debugIsError,
  isSettingsOpen,
  isGachaOpen,
  isReportOpen,
  isAuthModalOpen,
  onNodeSelect,
  onBgmToggle,
  onSettingsOpen,
  onSettingsClose,
  onGachaOpen,
  onGachaClose,
  onReportOpen,
  onReportClose,
  onAuthOpen,
  onAuthClose,
  onSettingsChange,
  onInventoryChange,
  onGachaRoll,
  onDebugClose,
}: MapViewProps) {
  return (
    <>
      <GradeBackground gradeLevel={settings.gradeLevel} />
      <MusicManager state="map" volume={settings.bgmVolume} enabled={bgmEnabled} />

      <WorldMap
        nodes={mapNodes}
        worldNumber={worldNumber}
        onNodeSelect={onNodeSelect}
        jade={jade}
      />

      <div className="fixed top-4 right-4 flex gap-2 z-20">
        <motion.button
          onClick={onBgmToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-3d p-3 rounded-xl ${bgmEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
        >
          <Volume2 className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          onClick={onReportOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-3d bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl p-3"
        >
          <Trophy className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          onClick={onGachaOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-3d-gold rounded-xl p-3"
        >
          <Gift className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          onClick={onSettingsOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl p-3"
        >
          <SettingsIcon className="w-5 h-5 text-[#ffd700]" />
        </motion.button>
        <UserProfile onLoginClick={onAuthOpen} />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
        settings={settings}
        inventory={inventory}
        hanziCoins={jade}
        onSettingsChange={onSettingsChange}
        onInventoryChange={onInventoryChange}
      />

      <GachaModal
        isOpen={isGachaOpen}
        onClose={onGachaClose}
        jade={jade}
        onRoll={onGachaRoll}
      />

      <ReportCard
        isOpen={isReportOpen}
        onClose={onReportClose}
        stats={sessionStats}
      />

      <CompanionDisplay companion={activeCompanion} isHappy={companionHappy} />

      <DebugLog
        message={debugMessage}
        isError={debugIsError}
        onClose={onDebugClose}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onAuthClose}
      />
    </>
  );
}
