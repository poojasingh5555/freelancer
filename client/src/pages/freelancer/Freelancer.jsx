import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/freelancer.css';
import { useNavigate } from 'react-router-dom';
import API from "../../config/API";

const Freelancer = () => {
  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false);
  const navigate = useNavigate();
  const [freelancerData, setFreelancerData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      
      const response = await API.get(`/api/freelancers/fetch-freelancer-profile`); 
      const data = response.data;
      
      if (data) {
        setFreelancerData(data);
        setSkills(data.skills || []);
        setDescription(data.description || '');
      
        setUpdateSkills(Array.isArray(data.skills) ? data.skills.join(", ") : "");
        setUpdateDescription(data.description || '');
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const updateUserData = async () => {
    try {
     
      await API.post(`/api/freelancers/update-freelancer`, {
        updateSkills, // String format mein (Backend ise split kar lega)
        description: updateDescription
      });
      
      fetchUserData();
      setIsDataUpdateOpen(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert("Update failed!");
    }
  };



  return (
    <>
      {freelancerData && (
        <div className="freelancer-home">
          {/* Card Section */}
          <div className="home-cards">
            <div className="home-card" onClick={() => navigate('/my-projects')} style={{ cursor: 'pointer' }}>
              <h4>Current projects</h4>
              <p>{freelancerData.currentProjects?.length || 0}</p>
              <button>View projects</button>
            </div>
            <div className="home-card" onClick={() => navigate('/my-projects')} style={{ cursor: 'pointer' }}>
              <h4>Completed projects</h4>
              <p>{freelancerData.completedProjects?.length || 0}</p>
              <button>View projects</button>
            </div>
            <div className="home-card" onClick={() => navigate('/myApplications')} style={{ cursor: 'pointer' }}>
              <h4>Applications</h4>
              <p>{freelancerData.applications?.length || 0}</p>
              <button>View Applications</button>
            </div>
            <div className="home-card funds-card" title="This is your total earning from completed projects.">
              <h4>Available Funds</h4>
              <p>&#8377; {freelancerData.funds || 0}</p>
              <small style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Total Earnings</small>
            </div>
          </div>

          {/* Details Section */}
          <div className="freelancer-details">
            {!isDataUpdateOpen ? (
              <div className="freelancer-details-data">
                <span>
                  <h4>My Skills</h4>
                  <div className="skills">
                    {skills.map((skill) => (
                      <h5 className="skill" key={skill}>{skill}</h5>
                    ))}
                    {skills.length === 0 && <p className="text-muted">No skills added yet.</p>}
                  </div>
                </span>

                <span className="mt-4 d-block">
                  <h4>Description</h4>
                  <p>{description || "Please add your professional summary."}</p>
                </span>

                <button className="btn btn-outline-success mt-3" onClick={() => setIsDataUpdateOpen(true)}>Edit Profile</button>
              </div>
            ) : (
              <div className="freelancer-details-update">
                <span>
                  <label htmlFor="mySkills"><h4>My Skills (comma separated)</h4></label>
                  <input
                    type="text"
                    className="form-control"
                    id="mySkills"
                    placeholder="React, Node, MongoDB"
                    value={updateSkills}
                    onChange={(e) => setUpdateSkills(e.target.value)}
                  />
                </span>

                <span className="mt-3 d-block">
                  <label htmlFor="description-textarea"><h4>Professional Description</h4></label>
                  <textarea
                    className="form-control"
                    id="description-textarea"
                    rows="4"
                    placeholder="Tell clients about your expertise..."
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                  ></textarea>
                </span>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-success" onClick={updateUserData}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setIsDataUpdateOpen(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Freelancer;