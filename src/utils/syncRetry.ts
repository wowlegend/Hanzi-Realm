type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

type SyncListener = (status: SyncStatus) => void;

let currentStatus: SyncStatus = 'idle';
const listeners: Set<SyncListener> = new Set();

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function onSyncStatusChange(listener: SyncListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setStatus(status: SyncStatus) {
  currentStatus = status;
  listeners.forEach(fn => fn(status));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  setStatus('syncing');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      setStatus('success');
      setTimeout(() => {
        if (currentStatus === 'success') setStatus('idle');
      }, 2000);
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        setStatus('error');
        setTimeout(() => {
          if (currentStatus === 'error') setStatus('idle');
        }, 5000);
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Retry exhausted');
}
