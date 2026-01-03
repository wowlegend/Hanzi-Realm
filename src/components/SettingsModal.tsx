import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Trash2, Volume2 } from 'lucide-react';
import { GameSettings, PlayerInventory } from '../types';
import Toast from './Toast';
import { clearAudioCache, speakChinese } from '../utils/audio';
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

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  inventory,
  hanziCoins,
  onSettingsChange,
  onInventoryChange,
}: SettingsModalProps) {
  const [azureVoice, setAzureVoice] = useState(() => {
    return localStorage.getItem('azureVoice') || AUDIO_DEFAULTS.VOICE;
  });
  const [language, setLanguage] = useState(settings.audioLanguage);
  const [useAzure, setUseAzure] = useState(settings.useElevenLabs);
  const [gradeLevel, setGradeLevel] = useState(settings.gradeLevel || 1);
  const [audioSpeed, setAudioSpeed] = useState(settings.audioSpeed || 0.75);
  const [showToast, setShowToast] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);

  useEffect(() => {
    if (azureVoice) {
      localStorage.setItem('azureVoice', azureVoice);
    }
  }, [azureVoice]);

  useEffect(() => {
    setLanguage(settings.audioLanguage);
    setUseAzure(settings.useElevenLabs);
    setGradeLevel(settings.gradeLevel || 1);
    setAudioSpeed(settings.audioSpeed || 0.75);
  }, [settings]);

  const themes = [
    { id: 'default', name: 'Default', colors: 'bg-gradient-to-br from-[#2a2d2f] to-[#1a1c1e]' },
    { id: 'hacker', name: 'Matrix Hacker', colors: 'bg-gradient-to-br from-[#0a0a0a] to-[#00b06f]' },
    { id: 'lava', name: 'Obby Lava', colors: 'bg-gradient-to-br from-[#ff6b35] to-[#ff3e3e]' },
    { id: 'diamond', name: 'Diamond', colors: 'bg-gradient-to-br from-[#4db8ff] to-[#ffffff]' },
  ];

  const pets = [
    { id: 'none', name: 'None', emoji: '✓' },
    { id: 'doge', name: 'Doge', emoji: '🐕' },
    { id: 'dragon', name: 'Dragon', emoji: '🐉' },
  ];

  const petPrices: Record<string, number> = {
    'doge': 500,
    'dragon': 1000,
  };

  const themePrices: Record<string, number> = {
    'hacker': 300,
    'lava': 300,
    'diamond': 500,
  };

  const handleSaveSettings = () => {
    onSettingsChange({
      elevenLabsApiKey: '',
      audioLanguage: language as 'zh-CN' | 'zh-HK',
      useElevenLabs: useAzure,
      voiceId: '',
      gradeLevel,
      audioSpeed,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleClearCache = () => {
    clearAudioCache();
    localStorage.removeItem('azure_key');
    localStorage.removeItem('azure_region');
    window.location.reload();
  };

  const handleTestAudio = async () => {
    if (!AUDIO_DEFAULTS.KEY) {
      alert('Azure API Key not configured');
      return;
    }
    setIsTestingAudio(true);
    try {
      await speakChinese('你好', AUDIO_DEFAULTS.KEY, AUDIO_DEFAULTS.REGION, useAzure, language, audioSpeed);
    } catch (error) {
      console.error('Test audio error:', error);
    } finally {
      setIsTestingAudio(false);
    }
  };

  const handleBuyTheme = (themeId: string) => {
    const price = themePrices[themeId] || 0;
    if (hanziCoins >= price) {
      onInventoryChange({ ...inventory, theme: themeId as any });
    }
  };

  const handleBuyPet = (petId: string) => {
    const price = petPrices[petId] || 0;
    if (hanziCoins >= price) {
      onInventoryChange({ ...inventory, pet: petId as any });
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
                <p className="text-[#ffd700] text-lg font-bold">Balance: {hanziCoins} HC</p>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Audio Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAzure}
                      onChange={(e) => setUseAzure(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-300">Use Azure TTS for Premium Audio</span>
                  </label>

                  {useAzure && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Voice Gender</label>
                        <select
                          value={azureVoice}
                          onChange={(e) => setAzureVoice(e.target.value)}
                          className="w-full border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00b06f]"
                        >
                          <option value="zh-CN-YunxiNeural">Male (Yunxi)</option>
                          <option value="zh-CN-XiaoxiaoNeural">Female (Xiaoxiao)</option>
                        </select>
                        <p className="text-gray-500 text-xs mt-2">Choose your preferred narrator voice</p>
                      </div>
                      <div>
                        <button
                          onClick={handleTestAudio}
                          disabled={isTestingAudio || !AUDIO_DEFAULTS.KEY}
                          className="w-full bg-[#00b06f] hover:bg-[#00d184] disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Volume2 className="w-5 h-5" />
                          {isTestingAudio ? 'Testing...' : 'Test Azure Voice'}
                        </button>
                        <p className="text-gray-500 text-xs mt-2">Test the selected voice</p>
                      </div>
                      <div>
                        <button
                          onClick={handleClearCache}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Clear Audio Cache & Reset
                        </button>
                        <p className="text-gray-500 text-xs mt-2">Force refresh all cached audio</p>
                      </div>
                    </div>
                  )}

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
                      onChange={(e) => setLanguage(e.target.value as any)}
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
                    <p className="text-gray-500 text-xs mt-2">Adjust the speaking speed for better comprehension</p>
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
                          {inventory.theme === theme.id ? 'Owned' : `${themePrices[theme.id]} HC`}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Pets</h3>
                <div className="grid grid-cols-3 gap-3">
                  {pets.map((pet) => (
                    <motion.button
                      key={pet.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => pet.id !== 'none' && handleBuyPet(pet.id)}
                      disabled={hanziCoins < (petPrices[pet.id] || 0) && pet.id !== 'none'}
                      className={`
                        p-4 rounded-xl border-2 transition-all hover:bg-white/5
                        ${inventory.pet === pet.id
                          ? 'border-[#ffd700] ring-2 ring-[#ffd700]'
                          : 'border-gray-600'
                        }
                      `}
                    >
                      <p className="text-3xl mb-2">{pet.emoji}</p>
                      <p className="text-white font-bold text-sm mb-2">{pet.name}</p>
                      {pet.id !== 'none' && (
                        <p className="text-gray-300 text-xs">
                          {inventory.pet === pet.id ? 'Owned' : `${petPrices[pet.id]} HC`}
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
