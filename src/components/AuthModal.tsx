import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, User, Mail, Lock, LogIn, UserPlus, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      } else if (mode === 'signup') {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        onClose();
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccessMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setSuccessMessage('');
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return { icon: LogIn, text: 'Login' };
      case 'signup':
        return { icon: UserPlus, text: 'Sign Up' };
      case 'forgot':
        return { icon: KeyRound, text: 'Reset Password' };
    }
  };

  const title = getTitle();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="voxel-card bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full pointer-events-auto border-4 border-[#00b06f]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
                  <title.icon className="w-8 h-8 text-[#00b06f]" />
                  {title.text}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {mode === 'forgot' && (
                <button
                  onClick={() => switchMode('login')}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border-2 border-green-500 rounded-xl p-3 text-green-200 text-sm mb-4"
                >
                  {successMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-white font-bold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-white/20 text-white focus:border-[#00b06f] focus:outline-none transition-colors"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-white font-bold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-white/20 text-white focus:border-[#00b06f] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-white font-bold mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-white/20 text-white focus:border-[#00b06f] focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border-2 border-red-500 rounded-xl p-3 text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-3d-green w-full py-4 rounded-xl text-white font-black text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : mode === 'login' ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Login
                    </>
                  ) : mode === 'signup' ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Email
                    </>
                  )}
                </button>
              </form>

              {mode === 'login' && (
                <button
                  onClick={() => switchMode('forgot')}
                  className="mt-4 text-gray-400 hover:text-[#00b06f] text-sm transition-colors block w-full text-center"
                >
                  Forgot your password?
                </button>
              )}

              {mode !== 'forgot' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-[#00b06f] hover:text-[#00d084] font-bold transition-colors"
                  >
                    {mode === 'login'
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Login'}
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center">
                  {mode === 'forgot'
                    ? "We'll send you an email with a link to reset your password."
                    : 'Your progress will be saved to the cloud and accessible from any device.'}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
