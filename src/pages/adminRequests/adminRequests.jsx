import React, { useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import './AdminRequests.css';
import HomePage from '../homePage/HomePage';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token"); // make sure you stored it at login
    const res = await fetch('https://bagit-admin-service.onrender.com/api/admin/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!res.ok) {
      console.error("Failed to fetch admin requests");
      return;
    }

    const data = await res.json();
    setRequests(data.admins); 
  };


  const handleAccept = async (id) => {
    try {
      const res = await fetch(`https://bagit-admin-service.onrender.com/api/admin/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // include token
          'Content-Type': 'application/json'
        }
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
  
      fetchRequests();
    } catch (err) {
      console.error("Accept error:", err.message);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://bagit-admin-service.onrender.com/api/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
  
      fetchRequests();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };
  
  

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <HomePage>
      <div className="admin-requests-container">
        <h2>Pending Seller Requests</h2>
        {requests?.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <div className="request-list">
            {requests?.map(req => (
              <div className="request-card" key={req._id}>
                <h4>{req.companyName}</h4>
                <p><strong>Name</strong> {req.name}</p>
                <p><strong>Email</strong> {req.email}</p>
                <div className="actions">
                  <button className="accept" onClick={() => handleAccept(req._id, 'accept')}>
                    <FiCheck /> Accept
                  </button>
                  <button className="reject" onClick={() => handleDelete(req._id, 'reject')}>
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HomePage>
  );
};

export default AdminRequests;
