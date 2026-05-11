import React, { useEffect, useState } from 'react'
import '../../styles/client/client.css'
import { useNavigate } from 'react-router-dom'
import API from "../../config/API";

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Admin controller pagination use kar raha hai, isliye limit badha kar mangwa sakte hain
      const response = await API.get('api/projects/fetch-projects?limit=1000');
      
      // Filter sirf wahi projects jo is logged-in client ke hain
      const userId = localStorage.getItem('userId');
      
      // Controller ab object bhej raha hai: { projects: [...] }
      const allProjects = response.data.projects || [];
      // clientId populated ho sakta hai (object) ya raw string bhi ho sakta hai
      const clientPros = allProjects.filter(pro => {
        const cid = pro.clientId?._id || pro.clientId;
        return String(cid) === String(userId);
      });
      
      setProjects(clientPros);
      setDisplayProjects([...clientPros].reverse());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (status) => {
    setSelectedFilter(status); // selectedFilter state add karni hogi
    if (status === "") {
      setDisplayProjects([...projects].reverse());
    } else {
      const filtered = projects.filter((project) => {
        if (status === "Un Assigned") return project.status === "Available";
        if (status === "In Progress") return project.status === "Assigned" && !project.submission;
        if (status === "Review") return project.status === "Assigned" && project.submission;
        if (status === "Completed") return project.status === "Completed";
        return true;
      });
      setDisplayProjects(filtered.reverse());
    }
  }

  if (loading) return <div className="loader">Loading your projects...</div>;

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects ({projects.length})</h3>
          <select 
            className='form-control' 
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Projects</option>
            <option value="Un Assigned">Un Assigned (Available)</option>
            <option value="In Progress">In Progress (Active)</option>
            <option value="Review">Needs Review (Submitted)</option>
            <option value="Completed">Completed</option>
          </select>

        </div>
        <hr />

        {displayProjects.length > 0 ? (
          displayProjects.map((project) => (
            <div 
              className="listed-project" 
              key={project._id} 
              onClick={() => navigate(`/client-project/${project._id}`)}
            >
              <div className='listed-project-head'>
                <h3>{project.title}</h3>
                <p>{new Date(project.postedDate).toLocaleDateString()}</p>
              </div>
              <h5>Budget - ₹ {project.budget}</h5>
              <p className="project-desc">{project.description}</p>
    
              <div className="project-footer">
                <span className={`status-badge ${project.status.toLowerCase()} ${project.submission && project.status === 'Assigned' ? 'review-needed' : ''}`}>
                  {project.status === 'Assigned' 
                    ? (project.submission ? 'Work Submitted (Review Now)' : 'In Progress') 
                    : project.status}
                </span>
                {/* Bids count sirf 'Available' projects ke liye relevant hai */}
                {project.status === 'Available' && project.bids && <span>{project.bids.length} Bids received</span>}
              </div>
              <hr />
            </div>
          ))
        ) : (
          <div className="no-projects text-center mt-5">
            <p>{selectedFilter ? `No projects found for "${selectedFilter}" status.` : "Aapne abhi tak koi project post nahi kiya hai."}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Client;