import React, { useEffect, useState } from 'react'
import '../../styles/admin/allUsers.css'
import API from "../../config/API"; // Interceptor ke liye iska use karein

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await API.get("api/users/fetch-users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- DELETE USER LOGIC ---
  const handleDeleteUser = async (id) => {
    if (window.confirm("Kya aap is user ko delete karna chahte hain? Isse unke saare projects aur applications bhi delete ho jayenge.")) {
      try {
        await API.delete(`/api/admin/user/${id}`); // Corrected admin route
        setUsers(users.filter(user => user._id !== id)); // UI update
        alert("User deleted successfully!");
      } catch (err) {
        console.error("Error deleting user:", err);
        const errMsg = err.response?.data?.message || "User delete nahi ho paya.";
        alert(`Error: ${errMsg}`);
      }
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  if (loading) return <div className="loader">Loading Users...</div>;

  return (
    <div className="all-users-page">
      <h3>All Registered Users ({users.length})</h3>

      <div className="all-users">
        {users.map((user) => (
          <div className="user" key={user._id}>
            <span>
              <b>User Id</b>
              <p>{user._id}</p>
            </span>
            <span>
              <b>Username</b>
              <p>{user.username}</p>
            </span>
            <span>
              <b>Email</b>
              <p>{user.email}</p>
            </span>
            <span>
              <b>User Role</b>
              <p className={`role-${user.role}`}>{user.role}</p>
            </span>

            {/* DELETE BUTTON (Sirf Admin ko dikhega/kam karega) */}
            <div className="user-actions">
              <button
                className="delete-user-btn"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUsers;