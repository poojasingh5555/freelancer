import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setAuthType }) => {
  // Context se functions nikaale
  const { setEmail, setPassword, login, email, password } = useContext(GeneralContext);
  
  // Local state loading dikhane ke liye
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Loading shuru
    await login();
    setIsLoggingIn(false); // Loading khatam
  }

  return (
    // Form par onSubmit lagaya hai
    <form className="authForm" onSubmit={handleLogin}>
      <h2>Login</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="email" 
          className="form-control" 
          id="floatingInput" 
          placeholder=" "
          required
          onChange={(e) => setEmail(e.target.value)} 
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="password" 
          className="form-control" 
          id="floatingPassword" 
          placeholder=" "
          required
          onChange={(e) => setPassword(e.target.value)} 
        /> 
        <label htmlFor="floatingPassword">Password</label>
      </div>

      {/* Button disabled rahega agar fields khali hain ya login ho raha hai */}
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoggingIn || !email || !password}
      >
        {isLoggingIn ? "Logging in..." : "Sign in"}
      </button>

      <p>Not registered? <span onClick={() => setAuthType('register')} style={{cursor: 'pointer', color: 'blue'}}>Register</span></p>
    </form>
  )
}

export default Login;