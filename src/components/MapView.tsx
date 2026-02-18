import { GameSettings, PlayerInventory, MapNode, Companion, SessionStats, GameState } from '../types';
import WorldMap from './WorldMap';
import GradeBackground from './GradeBackground';
import MusicManager from './MusicManager';
import NavBar from './NavBar';
import SettingsModal from './SettingsModal';
import GachaModal from './GachaModal';
import ReportCard from './ReportCard';
import CompanionDisplay from './CompanionDisplay';
import DebugLog from './DebugLog';
import AuthModal from './AuthModal';
import WordBook from './WordBook';
import FlashcardReview from './FlashcardReview';

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
  gameState?: GameState;
  debugMessage: string;
  debugIsError: boolean;
  isSettingsOpen: boolean;
  isGachaOpen: boolean;
  isReportOpen: boolean;
  isAuthModalOpen: boolean;
  isWordBookOpen: boolean;
  isFlashcardOpen: boolean;
  wordsLearned: string[];
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
  onWordBookOpen: () => void;
  onWordBookClose: () => void;
  onFlashcardOpen: () => void;
  onFlashcardClose: () => void;
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
  gameState,
  debugMessage,
  debugIsError,
  isSettingsOpen,
  isGachaOpen,
  isReportOpen,
  isAuthModalOpen,
  isWordBookOpen,
  isFlashcardOpen,
  wordsLearned,
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
  onWordBookOpen,
  onWordBookClose,
  onFlashcardOpen,
  onFlashcardClose,
  onSettingsChange,
  onInventoryChange,
  onGachaRoll,
  onDebugClose,
}: MapViewProps) {
  const audioSettings = {
    useAzureTts: settings.useAzureTts,
    audioLanguage: settings.audioLanguage,
    audioSpeed: settings.audioSpeed,
  };

  return (
    <>
      <GradeBackground gradeLevel={settings.gradeLevel} />
      <MusicManager state="map" volume={settings.bgmVolume} enabled={bgmEnabled} />

      <NavBar
        activeView="map"
        bgmEnabled={bgmEnabled}
        onBgmToggle={onBgmToggle}
        onSettingsOpen={onSettingsOpen}
        onGachaOpen={onGachaOpen}
        onReportOpen={onReportOpen}
        onWordBookOpen={onWordBookOpen}
        onFlashcardOpen={onFlashcardOpen}
        onShowMap={() => {}}
        onAuthOpen={onAuthOpen}
      />

      <div className="sm:pt-12">
        <WorldMap
          nodes={mapNodes}
          worldNumber={worldNumber}
          onNodeSelect={onNodeSelect}
          jade={jade}
        />
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
        gameState={gameState}
      />

      <WordBook
        isOpen={isWordBookOpen}
        onClose={onWordBookClose}
        wordsLearned={wordsLearned}
        audioSettings={audioSettings}
      />

      <FlashcardReview
        isOpen={isFlashcardOpen}
        onClose={onFlashcardClose}
        wordsLearned={wordsLearned}
        audioSettings={audioSettings}
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
