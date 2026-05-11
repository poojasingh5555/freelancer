import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';
import API from "../../config/API";

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();
  const chatEndRef = useRef(null); //   Chat auto-scroll ke liye

  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject(id);
    //  Socket room join logic 
    if (socket) {
      socket.emit("join-chat-room", { projectId: id });


      socket.on("new-message", (newMessage) => {
        setChats((prev) => [...prev, newMessage]);
      });

      socket.on("messages-updated", (data) => {
        setChats(data.chat.messages);
      });
    }

    return () => {
      if (socket) {
        socket.off("new-message");
        socket.off("messages-updated");
      }
    };
  }, [id, socket]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const fetchProject = async (projectId) => {
    try {

      const response = await API.get(`/api/projects/fetch-project/${projectId}`);
      setProject(response.data);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const handleBidding = async () => {

    if (bidAmount <= 0 || !proposal || !estimatedTime) {
      alert("Please fill all fields properly.");
      return;
    }

    try {
      await API.post("/api/applications/make-bid", {
        projectId: id,
        proposal,
        bidAmount: Number(bidAmount),
        estimatedTime: Number(estimatedTime)
      });

      setProposal('');
      setBidAmount(0);
      setEstimatedTime('');
      alert("Bidding successful!");
      fetchProject(id); // -> Refresh UI status
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || "Bidding failed!");
    }
  };

  const handleProjectSubmission = async () => {
    if (!projectLink || !submissionDescription) {
      alert("Please fill all fields properly.");
      return;
    }
    if (submitting) return;

    try {
      setSubmitting(true);
      // -> Secure submission: Backend token se pehchan lega ki assigned freelancer hi submit kar raha hai
      await API.post("/api/projects/submit-work", {
        projectId: id,
        projectLink,
        manualLink,
        submissionDescription
      });

      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      alert("Project submitted successfully!");
      fetchProject(id);
    } catch (err) {
      alert("Submission failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessageSend = () => {
    if (!message.trim() || !socket) return;

    //  Optimized Socket event: SenderId backend nikal lega 
    socket.emit("new-message", {
      projectId: id,
      message: message.trim()
    });

    setMessage("");
  };

  return (
    <div className="project-data-page">
      {project && (
        <div className="project-data-container">
          {/* Left Side: Details */}
          <div className="project-data">
            <h2>{project.title}</h2>
            <p className="desc">{project.description}</p>
            <div className="skills-grid">
              {project.skills.map((skill) => (
                <span className="skill-pill" key={skill}>{skill}</span>
              ))}
            </div>
            <h4 className="mt-3">Budget: ₹{project.budget}</h4>
          </div>

          <hr />

          {/* Right Side: Action Forms */}
          {project.status === "Available" && (
            <div className="action-card">
              <h4>Place Your Bid</h4>
              <input type="number" className="form-control" placeholder="Your Bid Amount"
                value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
              <input type="number" className="form-control mt-2" placeholder="Days to Complete"
                value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
              <textarea className="form-control mt-2" placeholder="Your Proposal"
                value={proposal} onChange={(e) => setProposal(e.target.value)} />
              <button className='btn btn-success w-100 mt-3' onClick={handleBidding}>Submit Proposal</button>
            </div>
          )}

          {/* Assigned Workspace (Chat + Submission) */}
          {project.status === "Assigned" && (
            <div className="workspace">
              <div className="chat-box">
                <h4>Discussion</h4>
                <div className="messages-list">
                  {chats.map((chat, index) => (
                    <div key={index} className={`msg ${chat.senderId === localStorage.getItem('userId') ? 'me' : 'other'}`}>
                      <strong>{chat.senderName}:</strong> {chat.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="d-flex gap-2">
                  <input value={message} onChange={(e) => setMessage(e.target.value)} className="form-control" placeholder="Type..." />
                  <button onClick={handleMessageSend} className="btn btn-primary">Send</button>
                </div>
              </div>

              {project.submission ? (
                <div className="submission-card mt-4 p-4" style={{ backgroundColor: "rgba(108, 92, 231, 0.05)", border: "1px solid rgba(108, 92, 231, 0.2)", borderRadius: "var(--radius-lg)" }}>
                  <h4 style={{ color: "var(--accent-light)", marginBottom: "10px" }}>Work Submitted Successfully!</h4>
                  <p style={{ color: "var(--text-secondary)", margin: 0 }}>Your project submission has been sent to the client. It will move to 'Completed Projects' once the client approves it.</p>
                </div>
              ) : (
                <div className="submission-card mt-4">
                  <h4>Submit Work</h4>
                  <input className="form-control" placeholder="GitHub/Project Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
                  <textarea className="form-control mt-2" placeholder="Work Description" value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} />
                  <button className="btn btn-success w-100 mt-2" onClick={handleProjectSubmission} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Final Work"}
                  </button>
                </div>
              )}
            </div>
          )}

          {project.status === "Completed" && (
            <div className="alert alert-success mt-4 p-4" style={{ backgroundColor: "rgba(0, 206, 201, 0.1)", border: "1px solid var(--accent-green)", borderRadius: "var(--radius-lg)" }}>
              <h4 style={{ color: "var(--accent-green)" }}>Project Completed! 🎉</h4>
              <p className="mb-3 text-white">This project has been successfully completed. The funds have been added to your account balance.</p>
              <div className="p-3 rounded" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                <p className="mb-2"><strong>Submitted Work:</strong> <a href={project.projectLink} target="_blank" rel="noreferrer" style={{ color: "var(--accent-blue)" }}>{project.projectLink}</a></p>
                <p className="mb-0 text-secondary"><strong>Your Description:</strong> {project.submissionDescription}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectData;