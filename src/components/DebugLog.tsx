import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DebugLogProps {
  message: string;
  isError: boolean;
  onClose: () => void;
}

export default function DebugLog({ message, isError, onClose }: DebugLogProps) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-0 left-0 right-0 ${
          isError ? 'bg-red-600' : 'bg-green-600'
        } text-white p-4 z-[200] shadow-2xl`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-bold text-sm mb-1">
              {isError ? '🔴 ElevenLabs API Error' : '✅ ElevenLabs Success'}
            </p>
            <p className="text-xs font-mono break-all">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
