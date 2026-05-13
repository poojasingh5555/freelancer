import React, { createContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import socketIoClient from 'socket.io-client';
import API from "../config/API";

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const WS = process.env.REACT_APP_WS_URL || process.env.REACT_APP_API_URL || 'http://localhost:6001';
  const navigate = useNavigate();

  // autoConnect: false karne se socket turant connect nahi hoga
  const socket = React.useMemo(() => {
    const s = socketIoClient(WS, { autoConnect: false });
    const token = localStorage.getItem('token');
    
    if (token) {
      s.auth = { token };
      s.connect();
    }
    
    s.on("connect_error", (err) => {
      if (err.message === "Invalid token" || err.message.includes("Authentication error")) {
        console.error("Socket authentication failed:", err.message);
        s.disconnect();
        localStorage.clear();
        window.location.href = '/authenticate';
      }
    });

    return s;
  }, [WS]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  // helper function to save user data
  const saveUserData = (data) => {
    localStorage.setItem('token', data.token); // Sabse zaroori!
    localStorage.setItem('userId', data._id);
    localStorage.setItem('usertype', data.usertype);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
  };

  const login = async () => {
    try {
      const loginInputs = { email, password };
      const res = await API.post('api/users/login', loginInputs);
      
      saveUserData(res.data);
      socket.auth = { token: res.data.token };
      socket.connect();
      // States ko clear karein
      setEmail('');
      setPassword('');

      if (res.data.usertype === 'freelancer') navigate('/freelancer');
      else if (res.data.usertype === 'client') navigate('/client');
      else if (res.data.usertype === 'admin') navigate('/admin');

    } catch (err) {
      alert("Login failed!! Check credentials.");
      console.log("BACKEND ERROR:", err.response?.data || err.message);;
    }
  }

  const register = async () => {
    try {
      // Inputs function ke andar taaki fresh data mile
      const inputs = { username, email, usertype, password };
      const res = await API.post('api/users/register', inputs);
      
      saveUserData(res.data);
      socket.auth = { token: res.data.token };
      socket.connect();
      // States ko clear karein
      setUsername('');
      setEmail('');
      setPassword('');
      setUsertype('');
      const userRole = res.data.usertype?.toLowerCase();
      console.log("Backend se aayi hui Usertype:", userRole);

      if (userRole === 'freelancer') {
        navigate('/freelancer');
      } else if (userRole === 'client') {
        navigate('/client');
      } else {
        console.log("Nav route match nahi hua! Role tha:", userRole);
      }

    } catch (err) {
      alert("Registration failed!!");
      console.log(err);
    }
  }

  const logout = async () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <GeneralContext.Provider value={{ 
      socket, login, register, logout, 
      username, setUsername, 
      email, setEmail, 
      password, setPassword, 
      usertype, setUsertype 
    }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider;