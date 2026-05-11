import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import API from "../../config/API";
import "../../styles/admin/adminDashboard.css"; // New Professional CSS
import { 
  FiUsers, 
  FiBriefcase, 
  FiCheckCircle, 
  FiClipboard, 
  FiRefreshCw 
} from "react-icons/fi"; // Premium Icons

const Admin = () => {
  const navigate = useNavigate();
  
  // Dashboard states
  const [counts, setCounts] = useState({
    projects: 0,
    completed: 0,
    applications: 0,
    users: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, appsRes, usersRes] = await Promise.all([
        API.get("api/projects/fetch-projects?limit=1000"), 
        API.get("api/applications/fetch-applications"),
        API.get("api/users/fetch-users")
      ]);

      const allProjects = projectsRes.data.projects || [];
      const completedCount = allProjects.filter(p => p.status === "Completed").length;

      setCounts({
        projects: projectsRes.data.total || allProjects.length,
        completed: completedCount,
        applications: appsRes.data.length,
        users: usersRes.data.length
      });

    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
      setError("Failed to load dashboard data. Please check your admin privileges.");
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/authenticate');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) return (
    <div className="admin-loading-container">
      <div className="spinner"></div>
      <p>Updating Admin Dashboard...</p>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-text">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with SB Works today.</p>
        </div>
        <button className="refresh-btn" onClick={fetchDashboardStats}>
          <FiRefreshCw className={loading ? "spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {error && <div className="admin-error-alert">{error}</div>}

      <div className="home-cards">
        <StatCard 
          title="Total Users" 
          count={counts.users} 
          description="Registered freelancers and clients"
          btnText="Manage Users"
          icon={<FiUsers />}
          onClick={() => navigate('/all-users')} 
        />
        <StatCard 
          title="Active Projects" 
          count={counts.projects} 
          description="Total projects posted on platform"
          btnText="View Projects"
          icon={<FiBriefcase />}
          onClick={() => navigate('/admin-projects')} 
        />
        <StatCard 
          title="Completed" 
          count={counts.completed} 
          description="Projects successfully delivered"
          btnText="Project History"
          icon={<FiCheckCircle />}
          onClick={() => navigate('/admin-projects')} 
        />
        <StatCard 
          title="Applications" 
          count={counts.applications} 
          description="Total bids and proposals"
          btnText="Review Bids"
          icon={<FiClipboard />}
          onClick={() => navigate('/admin-applications')} 
        />
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, count, description, btnText, icon, onClick }) => (
  <div className="home-card">
    <div className="card-header">
      <h4>{title}</h4>
      <div className="card-icon-wrapper">
        {icon}
      </div>
    </div>
    <div className="count-badge">{count}</div>
    <p className="card-desc">{description}</p>
    <button className="card-action-btn" onClick={onClick}>{btnText}</button>
  </div>
);

export default Admin;