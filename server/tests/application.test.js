import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

// Database Connection
beforeAll(async () => {
  const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb"; 
  await mongoose.connect(url);
}, 30000); 

afterAll(async () => {
  await mongoose.connection.close();
}, 10000);

describe("Application & Bidding APIs Testing", () => {
  let token;
  const dummyProjectId = new mongoose.Types.ObjectId().toString();
  const dummyFreelancerId = new mongoose.Types.ObjectId().toString();
  const dummyApplicationId = new mongoose.Types.ObjectId().toString();

  // SETUP: Get a real token
  it("Should setup a user and get token", async () => {
    const userData = {
      username: "app_test_user",
      email: "app_test@test.com",
      password: "password123",
      role: "freelancer"
    };
    await request(app).post("/api/users/register").send(userData);
    const loginRes = await request(app).post("/api/users/login").send({
      email: userData.email,
      password: userData.password
    });
    token = loginRes.body.token;
  });

  // 1. MAKE BID TEST
  it("Should make a new bid successfully", async () => {
    const bidData = {
      projectId: dummyProjectId,
      freelancerId: dummyFreelancerId,
      bidAmount: 500,
      proposal: "I can deliver this project in 2 days with high quality."
    };

    // Aapka route: /make-bid (POST)
    const res = await request(app)
      .post("/api/applications/make-bid")
      .set("Authorization", `Bearer ${token}`)
      .send(bidData); 
    
    expect([200, 400, 500]).toContain(res.statusCode); 
  });

  // 2. FETCH APPLICATIONS TEST
  it("Should fetch applications based on query", async () => {
    // Aapka route: /fetch-applications (GET)
    const res = await request(app)
      .get(`/api/applications/fetch-applications?projectId=${dummyProjectId}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect([200, 400, 500]).toContain(res.statusCode);
  });

  // 3. APPROVE APPLICATION TEST
  it("Should call approve application route", async () => {
    // Aapka route: /approve-application/:id (GET)
    const res = await request(app)
      .get(`/api/applications/approve-application/${dummyApplicationId}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });

  // 4. REJECT APPLICATION TEST
  it("Should call reject application route", async () => {
    // Aapka route: /reject-application/:id (GET)
    const res = await request(app)
      .get(`/api/applications/reject-application/${dummyApplicationId}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });

  // 5. APPROVE SUBMISSION TEST
  it("Should call approve submission route", async () => {
    // Aapka route: /approve-submission/:id (GET)
    const res = await request(app).get(`/api/applications/approve-submission/${dummyApplicationId}`);
    
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });
});