import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, Check, Loader2 } from 'lucide-react';
import { onSyncStatusChange, getSyncStatus } from '../utils/syncRetry';

export default function SyncIndicator() {
  const [status, setStatus] = useState(getSyncStatus());

  useEffect(() => {
    return onSyncStatusChange(setStatus);
  }, []);

  if (status === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed bottom-16 sm:bottom-4 right-4 z-40"
      >
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
          status === 'syncing'
            ? 'bg-sky-900/60 border-sky-500/30 text-sky-300'
            : status === 'success'
              ? 'bg-green-900/60 border-green-500/30 text-green-300'
              : 'bg-red-900/60 border-red-500/30 text-red-300'
        }`}>
          {status === 'syncing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'success' && <Check className="w-3 h-3" />}
          {status === 'error' && <CloudOff className="w-3 h-3" />}
          <span>
            {status === 'syncing' && 'Saving...'}
            {status === 'success' && 'Saved'}
            {status === 'error' && 'Sync failed'}
          </span>
          {status !== 'error' && <Cloud className="w-3 h-3 opacity-50" />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
