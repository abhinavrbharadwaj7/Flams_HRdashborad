// src/routes.js
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CreateUserPage from './pages/CreateUserPage';

export const routes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/bookmarks', element: <BookmarksPage /> },
  { path: '/analytics', element: <AnalyticsPage /> },
  { path: '/create-user', element: <CreateUserPage /> },
];