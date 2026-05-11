import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "../components/Register";
import { GeneralContext } from "../context/GeneralContext";

// Mock functions jo context ke andar jaayengi
const mockRegister = jest.fn();
const mockSetUsername = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSetUsertype = jest.fn();

// Har test se pehle mocks reset karein
beforeEach(() => {
  jest.clearAllMocks();
});

// Helper: Register component ko context ke saath render karna
const renderRegister = (overrides = {}) => {
  const contextValue = {
    register: mockRegister,
    setUsername: mockSetUsername,
    setEmail: mockSetEmail,
    setPassword: mockSetPassword,
    setUsertype: mockSetUsertype,
    username: "",
    email: "",
    password: "",
    usertype: "",
    ...overrides,
  };

  return render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <GeneralContext.Provider value={contextValue}>
        <Register setAuthType={jest.fn()} />
      </GeneralContext.Provider>
    </MemoryRouter>
  );
};

describe("Register Component", () => {
  // 1. FORM RENDER HONA CHAHIYE
  it("Should render the register form with all fields", () => {
    renderRegister();

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // Select dropdown
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  // 2. BUTTON DISABLED HONA CHAHIYE JAB FIELDS KHALI HAIN
  it("Should have Sign up button disabled when fields are empty", () => {
    renderRegister();
    const button = screen.getByRole("button", { name: /sign up/i });
    expect(button).toBeDisabled();
  });

  // 3. BUTTON ENABLED HONA CHAHIYE JAB SARE FIELDS BHARE HAIN
  it("Should enable Sign up button when all fields are filled", () => {
    renderRegister({
      username: "testuser",
      email: "test@gmail.com",
      password: "12345",
      usertype: "freelancer",
    });

    const button = screen.getByRole("button", { name: /sign up/i });
    expect(button).toBeEnabled();
  });

  // 4. INPUT CHANGE PAR CONTEXT FUNCTIONS CALL HONE CHAHIYE
  it("Should call setUsername when typing in username field", async () => {
    renderRegister();

    const usernameInput = screen.getByLabelText("Username");
    await userEvent.type(usernameInput, "pooja");

    expect(mockSetUsername).toHaveBeenCalled();
  });

  it("Should call setEmail when typing in email field", async () => {
    renderRegister();

    const emailInput = screen.getByLabelText("Email address");
    await userEvent.type(emailInput, "test@gmail.com");

    expect(mockSetEmail).toHaveBeenCalled();
  });

  it("Should call setPassword when typing in password field", async () => {
    renderRegister();

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "secret");

    expect(mockSetPassword).toHaveBeenCalled();
  });

  // 5. USERTYPE SELECT PAR CHANGE
  it("Should call setUsertype when selecting a user type", async () => {
    renderRegister();

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "freelancer");

    expect(mockSetUsertype).toHaveBeenCalledWith("freelancer");
  });

  // 6. FORM SUBMIT PAR REGISTER FUNCTION CALL HONA CHAHIYE
  it("Should call register() when form is submitted with all fields", async () => {
    mockRegister.mockResolvedValue(); // register async hai

    renderRegister({
      username: "testuser",
      email: "test@gmail.com",
      password: "12345",
      usertype: "freelancer",
    });

    const button = screen.getByRole("button", { name: /sign up/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });

    // Wait for loading to finish and button to re-enable
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign up/i })).toBeEnabled();
    });
  });

  // 7. LOADING STATE CHECK
  it("Should show 'Registering...' text while register is in progress", async () => {
    let resolveRegister;
    mockRegister.mockImplementation(
      () => new Promise((resolve) => { resolveRegister = resolve; })
    );

    renderRegister({
      username: "testuser",
      email: "test@gmail.com",
      password: "12345",
      usertype: "freelancer",
    });

    const button = screen.getByRole("button", { name: /sign up/i });
    await userEvent.click(button);

    expect(screen.getByText(/registering/i)).toBeInTheDocument();

    // Resolve the promise and wait for the loading state to update
    resolveRegister();
    await waitFor(() => {
      expect(screen.queryByText(/registering/i)).not.toBeInTheDocument();
    });
  });

  // 8. LOGIN LINK DIKHNA CHAHIYE
  it("Should show 'Already registered? Login' link", () => {
    renderRegister();
    expect(screen.getByText("Already registered?")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
