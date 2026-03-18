import React, { useState, useMemo } from 'react';

import {
  LayoutGrid, List, Search, Filter, ChevronDown,
  Heart, Thermometer, Wind, Activity,
  Phone, Calendar, Shield, User,
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { mockPatients } from '../data/mockData';
import type { Patient } from '../types';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Stable: { bg: '#22c55e20', text: '#22c55e', dot: '#22c55e' },
  Critical: { bg: '#ef444420', text: '#ef4444', dot: '#ef4444' },
  Recovering: { bg: '#f59e0b20', text: '#f59e0b', dot: '#f59e0b' },
  Discharged: { bg: '#6b728020', text: '#6b7280', dot: '#6b7280' },
};

const PatientCard: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient: p, onClick }) => {
  const s = statusColors[p.status];
  return (
    <div className="patient-card" onClick={onClick}>
      <div className="patient-card__header">
        <div className="patient-card__avatar">{p.avatar}</div>
        <div className="patient-card__status" style={{ background: s.bg, color: s.text }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
          {p.status}
        </div>
      </div>

      <h3 className="patient-card__name">{p.name}</h3>
      <p className="patient-card__meta">{p.id} · {p.age}y · {p.gender}</p>
      <p className="patient-card__condition">{p.condition}</p>
      <p className="patient-card__ward">{p.ward}</p>

      <div className="patient-card__vitals">
        <div className="vital-chip">
          <Heart size={11} /> {p.vitals.heartRate}
        </div>
        <div className="vital-chip">
          <Thermometer size={11} /> {p.vitals.temperature}°
        </div>
        <div className="vital-chip">
          <Wind size={11} /> {p.vitals.oxygenSat}%
        </div>
      </div>

      <div className="patient-card__footer">
        <span>{p.doctor}</span>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.bloodType}</span>
      </div>
    </div>
  );
};

const PatientRow: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient: p, onClick }) => {
  const s = statusColors[p.status];
  return (
    <div className="patient-row" onClick={onClick}>
      <div className="patient-row__id-cell">
        <div className="patient-row__avatar">{p.avatar}</div>
        <div>
          <p className="patient-row__name">{p.name}</p>
          <p className="patient-row__id">{p.id}</p>
        </div>
      </div>
      <div className="patient-row__cell">{p.age}y · {p.gender}</div>
      <div className="patient-row__cell patient-row__cell--condition">{p.condition}</div>
      <div className="patient-row__cell">{p.ward}</div>
      <div className="patient-row__cell">
        <span className="status-badge" style={{ background: s.bg, color: s.text }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
          {p.status}
        </span>
      </div>
      <div className="patient-row__cell patient-row__vitals">
        <span><Heart size={11} /> {p.vitals.heartRate}</span>
        <span><Wind size={11} /> {p.vitals.oxygenSat}%</span>
      </div>
      <div className="patient-row__cell">{p.doctor}</div>
      <div className="patient-row__cell" style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.bloodType}</div>
    </div>
  );
};

// ── Patient Detail Modal ──────────────────────────────────────────────────────

