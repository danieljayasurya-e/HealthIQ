import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';
import AppLayout from '../components/AppLayout';
import { mockAnalytics, mockPatients } from '../data/mockData';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

const conditionData = mockPatients.reduce<Record<string, number>>((acc, p) => {
  acc[p.condition] = (acc[p.condition] || 0) + 1;
  return acc;
}, {});
const pieData = Object.entries(conditionData).map(([name, value]) => ({ name, value }));

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#f97316', '#6366f1'];

const genderData = [
  { name: 'Male', value: mockPatients.filter((p) => p.gender === 'Male').length },
  { name: 'Female', value: mockPatients.filter((p) => p.gender === 'Female').length },
];

const insuranceData = mockPatients.reduce<Record<string, number>>((acc, p) => {
  acc[p.insurance] = (acc[p.insurance] || 0) + 1;
  return acc;
}, {});
const insuranceChartData = Object.entries(insuranceData).map(([name, count]) => ({ name, count }));

const Analytics: React.FC = () => {
  const [range, setRange] = useState<'3m' | '6m' | 'all'>('all');

  const filteredData = range === '3m'
    ? mockAnalytics.slice(-3)
    : range === '6m'
    ? mockAnalytics.slice(-6)
    : mockAnalytics;

  const totalRevenue = mockAnalytics.reduce((s, d) => s + d.revenue, 0);
  const totalAdmissions = mockAnalytics.reduce((s, d) => s + d.admissions, 0);

  const kpis = [
    { label: 'Total Revenue', value: `₹${(totalRevenue / 10000000).toFixed(1)}Cr`, icon: DollarSign, color: '#22c55e' },
    { label: 'Total Admissions', value: totalAdmissions, icon: Users, color: 'var(--accent)' },
    { label: 'Avg Bed Occupancy', value: '78%', icon: Activity, color: '#8b5cf6' },
    { label: 'Revenue Growth', value: '+35%', icon: TrendingUp, color: '#f59e0b' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)' }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontSize: 13 }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'Revenue'
              ? `₹${(p.value / 100000).toFixed(1)}L`
              : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <AppLayout title="Analytics">
      <div className="analytics-page">
        {/* KPI strip */}
        <div className="kpi-strip">
          {kpis.map((k) => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-card__icon" style={{ background: k.color + '20', color: k.color }}>
                <k.icon size={20} />
              </div>
              <div>
                <p className="kpi-card__label">{k.label}</p>
                <p className="kpi-card__value">{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Range filter */}
        <div className="analytics-filters">
          <span className="analytics-filters__label">Time Range:</span>
          {(['3m', '6m', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`analytics-filter-btn ${range === r ? 'analytics-filter-btn--active' : ''}`}
            >
              {r === '3m' ? 'Last 3 Months' : r === '6m' ? 'Last 6 Months' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="analytics-grid">
          {/* Revenue trend */}
          <div className="chart-card chart-card--wide">
            <div className="chart-card__header">
              <h3>Revenue Trend</h3>
              <span className="chart-card__badge">Monthly</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Admissions vs Discharges bar */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Admissions vs Discharges</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="admissions" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Admissions" />
                <Bar dataKey="discharges" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Discharges" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Condition distribution pie */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Patient Conditions</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender split */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Gender Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  <Cell fill="var(--accent)" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Insurance distribution */}
          <div className="chart-card chart-card--wide">
            <div className="chart-card__header">
              <h3>Patients by Insurance Provider</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={insuranceChartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
