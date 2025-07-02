import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationToast, { NotificationToastProps } from '../components/NotificationToast';

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationToastProps, 'id' | 'onClose'>) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationToastProps[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((notification: Omit<NotificationToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationToastProps = {
      ...notification,
      id,
      onClose: removeNotification
    };
    
    setNotifications(prev => [...prev, newNotification]);
  }, [removeNotification]);

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification({ type: 'success', title, message });
  }, [showNotification]);

  const showError = useCallback((title: string, message: string) => {
    showNotification({ type: 'error', title, message });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    showNotification({ type: 'warning', title, message });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    showNotification({ type: 'info', title, message });
  }, [showNotification]);

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            {...notification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}; 