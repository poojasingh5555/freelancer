import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/MyApplications.css';
import API from "../../config/API";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Backend automatically filters applications for the logged-in freelancer
      const response = await API.get("/api/applications/fetch-applications");
      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // -> Naya Feature: Bid wapas lena (Sirf tab jab status 'Pending' ho)
  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await API.delete(`/api/applications/delete-application/${id}`);
      alert("Application withdrawn successfully.");
      fetchApplications(); // List refresh karein
    } catch (err) {
      alert("Failed to withdraw application.");
    }
  };

  if (loading) return <div className="loader">Loading your bids...</div>;

  return (
    <div className="user-applications-page">
      <h3>My Applications ({applications.length})</h3>

      <div className="user-applications-body">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div className={`user-application status-${application.status.toLowerCase()}`} key={application._id}>
              <div className="user-application-body">
                
                {/* Left Side: Project Context */}
                <div className="user-application-half">
                  <h4>{application.projectId?.title || "Project Title"}</h4>
                  <p className="text-muted">{application.projectId?.description}</p>
                  <div className="skills-container">
                    <h5>Project Requirements</h5>
                    <div className="application-skills">
                      {application.projectId?.skills?.map((skill, index) => (
                        <span className="skill-badge" key={index}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <h6 className="mt-2">Original Budget: ₹{application.projectId?.budget}</h6>
                </div>

                <div className="vertical-line"></div>

                {/* Right Side: Your Bid Details */}
                <div className="user-application-half">
                  <div className="proposal-section">
                    <h5>My Proposal</h5>
                    <p>{application.proposal}</p>
                  </div>
                  
                  <div className="status-section">
                    <h6 className={`status-badge ${application.status.toLowerCase()}`}>
                      Status: <b>{application.status}</b>
                    </h6>
                    <h6>My Bid: <b>₹{application.bidAmount}</b></h6>
                  </div>

                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {/* -> Action Button: Chat logic for Accepted projects */}
                    {application.status === "Accepted" && (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => window.location.href=`/project/${application.projectId?._id}`}
                      >
                        Chat with Client
                      </button>
                    )}

                    {/* -> Action Button: Withdraw bid logic */}
                    {application.status === "Pending" && (
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={() => handleWithdraw(application._id)}
                      >
                        Withdraw Bid
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>You haven't applied to any projects yet.</p>
            <button className="btn btn-primary" onClick={() => window.location.href='/all-projects'}>
              Browse Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;