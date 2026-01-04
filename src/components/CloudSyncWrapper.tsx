import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudOff, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  loadProgressFromCloud,
  loadCompanionsFromCloud,
  loadSettingsFromCloud,
  loadMapStateFromCloud,
} from '../utils/cloudStorage';

interface CloudSyncWrapperProps {
  children: ReactNode;
  onDataLoaded: (data: {
    progress: any;
    companions: any;
    settings: any;
    mapState: any;
  }) => void;
}

export default function CloudSyncWrapper({ children, onDataLoaded }: CloudSyncWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      loadCloudData();
    }
  }, [user, authLoading]);

  const loadCloudData = async () => {
    if (!user) return;

    setSyncStatus('syncing');
    setShowStatus(true);

    try {
      const [progress, companionData, settingsData, mapState] = await Promise.all([
        loadProgressFromCloud(user.id),
        loadCompanionsFromCloud(user.id),
        loadSettingsFromCloud(user.id),
        loadMapStateFromCloud(user.id, 1),
      ]);

      onDataLoaded({
        progress,
        companions: companionData,
        settings: settingsData,
        mapState,
      });

      setSyncStatus('synced');
      setTimeout(() => setShowStatus(false), 2000);
    } catch (error) {
      console.error('Error loading cloud data:', error);
      setSyncStatus('error');
      setTimeout(() => setShowStatus(false), 3000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#00b06f] animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-bold">Loading Hanzi Realm...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {showStatus && user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`voxel-card px-6 py-3 flex items-center gap-3 ${
            syncStatus === 'synced' ? 'border-green-500' :
            syncStatus === 'error' ? 'border-red-500' :
            'border-blue-500'
          }`}>
            {syncStatus === 'syncing' && (
              <>
                <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-white font-bold">Syncing with cloud...</span>
              </>
            )}
            {syncStatus === 'synced' && (
              <>
                <Cloud className="w-5 h-5 text-green-400" />
                <span className="text-white font-bold">Cloud sync complete!</span>
              </>
            )}
            {syncStatus === 'error' && (
              <>
                <CloudOff className="w-5 h-5 text-red-400" />
                <span className="text-white font-bold">Sync failed, using local data</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
