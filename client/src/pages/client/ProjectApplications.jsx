import React, { useEffect, useState } from "react";
import "../../styles/client/ClientApplications.css";
import API from "../../config/API";

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Privacy Check: Backend ab seedhe wahi applications bhej raha hai 
      // jo is logged-in Client ke projects ki hain.
      const response = await API.get("/api/applications/fetch-applications");
      
      const clientApps = Array.isArray(response.data) ? response.data : [];

      setApplications(clientApps);
      setDisplayApplications([...clientApps].reverse());

      const uniqueTitles = [...new Set(clientApps.map((app) => app.title || 'Unknown Project'))];
      setProjectTitles(uniqueTitles);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      // Backend automatically 'Accepted' hone par baaki sab ko 'Rejected' kar dega
      await API.get(`/api/applications/${action}-application/${id}`);
      alert(`Application ${action === 'approve' ? 'Approved' : 'Rejected'}!`);
      fetchApplications(); // List refresh karein naye statuses ke liye
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || error.response?.data?.message || "Operation failed!!");
    }
  };

  const handleFilterChange = (value) => {
    if (value === "") {
      setDisplayApplications([...applications].reverse());
    } else {
      setDisplayApplications(applications.filter((app) => app.title === value).reverse());
    }
  };

  if (loading) return <div className="loader">Loading applications...</div>;

  return (
    <div className="client-applications-page">
      <div className="applications-header">
        <h3>Project Applications ({applications.length})</h3>
        
        {projectTitles.length > 0 && (
          <select className="form-control" onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="">Filter by Project</option>
            {projectTitles.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        )}
      </div>

      <div className="client-applications-body">
        {displayApplications.length > 0 ? (
          displayApplications.map((application) => (
            <div className="client-application" key={application._id}>
              <div className="client-application-body">
                
                {/* Left: Project Context */}
                <div className="client-application-half">
                  <h4>{application.title}</h4>
                  <p className="description-text">{application.description}</p>
                  <div className="skill-tags">
                    {application.requiredSkills?.map((skill) => (
                      <span className="skill-badge" key={skill}>{skill}</span>
                    ))}
                  </div>
                  <h6 className="mt-3 text-muted">Budget: ₹{application.budget}</h6>
                </div>

                <div className="vertical-line"></div>

                {/* Right: Freelancer's Bid */}
                <div className="client-application-half">
                  <h5>Freelancer: {application.freelancerName}</h5>
                  <p><strong>Proposal:</strong> {application.proposal}</p>
                  
                  <div className="skill-tags">
                    {application.freelancerSkills?.map((skill) => (
                      <span className="skill-badge freelancer" key={skill}>{skill}</span>
                    ))}
                  </div>
                  
                  <h6 className="mt-2">Proposed Amount: <span className="text-success">₹{application.bidAmount}</span></h6>

                  <div className="approve-btns">
                    {application.status === "Pending" ? (
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-success" onClick={() => handleStatusUpdate(application._id, 'approve')}>
                          Approve
                        </button>
                        <button className="btn btn-danger" onClick={() => handleStatusUpdate(application._id, 'reject')}>
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className={`status-container ${application.status.toLowerCase()}`}>
                         Status: <strong>{application.status}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <div className="no-data-card">
            <p>Abhi tak koi application nahi aayi hai.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;