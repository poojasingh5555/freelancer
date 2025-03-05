import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/MyProjects.css';

const MyProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [filteredProjects, setFilteredProjects] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      console.log('API Response:', response.data);

      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    let updatedProjects = [...projects];

    if (selectedFilter === 'In Progress') {
      updatedProjects = projects.filter((project) => project.status === 'Assigned');
    } else if (selectedFilter === 'Completed') {
      updatedProjects = projects.filter((project) => project.status === 'Completed');
    }

    console.log('Filtered Projects:', updatedProjects);
    setFilteredProjects(updatedProjects);
  }, [projects, selectedFilter]);

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects</h3>
          <select
            className="form-control"
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">Choose project status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <hr />

        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <div
              className="listed-project"
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="listed-project-head">
                <h3>{project.title}</h3>
                <p>{project.postedDate}</p>
              </div>
              <h5>Budget - ₹ {project.budget}</h5>
              <p>{project.description}</p>

              <div className="bids-data">
                <h6>Status - {project.status} </h6>
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
