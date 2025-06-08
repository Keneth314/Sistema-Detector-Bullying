import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet , Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { isAuthenticated } from 'src/sections/auth/auth';

import { PublicRoute } from './publicRoute';
import { ProtectedRoute } from './protectedRoute';



// ----------------------------------------------------------------------
// Definir rutas con Lazy Loading

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={renderFallback()}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: isAuthenticated() ? (
          <Navigate to="../dashboard" replace />
        ) : (
          <AuthLayout>
            <SignInPage />
          </AuthLayout>
        ),
      },

      { path: 'usuario', element: <ProtectedRoute><UserPage /></ProtectedRoute> },
      { path: 'productos', element: <ProtectedRoute><ProductsPage /></ProtectedRoute> },
      { path: 'blog', element: <ProtectedRoute><BlogPage /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute> },
      { path: '*', element: <Page404 /> },
    ],
  },

  // Rutas públicas
  {
    path: 'login',
    element: (
      <PublicRoute>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },
  {
    path: 'sign-in',
    element: (
      <PublicRoute>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
