import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/MyProjects.css';
import API from "../../config/API"; // -> API instance use karein

const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
     
      const response = await API.get('/api/projects/fetch-my-assigned-projects');
      
      if (Array.isArray(response.data)) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      }
    } catch (err) {
      console.error('Error fetching my projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let updatedProjects = [...projects];

    if (selectedFilter === 'In Progress') {
      updatedProjects = projects.filter((project) => project.status === 'Assigned');
    } else if (selectedFilter === 'Completed') {
      updatedProjects = projects.filter((project) => project.status === 'Completed');
    }

    setFilteredProjects(updatedProjects);
  }, [projects, selectedFilter]);

  if (loading) return <div className="loader">Loading your projects...</div>;

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My {selectedFilter || 'Assigned'} Projects ({filteredProjects.length})</h3>
          <select
            className="form-control w-25"
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="In Progress">In Progress (Assigned)</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <hr />

        {filteredProjects.length === 0 ? (
          <div className="no-data text-center mt-5">
            <p>No active or completed projects found.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              className={`listed-project status-border-${project.status.toLowerCase()}`}
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="listed-project-head">
                <h3>{project.title}</h3>
                {/* -> Date formatting behtar banayi */}
                <p>{new Date(project.postedDate).toLocaleDateString()}</p>
              </div>
              
              <div className="project-brief">
                <h5>Budget: ₹ {project.budget}</h5>
                <p className="description-text">{project.description}</p>
              </div>

              <div className="bids-data d-flex justify-content-between align-items-center">
                
                <span className={`badge-status ${project.status.toLowerCase()}`}>
                  {project.status === 'Assigned' 
                    ? (project.submission ? 'Under Review' : 'In Progress') 
                    : project.status}
                </span>
                
                {/* -> Communication ka hint */}
                <button className="btn btn-sm btn-link text-decoration-none">
                  Open Project Workspace & Chat →
                </button>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProjects;