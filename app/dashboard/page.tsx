import { deleteProject } from "../actions/projects";

interface Project { 
  id: string; 
  name: string; 
  color: string; 
} 
  
export default async function DashboardPage() { 
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/projects`, { 
    // cache: 'no-store'
  }); 
  const projects: Project[] = await res.json(); 
  
  return ( 
    <div style={{ padding: '2rem' }}> 
      <h1>Dashboard</h1> 
      <p>{projects.length} projets</p> 
      <ul> 
        {projects.map(p => ( 
          <li key={p.id} style={{ marginBottom: 8 }}> 
            <span style={{ 
              display: 'inline-block', width: 12, height: 12, 
              borderRadius: '50%', background: p.color, marginRight: 8 
            }} /> 
            <a href={`/projects/${p.id}`}>{p.name}</a>
            <form action={deleteProject} style={{ display: 'inline' }}> 
              <input type="hidden" name="id" value={p.id} /> 
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}> 🗑 </button> 
            </form>  
          </li> 
        ))} 
      </ul> 
    </div> 
  ); 
} 