import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import SocketHandler from "./SocketHandler.js";
import userRoutes from "./routes/userRoute.js";
import applicationRoutes from "./routes/applicationRoute.js";
import freelancerRoutes from "./routes/freelancerRoute.js";
import projectRoutes from "./routes/projectRoute.js";

const app = express();

const PORT = process.env.PORT || 6001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(userRoutes);
app.use(applicationRoutes);
app.use(freelancerRoutes);
app.use(projectRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  SocketHandler(socket);
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error(`Error in DB connection:`, e);
  });

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
