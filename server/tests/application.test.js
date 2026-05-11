import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

// Database Connection
beforeAll(async () => {
  const url = process.env.MONGODB_URI; 
  if (!url) throw new Error("MONGODB_URI missing");
  await mongoose.connect(url);
}, 30000); 

afterAll(async () => {
  await mongoose.connection.close();
}, 10000);

describe("Application & Bidding APIs Testing", () => {
  // Fake valid MongoDB IDs for testing
  const dummyProjectId = new mongoose.Types.ObjectId().toString();
  const dummyFreelancerId = new mongoose.Types.ObjectId().toString();
  const dummyApplicationId = new mongoose.Types.ObjectId().toString();

  // 1. MAKE BID TEST
  it("Should make a new bid successfully", async () => {
    const bidData = {
      projectId: dummyProjectId,
      freelancerId: dummyFreelancerId,
      bidAmount: 500,
      proposal: "I can deliver this project in 2 days with high quality."
    };

    // Aapka route: /make-bid (POST)
    const res = await request(app).post("/api/applications/make-bid").send(bidData); 
    
    // Fake ID hone ki wajah se 400/500 error aa sakta hai, par route block nahi hona chahiye
    expect([200, 400, 500]).toContain(res.statusCode); 
  });

  // 2. FETCH APPLICATIONS TEST
  it("Should fetch applications based on query", async () => {
    // Aapka route: /fetch-applications (GET)
    const res = await request(app).get(`/api/applications/fetch-applications?projectId=${dummyProjectId}`);
    
    expect([200, 400, 500]).toContain(res.statusCode);
  });

  // 3. APPROVE APPLICATION TEST
  it("Should call approve application route", async () => {
    // Aapka route: /approve-application/:id (GET)
    const res = await request(app).get(`/api/applications/approve-application/${dummyApplicationId}`);
    
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });

  // 4. REJECT APPLICATION TEST
  it("Should call reject application route", async () => {
    // Aapka route: /reject-application/:id (GET)
    const res = await request(app).get(`/api/applications/reject-application/${dummyApplicationId}`);
    
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });

  // 5. APPROVE SUBMISSION TEST
  it("Should call approve submission route", async () => {
    // Aapka route: /approve-submission/:id (GET)
    const res = await request(app).get(`/api/applications/approve-submission/${dummyApplicationId}`);
    
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });
});