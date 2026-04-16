  
import { createContext, useContext, useReducer, type ReactNode } from 'react'; 
import { authReducer, initialState, type AuthState, type AuthAction } from './authReducer'; 

import { useEffect } from 'react';
import { setAuthToken } from '../../api/axios';

interface AuthContextType { 
  state: AuthState; 
  dispatch: React.Dispatch<AuthAction>; 
} 
  
const AuthContext = createContext<AuthContextType | null>(null); 
  
export function AuthProvider({ children }: { children: ReactNode }) { 
  const [state, dispatch] = useReducer(authReducer, initialState); 
  // Dans le AuthProvider, après le useReducer : 
    useEffect(() => { 
      setAuthToken(state.token); 
    }, [state.token]);
  return ( 
    <AuthContext.Provider value={{ state, dispatch }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
} 
  
// Custom hook pour consommer le context 
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { 
  const context = useContext(AuthContext); 
  if (!context) { 
    throw new Error('useAuth doit être utilisé dans un AuthProvider'); 
  } 
  return context; 
} 