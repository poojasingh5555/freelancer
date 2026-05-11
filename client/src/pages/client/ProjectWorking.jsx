import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { GeneralContext } from "../../context/GeneralContext";
import API from "../../config/API";
import "../../styles/client/ProjectWorking.css";

const ProjectDetails = () => {
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  // Chat scroll ke liye ref
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId) => {
    try {
      setLoading(true);

      const response = await API.get(`/api/projects/fetch-project/${projectId}`);
      setProject(response.data);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmission = async () => {
    if (approving) return;
    try {
      setApproving(true);
      const response = await API.get(`/api/applications/approve-submission/${id}`);
      alert(response.data.message);
      fetchProject(id);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve submission.");
    } finally {
      setApproving(false);
    }
  };

  // Socket Logic
  useEffect(() => {
    if (id && socket) {
      socket.emit("join-chat-room", { projectId: id });

      socket.on("new-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      socket.on("messages-updated", (data) => {
        if (data.chat && data.chat.messages) {
          setMessages(data.chat.messages);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("new-message");
        socket.off("messages-updated");
      }
    };
  }, [id, socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const msgData = {
      projectId: id,
      message: message.trim(),
      // NOTE: Sender details backend token se khud nikaal lega (Privacy)
    };

    socket.emit("new-message", msgData);

    setMessage("");
  };

  if (loading) return <p>Loading project details...</p>;

  return (
    <div className="project-details-container">
      {project && (
        <div className="project-info">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <div className="project-meta">
            <span>Budget: ₹{project.budget}</span>
            <span>Status: {project.status}</span>
            {project.status === "Completed" && (
            <div className="alert alert-info mt-4 p-4" style={{ backgroundColor: "rgba(0, 184, 148, 0.1)", border: "1px solid #00b894", borderRadius: "var(--radius-md)" }}>
              <h4 style={{ color: "#00b894" }}>Project Completed</h4>
              <p className="mb-0">You have approved this project. It is now marked as completed.</p>
            </div>
          )}
        </div>
        </div>
      )}

      <hr />

      <div className="chat-section">
        <h3>Project Discussion</h3>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.senderId === localStorage.getItem('userId') ? "own" : "other"}`}>
              <strong>{msg.senderName || "User"}: </strong>
              <span>{msg.text || msg.message}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input mt-2">
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button className="btn btn-primary mt-2" onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* Submission Review Section */}
      {project && project.submission && project.status === 'Assigned' && (
        <div className="submission-review-card mt-4 p-4" style={{ backgroundColor: "#1e1e2f", border: "1px solid #6c5ce7", borderRadius: "12px" }}>
          <h3 style={{ color: "#6c5ce7" }}>Work Submitted for Review</h3>
          <div className="mt-3">
            <p><strong>Project Link:</strong> <a href={project.projectLink} target="_blank" rel="noreferrer" style={{ color: "#00d2d3" }}>{project.projectLink}</a></p>
            <p className="mt-2"><strong>Submission Notes:</strong> {project.submissionDescription}</p>
          </div>
          <button 
            className="btn btn-success w-100 mt-4 py-2" 
            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
            onClick={handleApproveSubmission}
            disabled={approving}
          >
            {approving ? "Processing Approval..." : "Approve & Mark Completed"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;