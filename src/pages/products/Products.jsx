import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from '../homePage/HomePage';
import './Products.css';
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://bagit-product-service.onrender.com/api/products");
        const data = await res.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      setFilteredProducts(allProducts.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedCategory, allProducts]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete this Product?',
        text: 'Product will be deleted from the list!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete',
      });

      if (result.isConfirmed) {
        const res = await fetch(`https://bagit-product-service.onrender.com/api/products/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          const updated = allProducts.filter(p => p._id !== id);
          setAllProducts(updated);
          setFilteredProducts(
            selectedCategory && selectedCategory !== 'All'
              ? updated.filter(p => p.category === selectedCategory)
              : updated
          );
          toast.success("Product Deleted Successfully!");
        } else {
          toast.error("Failed to delete product");
        }
      }
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  return (
    <HomePage>
      <div className="Products-container">
        <h3 className="Products-header">Products</h3>

        <div className="Products-cards">
          <table className="productlists-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>
                    <button className='btn secondary' onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6">No products found for selected category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HomePage>
  );
};

export default Products;
