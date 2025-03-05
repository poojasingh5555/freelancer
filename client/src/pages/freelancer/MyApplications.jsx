import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/MyApplications.css';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      console.log("Fetched applications:", response.data);
  
      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]); 
    }
  };

  return (
    <div className="user-applications-page">
      <h3>My Applications</h3>

      <div className="user-applications-body">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div className="user-application" key={application._id}>
              <div className="user-application-body">
                <div className="user-application-half">
                  <h4>{application.title}</h4>
                  <p>{application.description}</p>
                  <span>
                    <h5>Skills</h5>
                    <div className="application-skills">
                      {application.requiredSkills?.map((skill, index) => (
                        <p key={index}>{skill}</p>
                      )) || <p>No skills listed</p>}
                    </div>
                  </span>
                  <h6>Budget - &#8377; {application.budget}</h6>
                </div>

                <div className="vertical-line"></div>

                <div className="user-application-half">
                  <span>
                    <h5>Proposal</h5>
                    <p>{application.proposal}</p>
                  </span>
                  <span>
                    <h5>Freelancer Skills</h5>
                    <div className="application-skills">
                      {application.freelancerSkills?.length > 0 ? (
                        application.freelancerSkills.map((skill, index) => (
                          <p key={index}>{skill}</p>
                        ))
                      ) : (
                        <p>No skills listed</p>
                      )}
                    </div>
                  </span>
                  <h6>Proposed Budget - &#8377; {application.bidAmount}</h6>
                  <h6>Status: <b>{application.status}</b></h6>
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
