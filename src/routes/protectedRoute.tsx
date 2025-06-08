import type { ReactElement } from 'react';

import { Navigate } from 'react-router-dom';

import { isAuthenticated } from 'src/sections/auth/auth';


interface Props {
    children: ReactElement;
}

export function ProtectedRoute({ children }: Props) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
