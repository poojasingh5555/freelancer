import express from "express"

import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db.js";
import SocketHandler from "./SocketHandler.js";
import userRoutes from "./routes/userRoute.js";
import applicationRoutes from "./routes/applicationRoute.js";
import freelancerRoutes from "./routes/freelancerRoute.js";
import projectRoutes from "./routes/projectRoute.js";
import adminRoutes from "./routes/adminRoute.js"
import { socketAuthMiddleware } from './middleware/socketMiddleware.js';
const app = express();

const PORT = process.env.PORT || 6001;


app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes)

io.use(socketAuthMiddleware);//authentication

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  try {
    SocketHandler(socket);//wo jagah jahan connection ke saath kya karna hai
  } catch (err) {
    console.error("Socket error:", err);
  }
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

// Is function ko sirf tabhi chalayein jab hum TEST mode mein NA HO
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
export default app;


