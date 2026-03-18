import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Bed, AlertCircle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity,
  Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import AppLayout from '../components/AppLayout';
import { mockPatients, mockAnalytics, mockNotifications } from '../data/mockData';
import { useAuthStore } from '../store';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const totalPatients = mockPatients.length;
  const critical = mockPatients.filter((p) => p.status === 'Critical').length;

  const statCards = [
    {
      label: 'Total Patients',
      value: totalPatients,
      icon: Users,
      trend: '+12%',
      up: true,
      color: 'var(--accent)',
    },
    {
      label: 'Occupied Beds',
      value: 47,
      icon: Bed,
      trend: '+3%',
      up: true,
      color: '#8b5cf6',
    },
    {
      label: 'Critical Cases',
      value: critical,
      icon: AlertCircle,
      trend: '-1',
      up: false,
      color: '#ef4444',
    },
    {
      label: 'Recovered Today',
      value: 5,
      icon: TrendingUp,
      trend: '+25%',
      up: true,
      color: '#22c55e',
    },
  ];

  const wardData = [
    { ward: 'Cardiology', patients: 14, capacity: 20 },
    { ward: 'Neurology', patients: 9, capacity: 15 },
    { ward: 'Orthopedics', patients: 11, capacity: 18 },
    { ward: 'Pulmonology', patients: 7, capacity: 12 },
    { ward: 'Surgery', patients: 6, capacity: 10 },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="dashboard">
        {/* Greeting */}
        <div className="dashboard__greeting">
          <div>
            <h2>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
              <span style={{ color: 'var(--accent)' }}>
                {user?.displayName?.split(' ')[0] || 'Admin'}
              </span>
            </h2>
            <p>Here's what's happening across the facility today.</p>
          </div>
          <div className="dashboard__live-badge">
            <span className="live-dot" /> LIVE
          </div>
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          {statCards.map((card) => (
            <div key={card.label} className="stat-card">
              <div className="stat-card__top">
                <span className="stat-card__label">{card.label}</span>
                <div className="stat-card__icon" style={{ background: card.color + '20', color: card.color }}>
                  <card.icon size={18} />
                </div>
              </div>
              <div className="stat-card__value">{card.value}</div>
              <div className={`stat-card__trend ${card.up ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend} from last week
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard__grid">
          {/* Admissions chart */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Admissions & Discharges</h3>
              <span className="chart-card__badge">Last 7 months</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                />
                <Area type="monotone" dataKey="admissions" stroke="var(--accent)" strokeWidth={2} fill="url(#admGrad)" name="Admissions" />
                <Area type="monotone" dataKey="discharges" stroke="#8b5cf6" strokeWidth={2} fill="url(#disGrad)" name="Discharges" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Ward occupancy */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Ward Occupancy</h3>
              <span className="chart-card__badge">Live</span>
            </div>
            <div className="ward-list">
              {wardData.map((w) => {
                const pct = Math.round((w.patients / w.capacity) * 100);
                const color = pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : 'var(--accent)';
                return (
                  <div key={w.ward} className="ward-item">
                    <div className="ward-item__top">
                      <span>{w.ward}</span>
                      <span style={{ color }}>{w.patients}/{w.capacity}</span>
                    </div>
                    <div className="ward-item__bar">
                      <div
                        className="ward-item__fill"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent patients */}
          <div className="chart-card chart-card--wide">
            <div className="chart-card__header">
              <h3>Recent Patients</h3>
              <button onClick={() => navigate('/patients')} className="chart-card__link">
                View all →
              </button>
            </div>
            <div className="recent-patients">
              {mockPatients.slice(0, 5).map((p) => {
                const statusColor = {
                  Stable: '#22c55e', Critical: '#ef4444',
                  Recovering: '#f59e0b', Discharged: '#6b7280',
                }[p.status];
                return (
                  <div key={p.id} className="recent-patient" onClick={() => navigate('/patients')}>
                    <div className="recent-patient__avatar">{p.avatar}</div>
                    <div className="recent-patient__info">
                      <p className="recent-patient__name">{p.name}</p>
                      <p className="recent-patient__meta">{p.condition} · {p.ward}</p>
                    </div>
                    <div className="recent-patient__status" style={{ color: statusColor }}>
                      <span className="status-dot" style={{ background: statusColor }} />
                      {p.status}
                    </div>
                    <div className="recent-patient__vitals">
                      <Activity size={12} />
                      {p.vitals.heartRate} bpm
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications feed */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Recent Alerts</h3>
            </div>
            <div className="alert-list">
              {mockNotifications.map((n) => {
                const Icon = n.type === 'critical' ? XCircle : n.type === 'success' ? CheckCircle2 : n.type === 'warning' ? AlertCircle : Clock;
                const color = { critical: '#ef4444', warning: '#f59e0b', info: '#3b82f6', success: '#22c55e' }[n.type];
                return (
                  <div key={n.id} className={`alert-item ${!n.read ? 'alert-item--unread' : ''}`}>
                    <Icon size={16} style={{ color, flexShrink: 0 }} />
                    <div>
                      <p className="alert-item__title">{n.title}</p>
                      <p className="alert-item__msg">{n.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
