import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Gift } from 'lucide-react';

const CHECKLIST_KEY = 'hanzi_checklist';
const DISMISSED_KEY = 'hanzi_checklist_dismissed';

export interface ChecklistTask {
  id: string;
  label: string;
  jade: number;
  done: boolean;
  claimed: boolean;
}

const INITIAL_TASKS: Omit<ChecklistTask, 'done' | 'claimed'>[] = [
  { id: 'select_grade', label: 'Choose your grade', jade: 50 },
  { id: 'first_battle', label: 'Answer a question', jade: 100 },
  { id: 'first_streak', label: 'Build a 3-streak', jade: 150 },
  { id: 'defeat_boss', label: 'Defeat a boss', jade: 300 },
  { id: 'roll_gacha', label: 'Roll in the Gacha', jade: 200 },
  { id: 'daily_reward', label: 'Claim a daily reward', jade: 50 },
];

export function loadChecklist(): ChecklistTask[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_TASKS.map(t => ({ ...t, done: false, claimed: false }));
}

export function saveChecklist(tasks: ChecklistTask[]): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(tasks));
}

export function markChecklistTask(id: string): { wasNew: boolean } {
  const tasks = loadChecklist();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1 || tasks[idx].done) return { wasNew: false };
  tasks[idx].done = true;
  saveChecklist(tasks);
  return { wasNew: true };
}

export function isChecklistDismissed(): boolean {
  return localStorage.getItem(DISMISSED_KEY) === 'true';
}

export function areAllTasksComplete(tasks: ChecklistTask[]): boolean {
  return tasks.every(t => t.done && t.claimed);
}

interface NewPlayerChecklistProps {
  onClaimReward: (amount: number) => void;
}

export default function NewPlayerChecklist({ onClaimReward }: NewPlayerChecklistProps) {
  const [tasks, setTasks] = useState<ChecklistTask[]>(loadChecklist);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(!isChecklistDismissed());

  useEffect(() => {
    const handler = () => setTasks(loadChecklist());
    window.addEventListener('checklist_update', handler);
    return () => window.removeEventListener('checklist_update', handler);
  }, []);

  const completedCount = tasks.filter(t => t.done).length;
  const allDone = tasks.every(t => t.claimed);

  const handleClaim = (task: ChecklistTask) => {
    if (!task.done || task.claimed) return;
    const updated = tasks.map(t => t.id === task.id ? { ...t, claimed: true } : t);
    setTasks(updated);
    saveChecklist(updated);
    onClaimReward(task.jade);
    if (updated.every(t => t.claimed)) {
      setTimeout(() => {
        localStorage.setItem(DISMISSED_KEY, 'true');
        setVisible(false);
      }, 1200);
    }
  };

  if (!visible || allDone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-4 z-40 w-64"
    >
      <div className="modal-content rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-white text-sm font-bold">New Player Rewards</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">{completedCount}/{tasks.length}</span>
            {collapsed ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </div>
        </button>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-1.5">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      task.claimed ? 'opacity-40' : task.done ? 'bg-teal-500/10 border border-teal-500/30' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {task.done
                        ? <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        : <Circle className="w-4 h-4 text-white/25 flex-shrink-0" />
                      }
                      <span className={`text-xs truncate ${task.done ? 'text-white/80' : 'text-white/40'}`}>
                        {task.label}
                      </span>
                    </div>
                    {task.done && !task.claimed ? (
                      <motion.button
                        onClick={() => handleClaim(task)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-2 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex-shrink-0"
                      >
                        +{task.jade}
                      </motion.button>
                    ) : (
                      <span className="ml-2 text-xs text-white/25 flex-shrink-0">+{task.jade}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
