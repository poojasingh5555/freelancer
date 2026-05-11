import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('usertype'); 

  //  Agar token nahi hai, toh login page par bhejo
  if (!token) {
    return <Navigate to="/authenticate" replace />;
  }

  //  Agar role match nahi karta, toh access deny karo
  if (allowedRoles) {
    const isRoleMatched = allowedRoles.some(
      (role) => role.toLowerCase() === userType?.toLowerCase()
    );
    if (!isRoleMatched) {
      return <Navigate to="/" replace />;
    }
  }

 
  return children;
};

export default ProtectedRoute;