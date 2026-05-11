export const isAdmin = (req, res, next) => {
  // Debug log to see if middleware is even reached
  console.log("isAdmin middleware reached. User role:", req.user?.usertype);
  
  if (req.user && (req.user.usertype === "admin" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ 
      message: "Admin access only", 
      debugInfo: { role: req.user?.role, usertype: req.user?.usertype } 
    });
  }
};