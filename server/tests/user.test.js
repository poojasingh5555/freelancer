import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/userModel.js";
import Freelancer from "../models/freelancerModel.js";

beforeAll(async () => {
  const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb"; 
  await mongoose.connect(url);
  await User.deleteMany({ email: "pooja_atlas@test.com" }); // Clean start
}, 30000); 

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await User.deleteMany({ email: "pooja_atlas@test.com" });
    await mongoose.connection.close();
  }
}, 10000);

describe("User Authentication Tests (Signup & Login)", () => {
  let token; // Token yahan sabse upar declare kiya hai

  const userData = {
    username: "pooja_atlas_test",
    email: "pooja_atlas@test.com",
    password: "password123",
    usertype: "freelancer",
    role: "freelancer"
  };

  // 1. SIGNUP
  it("Should register a user successfully", async () => {
    const res = await request(app).post("/api/users/register").send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
  }, 30000); 

  // 2. SIGNUP DUPLICATE CHECK
  it("Should NOT register user with an already existing email", async () => {
    const res = await request(app).post("/api/users/register").send(userData);
    expect(res.statusCode).toBe(400); 
  });

  // 3. LOGIN & SAVE TOKEN
  it("Should login the user successfully", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: userData.email, password: userData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token"); 
    
    token = res.body.token; // Token successfully save ho gaya
  });

  // 4. WRONG PASSWORD
  it("Should NOT login with a wrong password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: userData.email, password: "WrongPassword456" });
    expect(res.statusCode).toBe(400);
  });

  // 5. CHECK FREELANCER PROFILE
  it("Should have created a Freelancer profile in the database", async () => {
    const userInDb = await User.findOne({ email: userData.email });
    const freelancerProfile = await Freelancer.findOne({ userId: userInDb._id });
    expect(freelancerProfile).toBeTruthy(); 
  });

  // 6. PROTECTED ROUTE - NO TOKEN
  it("Should NOT access fetch-chats without token", async () => {
    const dummyChatId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/users/fetch-chats/${dummyChatId}`);
    expect(res.statusCode).toBe(401); 
  });

  // 7. PROTECTED ROUTE - WITH TOKEN
  it("Should allow access to fetch-chats WITH token", async () => {
    const dummyChatId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/users/fetch-chats/${dummyChatId}`)
      .set("Authorization", `Bearer ${token}`); 
    expect(res.statusCode).not.toBe(401); 
  });

});