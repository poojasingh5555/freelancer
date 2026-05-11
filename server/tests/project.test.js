import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Project from "../models/projectModel.js";

// Database Connection
beforeAll(async () => {
  const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb"; 
  await mongoose.connect(url);
}, 30000); 

// Test ke baad kachra saaf karein
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await Project.deleteMany({ clientEmail: "testclient@test.com" });
    await mongoose.connection.close();
  }
}, 10000);

describe("Project APIs Testing", () => {
  let createdProjectId; 
  const dummyClientId = new mongoose.Types.ObjectId().toString();

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

    // UPDATE: Aapka route '/new-project' hai
    const res = await request(app).post("/api/projects/new-project").send(newProjectData); 
    
    expect(res.statusCode).toBe(200);

    const savedProject = await Project.findOne({ clientEmail: "testclient@test.com" });
    expect(savedProject).toBeTruthy();
    expect(savedProject.skills).toHaveLength(3); 
    
    createdProjectId = savedProject._id.toString(); 
  });

  // TEST 2: Project Fetch Karna (ID se)
  it("Should fetch the created project by ID", async () => {
    // UPDATE: Aapka route '/fetch-project/:id' hai
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

    // UPDATE: Aapka route sirf '/project' hai
    const res = await request(app).post("/api/projects/project").send(submissionData);
    expect(res.statusCode).toBe(200);

    const updatedProject = await Project.findById(createdProjectId);
    expect(updatedProject.submission).toBe(true);
    expect(updatedProject.projectLink).toBe("https://github.com/my-react-app");
  });
});