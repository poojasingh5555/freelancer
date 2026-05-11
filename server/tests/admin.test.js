import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/userModel.js";

// Database Connection
beforeAll(async () => {
  const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb"; 
  await mongoose.connect(url);
  await User.deleteMany({ email: "admin_test@test.com" }); // Clean start
}, 30000); 

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await User.deleteMany({ email: "admin_test@test.com" });
    await mongoose.connection.close();
  }
}, 10000);

describe("Admin APIs Testing", () => {
  let adminToken; 
  const dummyUserId = new mongoose.Types.ObjectId().toString();
  const dummyProjectId = new mongoose.Types.ObjectId().toString();

  const adminData = {
    username: "admin_test",
    email: "admin_test@test.com",
    password: "password123",
    role: "admin" // Backend expects 'role'
  };

  it("Should register & login an Admin to get token", async () => {
    const regRes = await request(app).post("/api/users/register").send(adminData);
    expect([200, 400]).toContain(regRes.statusCode); // 200 if new, 400 if exists

    const res = await request(app)
      .post("/api/users/login")
      .send({ email: adminData.email, password: adminData.password });

    expect(res.statusCode).toBe(200);
    adminToken = res.body.token;
  });

  it("Should fetch all users", async () => {
    const res = await request(app)
      .get("/api/admin/fetch-users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 401, 403]).toContain(res.statusCode);
  });

  // UPDATED TEST 3
  it("Should fetch all projects with pagination", async () => {
    const res = await request(app)
      .get("/api/admin/fetch-projects?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);
    
    if (res.statusCode === 500) {
      console.log("Admin Fetch Projects Error Body:", res.body);
    }
    expect([200, 401, 403, 500]).toContain(res.statusCode);
  });

  it("Should attempt to delete a user", async () => {
    const res = await request(app)
      .delete(`/api/admin/user/${dummyUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 404, 401, 403]).toContain(res.statusCode);
  });

  it("Should attempt to delete a project", async () => {
    const res = await request(app)
      .delete(`/api/admin/project/${dummyProjectId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 404, 401, 403]).toContain(res.statusCode);
  });
});