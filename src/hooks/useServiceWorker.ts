import { useEffect } from 'react';
import { useNotificationStore } from '../store';
import type { Notification } from '../types';
import toast from 'react-hot-toast';

export const useServiceWorker = () => {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered:', reg.scope);
      })
      .catch((err) => console.warn('[SW] Registration failed:', err));

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          toast.success('Notifications enabled!');
          // Simulate a welcome notification
          scheduleDemo(addNotification);
        }
      });
    } else if (Notification.permission === 'granted') {
      scheduleDemo(addNotification);
    }
  }, [addNotification]);
};

const scheduleDemo = (addNotification: (n: Notification) => void) => {
  // Simulate incoming alert after 30 seconds
  setTimeout(() => {
    const n: Notification = {
      id: `N${Date.now()}`,
      title: 'Medication Due',
      message: 'Patient Vikram Patel (P004) is due for his afternoon medication.',
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
    };
    addNotification(n);

    if (Notification.permission === 'granted') {
      new Notification(n.title, {
        body: n.message,
        icon: '/icon-192.png',
      });
    }

    toast('New alert: ' + n.title, { icon: '🔔' });
  }, 30000);
};
