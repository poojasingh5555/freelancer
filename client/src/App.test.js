import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GeneralContext } from "./context/GeneralContext";
import App from "./App";

// App component ko render karne ke liye context chahiye
const mockContextValue = {
  socket: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  username: "",
  setUsername: jest.fn(),
  email: "",
  setEmail: jest.fn(),
  password: "",
  setPassword: jest.fn(),
  usertype: "",
  setUsertype: jest.fn(),
};

afterEach(() => {
  localStorage.clear();
});

describe("App Component - Routing Tests", () => {
  // 1. LANDING PAGE DEFAULT RENDER
  it("Should render Landing page on / route", () => {
    render(
      <MemoryRouter initialEntries={["/"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <GeneralContext.Provider value={mockContextValue}>
          <App />
        </GeneralContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Empower Your Journey/i)).toBeInTheDocument();
  });

  // 2. UNKNOWN ROUTE → LANDING PAGE PAR REDIRECT
  it("Should redirect unknown routes to landing page", () => {
    render(
      <MemoryRouter initialEntries={["/random-page-xyz"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <GeneralContext.Provider value={mockContextValue}>
          <App />
        </GeneralContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Empower Your Journey/i)).toBeInTheDocument();
  });

  // 3. /FREELANCER WITHOUT TOKEN → REDIRECT TO LOGIN
  it("Should redirect /freelancer to /authenticate when not logged in", () => {
    render(
      <MemoryRouter initialEntries={["/freelancer"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <GeneralContext.Provider value={mockContextValue}>
          <App />
        </GeneralContext.Provider>
      </MemoryRouter>
    );

    // ProtectedRoute should redirect to /authenticate
    const matches = screen.getAllByText(/Register|Login/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  // 4. /ADMIN WITHOUT TOKEN → REDIRECT TO LOGIN
  it("Should redirect /admin to /authenticate when not logged in", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <GeneralContext.Provider value={mockContextValue}>
          <App />
        </GeneralContext.Provider>
      </MemoryRouter>
    );

    const matches = screen.getAllByText(/Register|Login/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
