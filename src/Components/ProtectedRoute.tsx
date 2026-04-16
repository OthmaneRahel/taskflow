import { Navigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../features/auth/AuthContextType';
import { loginStart, loginSuccess, loginFailure,logout } from '../features/auth/authSlice';
import type { RootState } from '../store';
  
interface Props { children: React.ReactNode; } 
  
export default function ProtectedRoute({ children }: Props) { 
  const location = useLocation(); 

  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  
  if (!user) { 
    return <Navigate to="/login" state={{ from: location.pathname }} replace />; 
  } 
  
  return <>{children}</>; 
}