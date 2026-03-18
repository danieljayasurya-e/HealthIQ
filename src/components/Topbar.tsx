import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../store';
import { formatDistanceToNow } from 'date-fns';

const typeColors: Record<string, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#22c55e',
};

const Topbar: React.FC<{ title: string }> = ({ title }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { notifications, markAllRead, markRead } = useNotificationStore();
  const unread = notifications.filter((n) => !n.read).length;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__title">{title}</h1>
        <div className="topbar__search">
          <Search size={15} className="topbar__search-icon" />
          <input
            type="text"
            placeholder="Search patients, records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="topbar__search-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="topbar__search-clear">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar__right">
        <div ref={panelRef} style={{ position: 'relative' }}>
          <button
            className={`topbar__notif-btn ${unread > 0 ? 'topbar__notif-btn--active' : ''}`}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={18} />
            {unread > 0 && <span className="topbar__badge">{unread}</span>}
          </button>

          {notifOpen && (
            <div className="notif-panel">
              <div className="notif-panel__header">
                <span>Notifications</span>
                <button onClick={markAllRead} className="notif-panel__mark-all">
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>
              <div className="notif-panel__list">
                {notifications.length === 0 && (
                  <p className="notif-panel__empty">No notifications</p>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div
                      className="notif-item__dot"
                      style={{ background: typeColors[n.type] }}
                    />
                    <div className="notif-item__body">
                      <p className="notif-item__title">{n.title}</p>
                      <p className="notif-item__msg">{n.message}</p>
                      <p className="notif-item__time">
                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="topbar__date">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
          })}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
