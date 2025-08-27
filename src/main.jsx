import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/DashboardLayout';
import Home from './pages/Home';
import User from './pages/admin/User';
import Profile from './pages/admin/Profile';
import PublicComponents from './pages/public/PublicComponents'
import Permissions from './pages/admin/Permissions';
import Login from './pages/Login';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AuthProvider from './features/auth/AuthProvider';
import withPermission from './features/auth/withPermission';
import Forbidden403 from './pages/Forbidden403';

const UserPage = withPermission(User, ['listuser']);
const PermissionsPage = withPermission(Permissions, ['listpermission']);
const ProfilePage = withPermission(Profile, ['listuser']);

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      { path: '/login', Component: Login },
      { path: '/403', Component: Forbidden403 },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: '/',
            Component: Layout,
            children: [
              { path: '', Component: Home },
              { path: 'admin/user', Component: UserPage },
              { path: 'admin/profile', Component: ProfilePage },
              { path: 'admin/permission', Component: PermissionsPage },
            ],
          },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: '/',
            Component: Layout,
            children: [
              { path: '', Component: Home },
              { path: 'public/components', Component: PublicComponents },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
