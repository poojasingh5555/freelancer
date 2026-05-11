import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Freelancer from "../models/freelancerModel.js";
import User from "../models/userModel.js";

beforeAll(async () => {
  const url = process.env.MONGODB_URI; 
  if (!url) throw new Error("MONGODB_URI missing");
  await mongoose.connect(url);
}, 30000); 

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Test data saaf karna
    await User.deleteMany({ email: "freelancer_test@test.com" });
    await Freelancer.deleteMany({ description: "Initial Description" });
    await mongoose.connection.close();
  }
}, 10000);

describe("Freelancer Profile APIs Testing", () => {
  let token;
  let testFreelancerId;
  let testUserId;

  // TEST 1: Setup - User banana aur Token lena (Kyunki update protected hai)
  it("Should setup a freelancer user and get token", async () => {
    const userData = {
      username: "freelancer_test",
      email: "freelancer_test@test.com",
      password: "password123",
      usertype: "freelancer",
      role: "freelancer"
    };

    // 1. Signup
    const signupRes = await request(app).post("/api/users/register").send(userData);
    testUserId = signupRes.body._id;

    // 2. Login to get token
    const loginRes = await request(app).post("/api/users/login").send({
      email: userData.email,
      password: userData.password
    });
    token = loginRes.body.token;

    // 3. Find Freelancer ID (jo signup ke waqt auto-create hua hoga)
    const freelancer = await Freelancer.findOne({ userId: testUserId });
    testFreelancerId = freelancer._id.toString();
  });

  // TEST 2: FETCH FREELANCER
  it("Should fetch freelancer profile by User ID", async () => {
    // Aapka route: /fetch-freelancer/:id
    const res = await request(app).get(`/api/freelancers/fetch-freelancer/${testUserId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userId", testUserId);
  });

  // TEST 3: UPDATE FREELANCER (Protected)
  it("Should update freelancer profile with token", async () => {
    const updateData = {
      freelancerId: testFreelancerId,
      updateSkills: "React,NodeJS,MongoDB",
      description: "Updated professional bio for testing."
    };

    // Aapka route: /update-freelancer (POST)
    const res = await request(app)
      .post("/api/freelancers/update-freelancer")
      .set("Authorization", `Bearer ${token}`) // Token zaroori hai!
      .send(updateData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.skills).toContain("React");
    expect(res.body.description).toBe(updateData.description);
  });

  // TEST 4: SECURITY CHECK (Without Token)
  it("Should NOT update freelancer profile without token", async () => {
    const res = await request(app)
      .post("/api/freelancers/update-freelancer")
      .send({ freelancerId: testFreelancerId, updateSkills: "test", description: "test" });
    
    expect(res.statusCode).toBe(401); // Unauthorized
  });
});