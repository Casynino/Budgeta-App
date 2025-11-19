import React from 'react';
import { Cloud, CloudOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const SyncIndicator = () => {
  const { currentUser } = useAuth();
  const { isLoading, isSyncing, syncError, lastSyncTime } = useFinance();

  // Don't show if no user (offline mode)
  if (!currentUser) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-500/10 text-gray-400">
        <CloudOff className="w-4 h-4" />
        <span className="text-xs font-medium">Offline Mode</span>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 text-primary-400">
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-xs font-medium">Loading data...</span>
      </div>
    );
  }

  // Show syncing state
  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 text-primary-400">
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-xs font-medium">Syncing...</span>
      </div>
    );
  }

  // Show error state
  if (syncError) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger-500/10 text-danger-400">
        <AlertCircle className="w-4 h-4" />
        <span className="text-xs font-medium">Sync error</span>
      </div>
    );
  }

  // Show synced state
  if (lastSyncTime) {
    const timeAgo = formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true });
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-400">
        <CheckCircle className="w-4 h-4" />
        <span className="text-xs font-medium">Synced {timeAgo}</span>
      </div>
    );
  }

  // Default: connected
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-400">
      <Cloud className="w-4 h-4" />
      <span className="text-xs font-medium">Connected</span>
    </div>
  );
};

export default SyncIndicator;
