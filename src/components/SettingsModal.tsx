import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Trash2, Volume2, Zap, Cpu, MessageSquare, Cloud } from 'lucide-react';
import { GameSettings, PlayerInventory } from '../types';
import Toast from './Toast';
import { clearAudioCache, speakChinese, getTtsEngine, setTtsEngine, TtsEngine } from '../utils/audio';
import { AUDIO_DEFAULTS } from '../utils/constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  inventory: PlayerInventory;
  hanziCoins: number;
  onSettingsChange: (settings: GameSettings) => void;
  onInventoryChange: (inventory: PlayerInventory) => void;
}

const ENGINE_OPTIONS: { id: TtsEngine; label: string; desc: string; icon: typeof Zap }[] = [
  { id: 'azure', label: 'Azure Neural TTS', desc: 'Microsoft Azure - High quality Mandarin voices (Recommended)', icon: Cloud },
  { id: 'elevenlabs', label: 'ElevenLabs', desc: 'Requires paid ElevenLabs plan', icon: Zap },
  { id: 'edge', label: 'Edge TTS', desc: 'Free Microsoft edge voices (no API key needed)', icon: Cpu },
  { id: 'browser', label: 'Browser TTS', desc: 'Built-in system voice (offline)', icon: MessageSquare },
];

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  inventory,
  hanziCoins,
  onSettingsChange,
  onInventoryChange,
}: SettingsModalProps) {
  const [ttsEngine, setTtsEngineLocal] = useState<TtsEngine>(getTtsEngine);
  const [voiceChoice, setVoiceChoice] = useState(() => {
    return localStorage.getItem('azureVoice') || AUDIO_DEFAULTS.VOICE;
  });
  const [language, setLanguage] = useState(settings.audioLanguage);
  const [useEdgeTts, setUseEdgeTts] = useState(settings.useAzureTts);
  const [gradeLevel, setGradeLevel] = useState(settings.gradeLevel || 1);
  const [audioSpeed, setAudioSpeed] = useState(settings.audioSpeed || 0.75);
  const [showToast, setShowToast] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);

  useEffect(() => {
    if (voiceChoice) {
      localStorage.setItem('azureVoice', voiceChoice);
    }
  }, [voiceChoice]);

  useEffect(() => {
    setLanguage(settings.audioLanguage);
    setUseEdgeTts(settings.useAzureTts);
    setGradeLevel(settings.gradeLevel || 1);
    setAudioSpeed(settings.audioSpeed || 0.75);
  }, [settings]);

  const handleEngineChange = (engine: TtsEngine) => {
    setTtsEngineLocal(engine);
    setTtsEngine(engine);
    if (engine === 'edge') {
      setUseEdgeTts(true);
    }
  };

  const themes = [
    { id: 'default', name: 'Default', colors: 'bg-gradient-to-br from-[#2a2d2f] to-[#1a1c1e]' },
    { id: 'hacker', name: 'Matrix Hacker', colors: 'bg-gradient-to-br from-[#0a0a0a] to-[#00b06f]' },
    { id: 'lava', name: 'Obby Lava', colors: 'bg-gradient-to-br from-[#ff6b35] to-[#ff3e3e]' },
    { id: 'diamond', name: 'Diamond', colors: 'bg-gradient-to-br from-[#4db8ff] to-[#ffffff]' },
  ];

  const themePrices: Record<string, number> = {
    'hacker': 300,
    'lava': 300,
    'diamond': 500,
  };

  const handleSaveSettings = () => {
    onSettingsChange({
      audioLanguage: language as 'zh-CN' | 'zh-HK',
      useAzureTts: useEdgeTts,
      gradeLevel,
      audioSpeed,
      bgmVolume: settings.bgmVolume ?? 0.1,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleClearCache = () => {
    clearAudioCache();
    window.location.reload();
  };

  const handleTestAudio = async () => {
    setIsTestingAudio(true);
    try {
      await speakChinese('你好世界', '', '', useEdgeTts, language, audioSpeed);
    } catch (error) {
      console.error('Test audio error:', error);
    } finally {
      setIsTestingAudio(false);
    }
  };

  const handleBuyTheme = (themeId: string) => {
    const price = themePrices[themeId] || 0;
    if (hanziCoins >= price) {
      onInventoryChange({ ...inventory, theme: themeId });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
          >
            <div className="sticky top-0 modal-content border-b border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#00b06f]" />
                <h2 className="text-2xl font-bold text-white">Settings & Shop</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="border border-white/10 bg-black/20 rounded-2xl p-4">
                <p className="text-[#ffd700] text-lg font-bold">Balance: {hanziCoins} Jade</p>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Voice Engine</h3>
                <div className="space-y-2">
                  {ENGINE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = ttsEngine === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleEngineChange(opt.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          isActive
                            ? 'border-[#00b06f] bg-[#00b06f]/10'
                            : 'border-gray-700 bg-black/20 hover:border-gray-500'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#00b06f]' : 'text-gray-400'}`} />
                        <div className="min-w-0">
                          <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                            {opt.label}
                          </p>
                          <p className="text-gray-500 text-xs truncate">{opt.desc}</p>
                        </div>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-[#00b06f] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Audio Settings</h3>
                <div className="space-y-4">
                  {(ttsEngine === 'azure' || ttsEngine === 'edge') && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Voice</label>
                      <select
                        value={voiceChoice}
                        onChange={(e) => setVoiceChoice(e.target.value)}
                        className="w-full border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00b06f]"
                      >
                        <optgroup label="Female Voices">
                          <option value="zh-CN-XiaoxiaoNeural">Xiaoxiao - Warm & Friendly</option>
                          <option value="zh-CN-XiaoyiNeural">Xiaoyi - Lively & Youthful</option>
                        </optgroup>
                        <optgroup label="Male Voices">
                          <option value="zh-CN-YunxiNeural">Yunxi - Natural & Clear</option>
                          <option value="zh-CN-YunjianNeural">Yunjian - Deep & Confident</option>
                          <option value="zh-CN-YunyangNeural">Yunyang - Professional Newscaster</option>
                        </optgroup>
                      </select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleTestAudio}
                      disabled={isTestingAudio}
                      className="flex-1 bg-[#00b06f] hover:bg-[#00d184] disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Volume2 className="w-5 h-5" />
                      {isTestingAudio ? 'Testing...' : 'Test Voice'}
                    </button>
                    <button
                      onClick={handleClearCache}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cache
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(Number(e.target.value))}
                      className="w-full border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00b06f]"
                    >
                      <option value={1}>Grade 1 (Basic Nouns)</option>
                      <option value={2}>Grade 2 (Actions & Verbs)</option>
                      <option value={3}>Grade 3 (Animals & Verbs)</option>
                      <option value={4}>Grade 4 (Advanced Actions)</option>
                      <option value={5}>Grade 5 (Abstract Concepts)</option>
                      <option value={6}>Grade 6 (Idioms & Complex)</option>
                    </select>
                    <p className="text-gray-500 text-xs mt-2">Changes curriculum difficulty</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'zh-CN' | 'zh-HK')}
                      className="w-full border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00b06f]"
                    >
                      <option value="zh-CN">Mandarin (Mainland)</option>
                      <option value="zh-HK">Cantonese (Hong Kong)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Speaking Speed: {audioSpeed.toFixed(2)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={audioSpeed}
                      onChange={(e) => setAudioSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00b06f]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5x (Slower)</span>
                      <span>0.75x (Perfect for Learning)</span>
                      <span>1.0x (Normal)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Background Music Volume: {Math.round((settings.bgmVolume ?? 0.1) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.bgmVolume ?? 0.1}
                      onChange={(e) => {
                        const newVolume = Number(e.target.value);
                        onSettingsChange({
                          ...settings,
                          bgmVolume: newVolume,
                        });
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00b06f]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0% (Muted)</span>
                      <span>50%</span>
                      <span>100% (Max)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="w-full bg-[#00b06f] hover:bg-[#00d184] text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Themes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <motion.button
                      key={theme.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => theme.id !== 'default' && handleBuyTheme(theme.id)}
                      disabled={
                        hanziCoins < (themePrices[theme.id] || 0) && theme.id !== 'default'
                      }
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${inventory.theme === theme.id
                          ? 'border-[#ffd700] ring-2 ring-[#ffd700]'
                          : 'border-gray-600'
                        }
                        ${theme.colors}
                      `}
                    >
                      <p className="text-white font-bold text-sm mb-2">{theme.name}</p>
                      {theme.id !== 'default' && (
                        <p className="text-gray-300 text-xs">
                          {inventory.theme === theme.id ? 'Owned' : `${themePrices[theme.id]} Jade`}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <Toast
        message="Settings saved successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </AnimatePresence>
  );
}
