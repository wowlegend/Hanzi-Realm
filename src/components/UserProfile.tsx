import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Cloud, X, Pencil, Check, Loader, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  onLoginClick: () => void;
}

export default function UserProfile({ onLoginClick }: UserProfileProps) {
  const { user, username, signOut, updateUsername, updatePassword } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState<'none' | 'username' | 'password'>('none');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const displayName = username || user.email?.split('@')[0] || 'Player';

  const handleEditUsername = () => {
    setNewUsername(displayName);
    setEditMode('username');
    setError('');
    setSuccess('');
  };

  const handleEditPassword = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setEditMode('password');
    setError('');
    setSuccess('');
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    if (newUsername.trim() === displayName) {
      setEditMode('none');
      return;
    }

    setSaving(true);
    setError('');

    const { error } = await updateUsername(newUsername.trim());

    setSaving(false);

    if (error) {
      setError(error.message.includes('duplicate') ? 'Username already taken' : error.message);
    } else {
      setSuccess('Username updated!');
      setEditMode('none');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    setError('');

    const { error } = await updatePassword(newPassword);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated!');
      setEditMode('none');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleCancel = () => {
    setEditMode('none');
    setError('');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    setEditMode('none');
    setError('');
    setSuccess('');
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
        <span className="text-white font-bold hidden sm:inline">{displayName}</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => {
                if (editMode === 'none') handleCloseMenu();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-full mt-2 voxel-card bg-gray-900 rounded-xl p-4 min-w-[280px] z-50"
            >
              <button
                onClick={handleCloseMenu}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 bg-green-500/20 border border-green-500 rounded-lg p-2 text-green-300 text-sm text-center"
                >
                  {success}
                </motion.div>
              )}

              <div className="mb-3 pb-3 border-b border-white/10">
                {editMode === 'username' ? (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-xs">Username</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-black/30 border-2 border-white/20 text-white focus:border-[#00b06f] focus:outline-none text-sm"
                        placeholder="Enter username"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveUsername();
                          if (e.key === 'Escape') handleCancel();
                        }}
                      />
                      <button
                        onClick={handleSaveUsername}
                        disabled={saving}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg">{displayName}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleEditUsername}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit username"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editMode === 'password' ? (
                <div className="mb-3 pb-3 border-b border-white/10 space-y-3">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-xs">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 rounded-lg bg-black/30 border-2 border-white/20 text-white focus:border-[#00b06f] focus:outline-none text-sm"
                        placeholder="New password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-xs">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border-2 border-white/20 text-white focus:border-[#00b06f] focus:outline-none text-sm"
                      placeholder="Confirm password"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePassword();
                        if (e.key === 'Escape') handleCancel();
                      }}
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePassword}
                      disabled={saving}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white text-sm font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : editMode === 'none' ? (
                <button
                  onClick={handleEditPassword}
                  className="w-full mb-3 pb-3 border-b border-white/10 flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2"
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Change Password</span>
                </button>
              ) : null}

              <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                <Cloud className="w-4 h-4" />
                <span>Cloud sync enabled</span>
              </div>

              <motion.button
                onClick={() => {
                  signOut();
                  handleCloseMenu();
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
