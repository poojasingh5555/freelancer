import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = ({ setAuthType }) => {
  // Context se functions nikaale
  const { setUsername, setEmail, setPassword, setUsertype, register, username, email, password, usertype } = useContext(GeneralContext);
  
  // Ek local loading state taaki button ko control kar sakein
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Registration shuru
    await register();
    setLoading(false); // Registration khatam
  }

  return (
    // Form par onSubmit lagaya hai
    <form className="authForm" onSubmit={handleRegister}>
      <h2>Register</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="text" 
          className="form-control" 
          id="floatingInput" 
          placeholder=" "
          required
          onChange={(e) => setUsername(e.target.value)} 
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="email" 
          className="form-control" 
          id="floatingEmail" 
          placeholder=" "
          required
          onChange={(e) => setEmail(e.target.value)} 
        />
        <label htmlFor="floatingEmail">Email address</label>
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

      <select 
        className="form-select form-select-lg mb-3" 
        required
        onChange={(e) => setUsertype(e.target.value)}
      >
        <option value="">User type</option>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
        
      </select>

      {/* Button disable rahega agar fields khali hain ya register ho raha hai */}
      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading || !username || !email || !password || !usertype}
      >
        {loading ? "Registering..." : "Sign up"}
      </button>

      <p>Already registered? <span onClick={() => setAuthType('login')} style={{cursor: 'pointer', color: 'blue'}}>Login</span></p>
    </form>
  )
}

export default Register;