import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, sessionChecked, loading } = useGrindNextStore();

  if (!sessionChecked || loading) {
    return <LoadingSpinner fullPage label="Loading GrindNEXT..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  return children;
}
