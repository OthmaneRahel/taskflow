import { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useAuth } from './AuthContextType'; 
import api from '../../api/axios'; 
import styles from './Login.module.css'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { RootState } from '../../store'; 
import { loginStart, loginSuccess, loginFailure } from './authSlice'; 
  
export default function Login() { 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { state } = useAuth(); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const dispatch = useDispatch(); 
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  

  console.log(location.state)
  
  const from = (location.state as any)?.from || '/dashboard'; 
  
  useEffect(() => { 
    if (state.user) navigate(from,{replace : true});  // BUG (pour le replace true pour le navigteur supprime la page de login )
  }, [state.user, navigate, from]); 
  
  async function handleSubmit(e: React.FormEvent) { 
    e.preventDefault(); 
    //dispatch({ type: 'LOGIN_START' }); 
    dispatch(loginStart());
    try { 
      const { data: users } = await api.get(`/users?email=${email}`); 
      if (users.length === 0 || users[0].password !== password) { 
        //dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' }); 
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return; 
      } 
      const { password: _, ...user } = users[0]; 
      //dispatch({ type: 'LOGIN_SUCCESS', payload: user }); 
      const fakeToken = btoa(JSON.stringify({ 
        userId: user.id, 
        email: user.email, 
        role: 'admin', 
        exp: Date.now() + 3600000  // expire dans 1h 
      }));  
      //dispatch({ type: 'LOGIN_SUCCESS', payload: { ...user, token: fakeToken } });
      dispatch(loginSuccess({ user, token: fakeToken }));

    } catch { 
      //dispatch({ type: 'LOGIN_FAILURE', payload: 'Erreur serveur' }); 
      dispatch(loginFailure('Erreur serveur'));
    } 
  } 
  
  return ( 
    <div className={styles.container}> 
      <form className={styles.form} onSubmit={handleSubmit}> 
        <h1 className={styles.title}>TaskFlow</h1> 
        <p className={styles.subtitle}>Connectez-vous pour continuer</p> 
        {state.error && <div className={styles.error}>{state.error}</div>} 
        <input type="email" placeholder="Email" 
          value={email} onChange={e => setEmail(e.target.value)} 
          className={styles.input} required /> 
        <input type="password" placeholder="Mot de passe" 
          value={password} onChange={e => setPassword(e.target.value)} 
          className={styles.input} required /> 
        <button type="submit" className={styles.button} disabled={state.loading}> 
          {state.loading ? 'Connexion...' : 'Se connecter'} 
        </button> 
      </form> 
    </div> 
  ); 
} 
