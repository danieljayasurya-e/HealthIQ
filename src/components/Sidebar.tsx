import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Users, LogOut,
  Heart, ChevronLeft, ChevronRight, Activity,
} from 'lucide-react';
import { useUIStore, useAuthStore } from '../store';
import { logOut } from '../firebase';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/patients', icon: Users, label: 'Patients' },
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <aside
      className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}
      style={{ transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Heart size={20} strokeWidth={2.5} />
          <Activity size={14} className="sidebar__logo-pulse" />
        </div>
        {sidebarOpen && (
          <span className="sidebar__logo-text">
            Health<span style={{ color: 'var(--accent)' }}>IQ</span>
          </span>
        )}
      </div>

      {/* Toggle button */}
      <button className="sidebar__toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {sidebarOpen && <p className="sidebar__section-label">MAIN MENU</p>}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
            }
          >
            <Icon size={18} />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user info */}
      <div className="sidebar__bottom">
        {sidebarOpen && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <p className="sidebar__user-name">{user?.displayName || 'Admin User'}</p>
              <p className="sidebar__user-role">Healthcare Admin</p>
            </div>
          </div>
        )}
        <button className="sidebar__item sidebar__item--logout" onClick={handleLogout}>
          <LogOut size={18} />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
