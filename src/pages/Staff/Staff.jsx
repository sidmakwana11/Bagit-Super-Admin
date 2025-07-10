import React, { useState, useEffect } from 'react';
import HomePage from '../homePage/HomePage';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Staff.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Staff = () => {
    const [allAdmins, setAllAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const location = useLocation();
    const mainAdminId = location.state?.mainAdminId;


    const fetchAdmins = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:5000/api/admin/relatedStaff?mainAdminId=${mainAdminId}`, {
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
                setError(data.message || "Failed to fetch staff");
            }
        } catch (err) {
            console.error("Error fetching staff:", err);
            setError("Server error while fetching staff.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAdmins();
    });


    const navigate = useNavigate();

    const HandleGoBack = () => {
        navigate('/Admin');
    };

    const handleDelete = async (adminId) => {
        const token = localStorage.getItem("token");

        Swal.fire({
            title: 'Are you sure?',
            text: 'This Staff will be permanently removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:5000/api/admin/${adminId}`, {
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
                <div className="header-backbtn-section">
                <h3 className="Admin-header">Staff</h3><button className="back-btn" onClick={HandleGoBack}>Back</button>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && (
                    <div className="admins-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allAdmins.map((admin) => (
                                    <tr key={admin.id}>
                                        <td>{admin.name}</td>
                                        <td>{admin.email}</td>
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

export default Staff;
