import React, { useState } from 'react'
import '../styles/authenticate.css'
import Login from '../components/Login'
import Register from '../components/Register'
import {useNavigate} from 'react-router-dom'

const Authenticate = () => {

  const [authType, setAuthType] = useState('login');
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const usertype = localStorage.getItem('usertype')?.toLowerCase();
    
    if (token && usertype) {
      if (usertype === 'freelancer') navigate('/freelancer');
      else if (usertype === 'client') navigate('/client');
      else if (usertype === 'admin') navigate('/admin');
    }
  }, [navigate]);

  return (


    <div className="AuthenticatePage">

        <div className="auth-navbar">
          <h3 onClick={()=> navigate('/')} >SB Works</h3>
          <p onClick={()=> navigate('/')} >Home</p>
        </div>

        {authType==='login' ?
        <>
            <Login setAuthType={setAuthType} />
        </>
        :
        <>
            <Register setAuthType={setAuthType} />
        </>
        }

    </div>
  )
}

export default Authenticate