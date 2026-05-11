import React, { useContext } from 'react'
import '../styles/navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(GeneralContext);
  
  //  Context ke bajaye localStorage se check karna zyada stable hota hai page refresh par
  const usertype = localStorage.getItem('usertype')?.toLowerCase(); 

  
  if (!usertype) return null;

  return (
    <div className="navbar">
      {/* -> Admin tag visibility update */}
      <h3>SB Works {usertype === 'admin' ? <span style={{fontSize: '12px', color: 'orange'}}>(Admin Mode)</span> : ""}</h3>

      <div className="nav-options">
        
        {/* --- FREELANCER OPTIONS --- */}
        {usertype === 'freelancer' && (
          <>
            <p onClick={() => navigate('/freelancer')}>Dashboard</p>
            <p onClick={() => navigate('/all-projects')}>Browse Projects</p>
            <p onClick={() => navigate('/my-projects')}>My Work</p>
            <p onClick={() => navigate('/myApplications')}>Bids</p>
          </>
        )}

        {/* --- CLIENT OPTIONS --- */}
        {usertype === 'client' && (
          <>
            <p onClick={() => navigate('/client')}>Dashboard</p>
            <p onClick={() => navigate('/new-project')}>Post Project</p>
            <p onClick={() => navigate('/project-applications')}>Review Bids</p>
          </>
        )}

        {/* --- ADMIN OPTIONS (Registration-less) --- */}
        {usertype === 'admin' && (
          <>
            <p onClick={() => navigate('/admin')}>Overview</p>
            <p onClick={() => navigate('/all-users')}>Manage Users</p>
            <p onClick={() => navigate('/admin-projects')}>System Projects</p>
            <p onClick={() => navigate('/admin-applications')}>All Bids</p>
          </>
        )}

        {/* --- LOGOUT --- */}
        <p className="logout-btn" onClick={logout} style={{color: 'red', fontWeight: 'bold'}}>Logout</p>
      </div>
    </div>
  )
}

export default Navbar