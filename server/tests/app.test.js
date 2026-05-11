import request from "supertest";
import app from "../app.js"; // Confirm karein ki app.js ka path sahi hai

describe("Initial Test", () => {
  it("Should connect to server and return a response", async () => {
    const res = await request(app).get("/"); 
    // Agar aapka root '/' route set hai toh 200 aayega, warna 404. 
    // Dono ka matlab hai ki server test se connect ho gaya hai.
    console.log("Status Code aanya hai:", res.statusCode);
    expect(res.statusCode).toBeDefined(); 
  });
});