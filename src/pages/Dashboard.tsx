import { useState, useEffect } from 'react'; 
import { useAuth } from '../features/auth/AuthContextType'; 
import api from '../api/axios'; 
//import Header from '../Components/Header'; 
import Sidebar from '../Components/Sidebar'; 
import MainContent from '../Components/MainContent'; 
import ProjectForm from '../Components/ProjectForm'; 
import styles from './Dashboard.module.css'; 
import HeaderMUI from '../Components/HeaderMUI';
import type { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import useProjects from '../hooks/useProjects';   


interface Project { id: string; name: string; color: string; } 
interface Column { id: string; title: string; tasks: string[]; } 
  
export default function Dashboard() { 
  //const { state: authState, dispatch } = useAuth();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [projects, setProjects] = useState<Project[]>([]); 
  const [columns, setColumns] = useState<Column[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [showForm, setShowForm] = useState(false); 
  
  // GET — charger les données au montage 
  useEffect(() => { 
    async function fetchData() { 
      try { 
        const [projRes, colRes] = await Promise.all([ 
          api.get('/projects'), 
          api.get('/columns'), 
        ]); 
        setProjects(projRes.data); 
        setColumns(colRes.data); 
      } catch (e) { console.error(e); } 
      finally { setLoading(false); } 
    } 
    fetchData(); 
  }, []); 
  
  // POST — ajouter un projet 
  async function addProject(name: string, color: string) { 
    const { data } = await api.post('/projects', { name, color }); 
    setProjects(prev => [...prev, data]); 
  } 
  

  const dangerousName = '<img src=x onerror=alert("HACK")>';


  // PUT — renommer un projet 
  // À VOUS D'ÉCRIRE (voir specs ci-dessous) 
  
  // DELETE — supprimer un projet 
  // À VOUS D'ÉCRIRE (voir specs ci-dessous) 
  
  if (loading) return <div className={styles.loading}>Chargement...</div>; 
  

  
  return ( 
    <div className={styles.layout}> 
      <div dangerouslySetInnerHTML={{ __html: dangerousName }} />
      <HeaderMUI 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(p => !p)} 
        userName={user?.name} 
        onLogout={() => dispatch(logout())} 
      /> 
      <div className={styles.body}> 
        <Sidebar projects={projects} isOpen={sidebarOpen} /> 
        <div className={styles.content}> 
          <div className={styles.toolbar}> 
            {!showForm ? ( 
              <button className={styles.addBtn} 
                onClick={() => setShowForm(true)}> 
                + Nouveau projet 
              </button> 
            ) : ( 
              <ProjectForm 
                submitLabel="Créer" 
                onSubmit={(name, color) => { 
                  addProject(name, color); 
                  setShowForm(false); 
                }} 
                onCancel={() => setShowForm(false)} 
              /> 
            )} 
          </div> 
          <MainContent columns={columns} /> 
        </div> 
      </div> 
    </div> 
  ); 
}