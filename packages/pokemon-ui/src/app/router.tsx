import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { History } from '../components/history-dashboard/HistoryDashboard';
import { ProfileSelection } from '../components/profile-selection/ProfileSelection';
import { TeamSelection } from '../components/team-selection/TeamSelection';
import { Home } from '../components/home/Home';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/history', element: <History /> },
  { path: '/profiles', element: <ProfileSelection /> },
  { path: '/teams', element: <TeamSelection /> },
]);