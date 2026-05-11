import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/freelancer/AllProjects.css' 
import API from "../../config/API"; 

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]); 
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      
      const response = await API.get('/api/projects/fetch-projects');
      // Backend ab object bhejta hai: { projects: [...], total, page, pages }
      const data = response.data.projects || response.data;
      
      setProjects(data);
      setDisplayProjects([...data].reverse());

      //  Array.map ki jagah Set ka use karein unique skills ke liye (Fast & Clean)
      const skillsSet = new Set();
      data.forEach(project => {
        project.skills.forEach(skill => skillsSet.add(skill));
      });
      setAllSkills(Array.from(skillsSet));

    } catch (err) {
      console.error("Fetch error:", err);
      
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(skill => skill !== value));
    }
  };

  useEffect(() => {
   
    if (categoryFilter.length > 0) {
      const filtered = projects.filter(project => 
        categoryFilter.every(skill => project.skills.includes(skill))
      );
      setDisplayProjects([...filtered].reverse());
    } else {
      setDisplayProjects([...projects].reverse());
    }
  }, [categoryFilter, projects]); //  projects ko dependency mein add karna zaroori hai

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
                  id={skill} //  Unique ID for label
                  onChange={handleCategoryCheckBox} 
                />
                <label className="form-check-label" htmlFor={skill}>{skill}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-list">
        <h3>All projects ({displayprojects.length})</h3>
        <hr />
        {displayprojects.map((project) => (
          <div className="listed-project" key={project._id} onClick={() => navigate(`/project/${project._id}`)}>
            <div className='listed-project-head'>
              <h3>{project.title}</h3>
              <p>{new Date(project.postedDate).toLocaleDateString()}</p>
            </div>
            <h5>Budget ₹ {project.budget}</h5>
            <p className="project-desc">{project.description}</p>
            <div className="skills">
              {project.skills.map((skill) => (
                <h6 key={skill}>{skill}</h6>
              ))}
            </div>

            <div className="bids-data">
              <p>{project.bids?.length || 0} bids</p>
              {/* -> Average calculation optimized */}
              <h6>₹ {project.bids?.length > 0 
                ? (project.bids.reduce((a, b) => a + (b.amount || 0), 0) / project.bids.length).toFixed(2) 
                : 0} (avg bid)</h6>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllProjects;