# HealthIQ — B2B Healthcare Operations Platform

A production-grade B2B healthcare UI built with React + TypeScript for the RAGA.AI Frontend Developer Assignment.

![HealthIQ](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite) ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)

---

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/healthiq-app.git
cd healthiq-app
npm install
npm run dev
# Open http://localhost:5173 → click "Quick Access" for instant demo
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core framework with strict typing |
| Vite 6 | Build tool and dev server |
| React Router v6 | Client-side routing with protected routes |
| Zustand | Lightweight state management |
| Firebase Auth | Email/Password + Google OAuth |
| Recharts | Data visualization (Area, Bar, Pie charts) |
| Service Worker | Caching strategy + push notifications |
| Lucide React | Icon system |
| React Hot Toast | Toast notifications |
| Date-fns | Date formatting utilities |

---

## ✅ Assignment Requirements

- [x] **React + TypeScript** — Strict TS throughout, verbatimModuleSyntax compliant
- [x] **Firebase Authentication** — Email/Password + Google OAuth + graceful demo fallback
- [x] **Service Worker** — Cache-first strategy, push notification listener, permission prompt
- [x] **Login Page** — Animated split-screen, quick demo access, HIPAA compliance note
- [x] **Home / Dashboard** — Live KPI cards, area chart, ward occupancy, recent patients
- [x] **Analytics Page** — Revenue, admissions/discharges, conditions, gender, insurance
- [x] **Patient Details Page:**
  - [x] Grid View (card-based with vitals chips)
  - [x] List View (table with all fields)
  - [x] View toggle button
  - [x] Real-time search by name / ID / condition / doctor
  - [x] Filter by status (Stable, Critical, Recovering, Discharged)
  - [x] Filter by ward (Cardiology, Neurology, etc.)
  - [x] Click-through detail modal with full patient info

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx        # Layout shell (sidebar + topbar + main)
│   ├── Sidebar.tsx          # Collapsible navigation with user info
│   ├── Topbar.tsx           # Search bar + notification bell + date
│   └── ProtectedRoute.tsx   # Auth guard wrapper
├── pages/
│   ├── Login.tsx            # Split-screen login with demo mode
│   ├── Dashboard.tsx        # KPI grid, charts, ward bars, alerts
│   ├── Analytics.tsx        # Multi-chart analytics with range filter
│   └── Patients.tsx         # Grid/List toggle + modal detail view
├── store/
│   └── index.ts             # useAuthStore / useNotificationStore / useUIStore
├── hooks/
│   └── useServiceWorker.ts  # SW registration + notification permission
├── data/
│   └── mockData.ts          # 8 patients, 7 months analytics, 4 notifications
├── types/
│   └── index.ts             # Patient, User, AnalyticsData, Notification types
└── firebase.ts              # Firebase config + auth helpers
public/
├── sw.js                    # Service Worker (cache + push)
├── manifest.json            # PWA manifest
├── _redirects               # Netlify SPA routing
└── vercel.json              # Vercel SPA routing
```

---

## 🔧 Firebase Setup

The app works in **Demo Mode** without any Firebase config.

To enable real authentication:

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create project
2. Authentication → Sign-in method → Enable **Email/Password** and **Google**
3. Replace the config in `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Create a test user: Firebase Console → Authentication → Users → Add user

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
npm install -g vercel
vercel --prod
```
Or connect GitHub repo at [vercel.com/new](https://vercel.com/new).

### Netlify
```bash
npm run build
# Option 1: Drag the dist/ folder to netlify.com/drop
# Option 2: CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🎨 Design Decisions

- **Color palette**: Deep navy (#080c14) with cyan accent (#06b6d4) — clinical, trustworthy
- **Typography**: Syne (display/headings) + DM Sans (body) — modern, legible
- **Sidebar**: Collapsible to icon-only mode for more content space
- **Status colors**: Green=Stable, Red=Critical, Amber=Recovering, Gray=Discharged
- **Responsive**: Adapts from 4-column grid → 2-column → 1-column

---

## 💡 Key Technical Highlights

### Zustand State Management
Three focused stores with zero prop drilling:
```typescript
useAuthStore()          // { user, setUser, loading }
useNotificationStore()  // { notifications, addNotification, markRead, unreadCount }
useUIStore()            // { sidebarOpen, toggleSidebar }
```

### Service Worker Flow
1. Registers `public/sw.js` on app mount via `useServiceWorker` hook
2. Requests notification permission from browser
3. Caches all static assets with cache-first strategy
4. Listens for push events and shows native notifications
5. Simulates a live patient alert notification after 30 seconds (demo)

### Protected Routes with Auth Fallback
```typescript
// Firebase auth + mock user support
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) setUser(firebaseUser);
  else if (user?.uid === 'demo-user') { /* keep mock */ }
  else setUser(null);
});
```

---

## 📊 Pages at a Glance

| Page | Route | Key Components |
|---|---|---|
| Login | `/login` | Animated orbs, split layout, demo access, Google OAuth |
| Dashboard | `/dashboard` | 4 KPI cards, AreaChart, ward bars, patient feed, alert list |
| Analytics | `/analytics` | 4 KPI strip, AreaChart, BarChart, 2× PieChart, horizontal BarChart |
| Patients | `/patients` | Toolbar, filter panel, Grid/List toggle, 8 patients, detail modal |

---

*Built for the RAGA.AI Frontend Developer (2–3 Years) Assignment.*