const PatientModal: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient: p, onClose }) => {
  const s = statusColors[p.status];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-avatar">{p.avatar}</div>
          <div>
            <h2 className="modal-name">{p.name}</h2>
            <p className="modal-meta">{p.id} · {p.age} years · {p.gender}</p>
            <span className="status-badge" style={{ background: s.bg, color: s.text, display: 'inline-flex', marginTop: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />
              {p.status}
            </span>
          </div>
        </div>

        {/* Vitals strip */}
        <div className="modal-vitals">
          {[
            { icon: Heart, label: 'Heart Rate', val: `${p.vitals.heartRate} bpm`, color: '#ef4444' },
            { icon: Activity, label: 'Blood Pressure', val: p.vitals.bloodPressure, color: '#8b5cf6' },
            { icon: Thermometer, label: 'Temperature', val: `${p.vitals.temperature}°F`, color: '#f59e0b' },
            { icon: Wind, label: 'O₂ Saturation', val: `${p.vitals.oxygenSat}%`, color: 'var(--accent)' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="modal-vital-card">
              <div className="modal-vital-icon" style={{ background: color + '20', color }}>
                <Icon size={18} />
              </div>
              <p className="modal-vital-val">{val}</p>
              <p className="modal-vital-label">{label}</p>
            </div>
          ))}
        </div>

        {/* Details grid */}
        <div className="modal-details">
          {[
            { icon: User, label: 'Attending Doctor', val: p.doctor },
            { icon: Activity, label: 'Ward', val: p.ward },
            { icon: Shield, label: 'Insurance', val: p.insurance },
            { icon: Heart, label: 'Blood Type', val: p.bloodType },
            { icon: Phone, label: 'Contact', val: p.contact },
            { icon: Calendar, label: 'Admitted', val: new Date(p.admittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { icon: Calendar, label: 'Last Visit', val: new Date(p.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { icon: Calendar, label: 'Next Appointment', val: new Date(p.nextAppointment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="modal-detail-row">
              <div className="modal-detail-icon"><Icon size={14} /></div>
              <div>
                <p className="modal-detail-label">{label}</p>
                <p className="modal-detail-val">{val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--primary">Schedule Appointment</button>
          <button className="modal-btn modal-btn--secondary">View Full Records</button>
          <button className="modal-btn modal-btn--ghost">Print Summary</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const Patients: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterWard, setFilterWard] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const wards = ['All', ...Array.from(new Set(mockPatients.map((p) => p.ward)))];
  const statuses = ['All', 'Stable', 'Critical', 'Recovering', 'Discharged'];

  const filtered = useMemo(() => {
    return mockPatients.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase()) ||
        p.doctor.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchWard = filterWard === 'All' || p.ward === filterWard;
      return matchSearch && matchStatus && matchWard;
    });
  }, [search, filterStatus, filterWard]);

  return (
    <AppLayout title="Patient Details">
      <div className="patients-page">
        {/* Toolbar */}
        <div className="patients-toolbar">
          <div className="patients-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by name, ID, condition, doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="patients-toolbar__right">
            <button
              className={`toolbar-btn ${showFilters ? 'toolbar-btn--active' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter size={15} /> Filters <ChevronDown size={13} />
            </button>

            {/* View toggle */}
            <div className="view-toggle">
              <button
                className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Status</label>
              <div className="filter-chips">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`filter-chip ${filterStatus === s ? 'filter-chip--active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Ward</label>
              <div className="filter-chips">
                {wards.map((w) => (
                  <button
                    key={w}
                    onClick={() => setFilterWard(w)}
                    className={`filter-chip ${filterWard === w ? 'filter-chip--active' : ''}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Count summary */}
        <div className="patients-summary">
          <span>Showing <strong>{filtered.length}</strong> of <strong>{mockPatients.length}</strong> patients</span>
          <span className="patients-summary__mode">
            {viewMode === 'grid' ? <><LayoutGrid size={13} /> Grid View</> : <><List size={13} /> List View</>}
          </span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="patients-grid">
            {filtered.map((p) => (
              <PatientCard key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />
            ))}
            {filtered.length === 0 && (
              <div className="patients-empty">No patients match your search.</div>
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="patients-list-view">
            <div className="patients-list-header">
              <span>Patient</span>
              <span>Age / Gender</span>
              <span>Condition</span>
              <span>Ward</span>
              <span>Status</span>
              <span>Vitals</span>
              <span>Doctor</span>
              <span>Blood</span>
            </div>
            {filtered.map((p) => (
              <PatientRow key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />
            ))}
            {filtered.length === 0 && (
              <div className="patients-empty">No patients match your search.</div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPatient && (
        <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </AppLayout>
  );
};

export default Patients;
