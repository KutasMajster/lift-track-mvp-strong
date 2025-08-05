import { useState, useCallback } from 'react';

export const useRefreshNotification = () => {
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);

  const showRefreshNotification = useCallback(() => {
    setShowRefreshDialog(true);
  }, []);

  const hideRefreshNotification = useCallback(() => {
    setShowRefreshDialog(false);
  }, []);

  const refreshApp = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    showRefreshDialog,
    showRefreshNotification,
    hideRefreshNotification,
    refreshApp
  };
};