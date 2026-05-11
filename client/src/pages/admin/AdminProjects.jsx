import React, { useEffect, useState } from 'react'
import '../../styles/freelancer/AllProjects.css'
import API from "../../config/API"; // Iska use zaroori hai interceptor ke liye

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {

      const response = await API.get('api/projects/fetch-projects');
      // Backend ab object bhejta hai: { projects: [...], total, page, pages }
      const fetchedProjects = response.data.projects || response.data;
      setProjects(fetchedProjects);
      setDisplayProjects([...fetchedProjects].reverse());

      // Skills nikalne ka sahi aur fast tarika
      const uniqueSkills = new Set();
      fetchedProjects.forEach(project => {
        project.skills.forEach(skill => uniqueSkills.add(skill));
      });
      setAllSkills(Array.from(uniqueSkills));

    } catch (err) {
      console.error("Projects fetch failed:", err);

    }
  }

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(skill => skill !== value));
    }
  }

  useEffect(() => {
    if (categoryFilter.length > 0) {
      const filtered = projects.filter(project =>
        categoryFilter.every(skill => project.skills.includes(skill))
      );
      setDisplayProjects([...filtered].reverse());
    } else {
      setDisplayProjects([...projects].reverse());
    }
  }, [categoryFilter, projects]);

  return (
    <div className="all-projects-page">
      <div className="project-filters">
        <h3>Filters</h3>
        <hr />
        <div className="filters">
          <h5>Skills</h5>
          <div className="filter-options">
            {allSkills.map((skill) => (
              <div className="form-check" key={skill}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={skill}
                  onChange={handleCategoryCheckBox}
                />
                <label className="form-check-label">{skill}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-list">
        <h3>All projects ({displayprojects.length})</h3>
        <hr />
        {displayprojects.map((project) => (
          <div className="listed-project" key={project._id}>
            <div className='listed-project-head'>
              <h3>{project.title}</h3>
              <p>{new Date(project.postedDate).toLocaleDateString()}</p>
            </div>
            <h5>Budget: ₹ {project.budget}</h5>
            <h5>Client: {project.clientName} ({project.clientEmail})</h5>
            <p>{project.description}</p>
            <div className="skills">
              {project.skills.map((skill) => (
                <h6 key={skill}>{skill}</h6>
              ))}
            </div>
            <div className="bids-data">
              <p>{project.bids.length} bids</p>
              <h6>Avg Bid: ₹ {project.bids?.length > 0
                ? (project.bids.reduce((a, b) => a + (b.amount || 0), 0) / project.bids.length).toFixed(2)
                : 0}
              </h6>
            </div>
            <h5>Status: <span className={`status-${project.status.toLowerCase()}`}>{project.status}</span></h5>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProjects;