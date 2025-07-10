import React, { useEffect, useState } from 'react';
import HomePage from '../homePage/HomePage';
import './Customers.css';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5002/api/user/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCustomers(data.users || []);
      } else {
        setError(data.message || "Failed to fetch customers");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server error while fetching customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Are you sure?',
      text: 'This customer will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5002/api/user/${customerId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            setCustomers(prev => prev.filter(c => c._id !== customerId));
            toast.success(data.message || "Customer deleted successfully.");
          } else {
            toast.error(data.message || "Failed to delete customer.");
          }
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Server error while deleting customer.");
        }
      }
    });
  };

  return (
    <HomePage>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="Customers-container">
        <h3 className="Customers-header">Customers</h3>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="Customers-table-container">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th> 
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(customer._id)}>
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

export default Customers;
