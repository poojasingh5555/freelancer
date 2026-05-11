import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GeneralContext } from "../context/GeneralContext";

const mockLogout = jest.fn();

afterEach(() => {
  localStorage.clear();
});

// Helper: Navbar ko context ke saath render karna
const renderNavbar = () => {
  return render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <GeneralContext.Provider value={{ logout: mockLogout }}>
        <Navbar />
      </GeneralContext.Provider>
    </MemoryRouter>
  );
};

describe("Navbar Component", () => {
  // 1. LOGGED OUT → NAVBAR NAHI DIKHNA CHAHIYE
  it("Should NOT render Navbar when user is not logged in", () => {
    renderNavbar();
    // Navbar returns null when no usertype
    expect(screen.queryByText("SB Works")).not.toBeInTheDocument();
  });

  // 2. FREELANCER NAVBAR LINKS
  it("Should show freelancer nav options for freelancer role", () => {
    localStorage.setItem("usertype", "freelancer");
    renderNavbar();

    expect(screen.getByText("SB Works")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Browse Projects")).toBeInTheDocument();
    expect(screen.getByText("My Work")).toBeInTheDocument();
    expect(screen.getByText("Bids")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  // 3. CLIENT NAVBAR LINKS
  it("Should show client nav options for client role", () => {
    localStorage.setItem("usertype", "client");
    renderNavbar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Post Project")).toBeInTheDocument();
    expect(screen.getByText("Review Bids")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  // 4. ADMIN NAVBAR LINKS
  it("Should show admin nav options and Admin Mode tag for admin role", () => {
    localStorage.setItem("usertype", "admin");
    renderNavbar();

    expect(screen.getByText("(Admin Mode)")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByText("System Projects")).toBeInTheDocument();
    expect(screen.getByText("All Bids")).toBeInTheDocument();
  });

  // 5. FREELANCER KO CLIENT KE LINKS NAHI DIKHNE CHAHIYE
  it("Should NOT show client options for freelancer user", () => {
    localStorage.setItem("usertype", "freelancer");
    renderNavbar();

    expect(screen.queryByText("Post Project")).not.toBeInTheDocument();
    expect(screen.queryByText("Review Bids")).not.toBeInTheDocument();
  });

  // 6. CLIENT KO FREELANCER KE LINKS NAHI DIKHNE CHAHIYE
  it("Should NOT show freelancer options for client user", () => {
    localStorage.setItem("usertype", "client");
    renderNavbar();

    expect(screen.queryByText("Browse Projects")).not.toBeInTheDocument();
    expect(screen.queryByText("My Work")).not.toBeInTheDocument();
    expect(screen.queryByText("Bids")).not.toBeInTheDocument();
  });

  // 7. LOGOUT BUTTON CLICK
  it("Should call logout function when Logout is clicked", async () => {
    localStorage.setItem("usertype", "freelancer");
    renderNavbar();

    const logoutBtn = screen.getByText("Logout");
    await userEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
