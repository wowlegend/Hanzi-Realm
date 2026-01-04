import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Cloud, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  onLoginClick: () => void;
}

export default function UserProfile({ onLoginClick }: UserProfileProps) {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return (
      <motion.button
        onClick={onLoginClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-3d bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl p-3 flex items-center gap-2"
      >
        <User className="w-5 h-5 text-white" />
        <span className="text-white font-bold hidden sm:inline">Login</span>
      </motion.button>
    );
  }

  const getUsername = () => {
    return user.email?.split('@')[0] || 'Player';
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-3d bg-gradient-to-b from-green-500 to-green-600 rounded-xl p-3 flex items-center gap-2"
      >
        <User className="w-5 h-5 text-white" />
        <span className="text-white font-bold hidden sm:inline">{getUsername()}</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-full mt-2 voxel-card bg-gray-900 rounded-xl p-4 min-w-[200px] z-50"
            >
              <button
                onClick={() => setShowMenu(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-3 pb-3 border-b border-white/10">
                <p className="text-white font-bold text-lg">{getUsername()}</p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>

              <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                <Cloud className="w-4 h-4" />
                <span>Cloud sync enabled</span>
              </div>

              <motion.button
                onClick={() => {
                  signOut();
                  setShowMenu(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
