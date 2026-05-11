import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; //  Role-based security guard

// Public Pages
import Landing from './pages/Landing';
import Authenticate from './pages/Authenticate';

// Freelancer Pages
import Freelancer from './pages/freelancer/Freelancer';
import AllProjects from './pages/freelancer/AllProjects';
import MyProjects from './pages/freelancer/MyProjects';
import MyApplications from './pages/freelancer/MyApplications';
import ProjectData from './pages/freelancer/ProjectData';

// Client Pages
import Client from './pages/client/Client';
import ProjectApplications from './pages/client/ProjectApplications';
import NewProject from './pages/client/NewProject';
import ProjectWorking from './pages/client/ProjectWorking';

// Admin Pages
import Admin from './pages/admin/Admin';
import AdminProjects from './pages/admin/AdminProjects';
import AllApplications from './pages/admin/AllApplications';
import AllUsers from './pages/admin/AllUsers';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route exact path='/' element={<Landing />} />
        <Route path='/authenticate' element={<Authenticate />} />

        {/* --- FREELANCER ROUTES --- */}
        {/* In routes ko sirf 'Freelancer' role wala user hi dekh sakega */}
        <Route path='/freelancer' element={
          <ProtectedRoute allowedRoles={['Freelancer']}>
            <Freelancer />
          </ProtectedRoute>
        } />
        <Route path='/all-projects' element={<AllProjects />} />
        <Route path='/my-projects' element={<MyProjects />} /> 
        <Route path='/myApplications' element={<MyApplications />} />
        <Route path='/project/:id' element={<ProjectData />} />

        {/* --- CLIENT ROUTES --- */}
        {/* In routes ko sirf 'Client' role wala user hi dekh sakega */}
        <Route path='/client' element={
          <ProtectedRoute allowedRoles={['Client']}>
            <Client />
          </ProtectedRoute>
        } />
        <Route path='/project-applications' element={<ProjectApplications />} />
        <Route path='/new-project' element={<NewProject />} />
        <Route path='/client-project/:id' element={<ProjectWorking />} />

        {/* --- ADMIN ROUTES --- */}
        {/* Admin register nahi kar sakta, isliye ye routes sabse zyada secure hain */}
        <Route path='/admin' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path='/admin-projects' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminProjects />
          </ProtectedRoute>
        } />
        <Route path='/admin-applications' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AllApplications />
          </ProtectedRoute>
        } />
        <Route path='/all-users' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AllUsers />
          </ProtectedRoute>
        } />

        {/* Fallback: Agar koi galat URL daale toh landing page par bhejein */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;