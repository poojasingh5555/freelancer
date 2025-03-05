import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();

  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params['id']);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
    fetchChats();
  }, [params['id']]);

  useEffect(() => {
    socket.on("message-from-user", () => {
      fetchChats();
    });

    return () => {
      socket.off("message-from-user");
    };
  }, [socket]);

  const joinSocketRoom = async () => {
    socket.emit("join-chat-room", { projectId: params['id'], freelancerId });
  };

  const fetchProject = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
    } catch (err) {
      console.error("Error fetching project:", err.response?.data || err.message);
    }
  };

  const handleBidding = async () => {
    if (!clientId || !freelancerId || !projectId || bidAmount <= 0 || !proposal || !estimatedTime) {
      alert("Please fill all fields properly.");
      return;
    }

    try {
      await axios.post("http://localhost:6001/make-bid", {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount: Number(bidAmount),
        estimatedTime: Number(estimatedTime)
      });

      setProposal('');
      setBidAmount(0);
      setEstimatedTime('');
      alert("Bidding successful!");
    } catch (err) {
      alert("Bidding failed! Try again.");
      console.error("Bidding error:", err.response?.data || err.message);
    }
  };

  const handleProjectSubmission = async () => {
    if (!clientId || !freelancerId || !projectId || !projectLink || !manualLink || !submissionDescription) {
      alert("Please fill all fields properly.");
      return;
    }

    try {
      await axios.post("http://localhost:6001/submit-project", {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription
      });

      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      alert("Submission successful!");
    } catch (err) {
      alert("Submission failed! Try again.");
      console.error("Submission error:", err.response?.data || err.message);
    }
  };

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    socket.emit("new-message", {
      projectId: params['id'],
      senderId: freelancerId,
      message,
      time: new Date().toISOString()
    });

    setMessage("");
    fetchChats();
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`);
      setChats(response.data);
    } catch (err) {
      console.error("Error fetching chats:", err.response?.data || err.message);
    }
  };

  return (
    <>
      {project && (
        <div className="project-data-page">
          <div className="project-data-container">
            <div className="project-data">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span>
                <h5>Required skills</h5>
                <div className="required-skills">
                  {project.skills.map((skill) => (
                    <p key={skill}>{skill}</p>
                  ))}
                </div>
              </span>
              <span>
                <h5>Budget</h5>
                <h6>&#8377; {project.budget}</h6>
              </span>
            </div>

            {project.status === "Available" && (
              <div className="project-form-body">
                <h4>Send proposal</h4>
                <div className="form-floating">
                  <input type="number" className="form-control mb-3" placeholder="Budget"
                    value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                  <label>Budget</label>
                </div>
                <div className="form-floating">
                  <input type="number" className="form-control mb-3" placeholder="Estimated time (days)"
                    value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
                  <label>Estimated time (days)</label>
                </div>
                <div className="form-floating">
                  <textarea className="form-control mb-3" placeholder="Describe your proposal"
                    value={proposal} onChange={(e) => setProposal(e.target.value)} />
                  <label>Describe your proposal</label>
                </div>
                {!project.bids.includes(freelancerId) ? (
                  <button className='btn btn-success' onClick={handleBidding}>Post Bid</button>
                ) : (
                  <button className='btn btn-primary' disabled>Already bidded</button>
                )}
              </div>
            )}

            {project.freelancerId === freelancerId && (
              <div className="project-form-body">
                <h4>Submit the project</h4>
                <div className="form-floating">
                  <input type="text" className="form-control mb-3" placeholder="Project link"
                    value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
                  <label>Project link</label>
                </div>
                <div className="form-floating">
                  <input type="text" className="form-control mb-3" placeholder="Manual link"
                    value={manualLink} onChange={(e) => setManualLink(e.target.value)} />
                  <label>Manual link</label>
                </div>
                <div className="form-floating">
                  <textarea className="form-control mb-3" placeholder="Describe your work"
                    value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} />
                  <label>Describe your work</label>
                </div>
                <button className="btn btn-success" onClick={handleProjectSubmission}>Submit project</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectData;
