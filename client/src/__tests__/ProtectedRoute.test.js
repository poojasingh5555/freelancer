import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Helper: ProtectedRoute ko render karne ke liye wrapper
const renderWithRouter = (allowedRoles, initialRoute = "/protected") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <h1>Dashboard Content</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/authenticate" element={<h1>Login Page</h1>} />
        <Route path="/" element={<h1>Landing Page</h1>} />
      </Routes>
    </MemoryRouter>
  );
};

// Har test ke baad localStorage clear karein
afterEach(() => {
  localStorage.clear();
});

describe("ProtectedRoute Component", () => {
  // 1. TOKEN NAHI HAI → LOGIN PAGE PAR REDIRECT
  it("Should redirect to /authenticate when no token exists", () => {
    renderWithRouter(["Freelancer"]);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  // 2. TOKEN HAI + CORRECT ROLE → DASHBOARD DIKHAYE
  it("Should render children when token and correct role exist", () => {
    localStorage.setItem("token", "fake-token-123");
    localStorage.setItem("usertype", "freelancer");

    renderWithRouter(["Freelancer"]);
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  // 3. TOKEN HAI + WRONG ROLE → LANDING PAGE PAR REDIRECT
  it("Should redirect to / when role does not match", () => {
    localStorage.setItem("token", "fake-token-123");
    localStorage.setItem("usertype", "client");

    renderWithRouter(["Freelancer"]);
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
  });

  // 4. CASE-INSENSITIVE ROLE CHECK
  it("Should match roles case-insensitively (freelancer vs Freelancer)", () => {
    localStorage.setItem("token", "fake-token-123");
    localStorage.setItem("usertype", "freelancer"); // lowercase

    renderWithRouter(["Freelancer"]); // uppercase
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  // 5. ADMIN ROLE CHECK
  it("Should allow Admin role access to admin routes", () => {
    localStorage.setItem("token", "admin-token");
    localStorage.setItem("usertype", "admin");

    renderWithRouter(["Admin"]);
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  // 6. CLIENT ROLE CHECK
  it("Should allow Client role access", () => {
    localStorage.setItem("token", "client-token");
    localStorage.setItem("usertype", "client");

    renderWithRouter(["Client"]);
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  // 7. NO ALLOWED ROLES PASSED → SIRF TOKEN CHECK
  it("Should render children when no allowedRoles are specified (only token check)", () => {
    localStorage.setItem("token", "any-token");
    localStorage.setItem("usertype", "freelancer");

    renderWithRouter(undefined);
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });
});
