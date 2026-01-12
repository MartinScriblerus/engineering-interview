import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { History } from '../components/history-dashboard/HistoryDashboard';
import { ProfileSelection } from '../components/profile-selection/ProfileSelection';
// lazy-load named export TeamSelection
const TeamSelection = React.lazy(() =>
  import('../components/team-selection/TeamSelection').then((mod) => ({ default: (mod as any).TeamSelection }))
);
import { Home } from '../components/home/Home';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/history', element: <History /> },
  { path: '/profiles', element: <ProfileSelection /> },
  { path: '/teams', element: <React.Suspense fallback={<div>Loading…</div>}><TeamSelection /></React.Suspense> }
]);