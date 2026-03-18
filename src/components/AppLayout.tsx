import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUIStore } from '../store';
import { useServiceWorker } from '../hooks/useServiceWorker';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  useServiceWorker();
  const { sidebarOpen } = useUIStore();

  return (
    <div className={`app-layout ${sidebarOpen ? 'app-layout--sidebar-open' : 'app-layout--sidebar-collapsed'}`}>
      <Sidebar />
      <div className="app-layout__content">
        <Topbar title={title} />
        <main className="app-layout__main">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
