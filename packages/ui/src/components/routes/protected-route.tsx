import { Navigate, Outlet } from 'react-router';

interface PrivateRouteProps {
  auth: {
    isAuthenticated: boolean;
  };
}

export const PrivateWrapper = ({ auth: { isAuthenticated } }: PrivateRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export const PublicWrapper = ({ auth: { isAuthenticated } }: PrivateRouteProps) => {
  return isAuthenticated ? <Navigate to="/groups" /> : <Outlet />;
};
