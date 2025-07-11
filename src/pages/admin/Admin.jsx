import React, { useState, useEffect } from 'react';
import HomePage from '../homePage/HomePage';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://bagit-admin-service.onrender.com/api/admin/approved`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const adminsList = data.admins.map((admin) => ({
          id: admin._id,
          name: admin.name,
          email: admin.email,
          createdBy: admin.createdBy,
        }));
        setAllAdmins(adminsList);
      } else {
        setError(data.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Server error while fetching admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const navigate = useNavigate();

  const handleShowStaff = (_id) => {
    navigate('/Staff', { state: { mainAdminId: _id } });
  };
  

  const handleDelete = async (adminId) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Are you sure?',
      text: 'This admin will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://bagit-admin-service.onrender.com/api/admin/${adminId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            setAllAdmins(prev => prev.filter(admin => admin.id !== adminId));
            toast.success(data.message || "Admin deleted successfully.");
          } else {
            toast.error(data.message || "Failed to delete admin.");
          }
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Server error while deleting admin.");
        }
      }
    });
  };

  return (
    <HomePage>
      <div className="admin-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <h3 className="Admin-header">Admin</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="admins-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Staff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>
                      <button className="ViewStaff-btn" onClick={() => handleShowStaff(admin.id)}>
                        View Staff
                      </button>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(admin.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HomePage>
  );
};

export default Admin;
