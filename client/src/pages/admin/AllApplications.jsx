import React, { useEffect, useState } from 'react'
import '../../styles/admin/allApplications.css'
import API from "../../config/API";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await API.get("api/applications/fetch-applications");
      setApplications(response.data.reverse());
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- DELETE LOGIC ---
  const handleDeleteApplication = async (id) => {
    if (window.confirm("Kya aap waqai is application ko delete karna chahte hain?")) {
      // Optimistic Update: UI se turant hatane ke liye
      const previousApplications = [...applications];
      setApplications(applications.filter(app => app._id !== id));

      try {
        await API.delete(`api/applications/delete-application/${id}`);
        // Response aane ke baad confirmation
        alert("Application delete ho gayi!");
      } catch (err) {
        console.error("Delete error:", err);
        // Agar fail ho jaye toh purana state wapas le aayein
        setApplications(previousApplications);
        const errorMessage = err.response?.data?.error || err.message || "Delete fail ho gaya.";
        alert(`Error: ${errorMessage}`);
      }
    }
  }

  if (loading) return <div className="loader">Loading Applications...</div>;

  return (
    <div className="user-applications-page">
      <h3>All Applications ({applications.length})</h3>

      <div className="user-applications-body">
        {applications.map((application) => (
          <div className="user-application" key={application._id}>
            <div className="user-application-body">

              {/* Left Side: Project & Client Details */}
              <div className="user-application-half">
                <h4>{application.projectId?.title || "Untitled Project"}</h4>
                <p className="text-muted">{application.projectId?.description?.substring(0, 150)}...</p>
                
                <div className="mt-3">
                  <h5>Client Details</h5>
                  <p className="mb-1"><b>Name:</b> {application.clientId?.username || application.clientName}</p>
                  <p><b>Email:</b> {application.clientId?.email || application.clientEmail}</p>
                </div>

                <h6 className="mt-3">Project Budget - ₹ {application.projectId?.budget}</h6>
              </div>

              <div className="vertical-line"></div>

              {/* Right Side: Freelancer & Proposal Details */}
              <div className="user-application-half">
                <span>
                  <h5>Freelancer's Proposal</h5>
                  <p>{application.proposal}</p>
                </span>
                <div className="freelancer-info mb-3">
                  <h5>Freelancer Details</h5>
                  <p className="mb-1"><b>Name:</b> {application.freelancerId?.username || application.freelancerName}</p>
                  <p><b>Email:</b> {application.freelancerId?.email || application.freelancerEmail}</p>
                </div>
                <h6>Proposed Amount - ₹ {application.bidAmount}</h6>
                <h5><b>Freelancer:</b> {application.freelancerName}</h5>
                <h5><b>Freelancer Email:</b> {application.freelancerEmail}</h5>

                <div className="application-footer-admin">
                  <h6>
                    Status:
                    <b style={application.status === "Accepted" ? { color: "green" } : { color: "orange" }}>
                      {" "}{application.status}
                    </b>
                  </h6>

                  {/* --- DELETE BUTTON --- */}
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDeleteApplication(application._id)}
                  >
                    Delete Application
                  </button>
                </div>
              </div>

            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllApplications;