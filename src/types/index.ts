export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
  doctor: string;
  ward: string;
  admittedDate: string;
  insurance: string;
  contact: string;
  avatar: string;
  bloodType: string;
  lastVisit: string;
  nextAppointment: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AnalyticsData {
  month: string;
  admissions: number;
  discharges: number;
  revenue: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'critical';
  timestamp: string;
  read: boolean;
}
