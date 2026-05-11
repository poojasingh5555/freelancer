import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

describe("Project APIs Testing", () => {
  let token;
  let createdProjectId; 
  const dummyClientId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb"; 
    await mongoose.connect(url);
    await User.deleteMany({ email: "project_test@test.com" });

    // Setup User and Token
    const userData = {
      username: "project_test_user",
      email: "project_test@test.com",
      password: "password123",
      role: "client"
    };
    await request(app).post("/api/users/register").send(userData);
    const loginRes = await request(app).post("/api/users/login").send({
      email: userData.email,
      password: userData.password
    });
    token = loginRes.body.token;
  }, 30000);

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({ email: "project_test@test.com" });
      await Project.deleteMany({ clientEmail: "testclient@test.com" });
      await mongoose.connection.close();
    }
  }, 10000);

  // TEST 1: Naya Project Add Karna
  it("Should add a new project successfully", async () => {
    const newProjectData = {
      title: "Build a React App",
      description: "Need a fast frontend with Tailwind",
      budget: "500",
      skills: "React,Node.js,Tailwind", 
      clientId: dummyClientId,
      clientName: "Test Client",
      clientEmail: "testclient@test.com",
    };

    const res = await request(app)
      .post("/api/projects/new-project")
      .set("Authorization", `Bearer ${token}`)
      .send(newProjectData); 
    
    expect(res.statusCode).toBe(200);

    const savedProject = await Project.findOne({ clientEmail: "testclient@test.com" });
    expect(savedProject).toBeTruthy();
    createdProjectId = savedProject._id.toString(); 
  });

  // TEST 2: Project Fetch Karna (ID se)
  it("Should fetch the created project by ID", async () => {
    const res = await request(app).get(`/api/projects/fetch-project/${createdProjectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Build a React App");
  });

  // TEST 3: Project Submit Karna
  it("Should submit the project successfully", async () => {
    const submissionData = {
      projectId: createdProjectId, 
      projectLink: "https://github.com/my-react-app",
      manualLink: "https://drive.google.com/doc",
      submissionDescription: "All requirements met.",
    };

    const res = await request(app)
      .post("/api/projects/submit-work")
      .set("Authorization", `Bearer ${token}`) 
      .send(submissionData);

    expect(res.statusCode).toBe(200); 

    const updatedProject = await Project.findById(createdProjectId);
    expect(updatedProject.submission).toBe(true);
  });
});