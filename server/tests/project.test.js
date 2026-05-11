import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

describe("Project APIs Testing", () => {
  let token;
  let createdProjectId; 
  const testEmail = "project_test@test.com";

  beforeAll(async () => {
    const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb"; 
    await mongoose.connect(url);
    await User.deleteMany({ email: testEmail });

    // Setup User and Token
    const userData = {
      username: "project_test_user",
      email: testEmail,
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
      await User.deleteMany({ email: testEmail });
      await Project.deleteMany({ clientEmail: testEmail });
      await mongoose.connection.close();
    }
  }, 10000);

  // TEST 1: Naya Project Add Karna
  it("Should add a new project successfully", async () => {
    const newProjectData = {
      title: "Build a React App",
      description: "Need a fast frontend with Tailwind",
      budget: "500",
      skills: "React,Node.js,Tailwind"
    };

    const res = await request(app)
      .post("/api/projects/new-project")
      .set("Authorization", `Bearer ${token}`)
      .send(newProjectData); 
    
    expect(res.statusCode).toBe(200);

    const savedProject = await Project.findOne({ clientEmail: testEmail });
    expect(savedProject).toBeTruthy();
    createdProjectId = savedProject._id.toString(); 
  });

  // TEST 2: Project Fetch Karna (ID se)
  it("Should fetch the created project by ID", async () => {
    expect(createdProjectId).toBeDefined();
    const res = await request(app).get(`/api/projects/fetch-project/${createdProjectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Build a React App");
  });

  // TEST 3: Project Submit Karna
  it("Should submit the project successfully", async () => {
    expect(createdProjectId).toBeDefined();
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