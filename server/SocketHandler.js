import Chat from "./models/chatModel.js";
import Project from "./models/projectModel.js";
import { v4 as uuid } from "uuid";

const SocketHandler = (socket) => {
// socket user connection hai
//user ko room me add karna
  const joinRoomAndLoadChat = async (projectId) => {
    await socket.join(projectId);

    const chat = await Chat.findOneAndUpdate(
      { _id: projectId },
      { $setOnInsert: { messages: [] } },
      { upsert: true, new: true }
    );

    socket.emit("messages-updated", { chat });
    socket.to(projectId).emit("user-joined-room",{ userId: socket.userId });
  };
 // freelancer 
  socket.on("join-chat-room", async ({ projectId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return;
      
      const userId = socket.userId; 
      const userRole = socket.userRole;
      // Authorization Check
      const isFreelancer = project.freelancerId?.toString() === userId; 
      const isClient = project.clientId?.toString() === userId; 
      if (isFreelancer || isClient || userRole === "admin") { // <--- UPDATE: Access control logic
        await joinRoomAndLoadChat(projectId);
      } else {
        console.warn(`Unauthorized access attempt by ${userId}`);
      }
    } catch (error) {
      console.error("Error joining freelancer room:", error);
    }
  });

  

  
  // FETCH LATEST MESSAGES

 socket.on("update-messages", async ({ projectId }) => {
    try {
      const chat = await Chat.findById(projectId);
      if (chat) {
        socket.emit("messages-updated", { chat });
      }
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  });

  
  // SEND NEW MESSAGE
 
  socket.on("new-message", async ({ projectId,  message, time }) => {
    try {
       const senderId = socket.userId; //  secure

    if (!message || message.trim() === "") return;
      const project = await Project.findById(projectId);
      if (!project) return;

      //  Authorization check
      const isFreelancer =
        project.freelancerId?.toString() === senderId;

      const isClient =
        project.clientId?.toString() === senderId;

      if (!isFreelancer && !isClient) return;

      const newMessage = {
        text: message.trim(),
        senderId,
        senderName: socket.username || "User",
        createdAt: new Date(),
      };

      //  Save message
      await Chat.findOneAndUpdate(
        { _id: projectId },
        { $push: { messages: newMessage } },//naya message niche add karna
        { upsert: true }
      );

      //  Send only new message (optimized)
      socket.emit("new-message", newMessage);// sender ke liye
      socket.to(projectId).emit("new-message", newMessage);// others in group

    } catch (error) {
      console.error("Error adding new message:", error);
    }
  });

  // DISCONNECT
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};

export default SocketHandler;