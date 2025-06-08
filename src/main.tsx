import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import { Outlet, RouterProvider, createHashRouter } from 'react-router-dom';

import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

// const router = createBrowserRouter([
const router = createHashRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
