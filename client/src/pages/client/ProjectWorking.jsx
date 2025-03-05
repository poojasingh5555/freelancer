import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:6001");

const ProjectDetails = () => {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("Params received:", params);
    if (params.id) {
      fetchProject(params.id);
    } else {
      console.error("Project ID is missing in the URL params!");
    }
  }, [params.id]);

  const fetchProject = async (id) => {
    console.log("Fetching project with ID:", id);
    if (!id) {
      console.error("Project ID is missing!");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      console.log(response.data);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (projectId) {
      socket.emit("join_project", projectId);
    }
  }, [projectId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      console.log("Disconnecting from socket");
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) {
      console.error("Cannot send empty message");
      return;
    }
    const msgData = { projectId, clientId, message };
    console.log("Sending message via socket:", msgData);
    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div>
      <h2>Project Details</h2>
      {project ? (
        <div>
          <p><strong>Name:</strong> {project.title}</p>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Client ID:</strong> {clientId}</p>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}

      <h3>Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.clientId}:</strong> {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ProjectDetails;