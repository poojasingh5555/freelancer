import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from "../../config/API"; 
import { GeneralContext } from '../../context/GeneralContext'; 
import '../../styles/projects/WorkingProject.css';

const WorkingProject = () => {
  const { id } = useParams();
  const { socket } = useContext(GeneralContext); 
  const chatEndRef = useRef(null);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchProjectDetails();
    setupSocket();

    return () => {
      //  Cleanup: Room leave karein aur listeners band karein
      if (socket) {
        socket.off("new-message");
        socket.emit("leave_project", id);
      }
    };
  }, [id, socket]);

  const fetchProjectDetails = async () => {
    try {
      
      const response = await API.get(`/api/projects/fetch-project/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  const setupSocket = () => {
    if (socket) {
      //  Secure Room Join
      socket.emit("join-chat-room", { projectId: id });

      //  Naye messages receive karein
      socket.on("new-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      // -> Purani chat load karein
      socket.on("messages-updated", (data) => {
        setMessages(data.chat.messages);
      });
    }
  };

  //  Auto-scroll logic
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    //  Optimized Event: Sender ki info backend token se nikalega
    socket.emit("new-message", {
      projectId: id,
      message: newMessage.trim()
    });

    setNewMessage("");
  };

  return (
    <div className="working-project-container">
      {project ? (
        <div className="workspace-grid">
          {/* Left Side: Project Info */}
          <div className="project-sidebar">
            <h2>{project.title}</h2>
            <p className="status-badge">{project.status}</p>
            <hr />
            <h5>Project Description</h5>
            <p>{project.description}</p>
            <div className="budget-box">
              <small>Fixed Budget</small>
              <h4>₹{project.budget}</h4>
            </div>
          </div>

          {/* Right Side: Communication Hub */}
          <div className="chat-workspace">
            <div className="chat-header">
              <h4>Project Discussion</h4>
            </div>
            
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`msg-bubble ${msg.senderId === localStorage.getItem('userId') ? 'sent' : 'received'}`}>
                  <small>{msg.senderName}</small>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Discuss project updates..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">Loading Workspace...</div>
      )}
    </div>
  );
};

export default WorkingProject;