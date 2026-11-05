
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you strictly sure you want to delete this?')) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <h2 style={{ color: '#18181b', margin: 0 }}>Manage Products</h2>
        <Link to="/admin/add-product" className="btn">+ Add Product</Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>PRICE</th>
              <th style={thStyle}>CATEGORY</th>
              <th style={thStyle}>STOCK</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={rowStyle}>
                <td style={tdStyle}>{product._id.substring(0, 8)}...</td>
                <td style={tdStyle}>{product.name}</td>
                <td style={{ ...tdStyle, color: '#f97316', fontWeight: '600' }}>
                  ₹{product.price.toFixed(2)}
                </td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>{product.stock}</td>
                <td style={tdStyle}>
                  <Link to={`/admin/edit-product/${product._id}`} style={editBtn}>Edit</Link>
                  <button onClick={() => handleDelete(product._id)} style={deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', padding: '25px', color: '#71717a' }}>
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '25px',
  background: '#fff',
  borderRadius: '10px',
  border: '1px solid #e4e4e7',
  color: '#18181b'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '650px'
};

const rowStyle = {
  borderBottom: '1px solid #e4e4e7'
};

const thStyle = {
  padding: '15px',
  textAlign: 'left',
  color: '#71717a',
  fontSize: '0.85rem'
};

const tdStyle = {
  padding: '15px',
  textAlign: 'left',
  color: '#3f3f46'
};

const editBtn = {
  background: '#f4f4f5',
  color: '#18181b',
  padding: '7px 12px',
  borderRadius: '5px',
  marginRight: '8px',
  display: 'inline-block'
};

const deleteBtn = {
  background: '#fff',
  color: '#dc2626',
  padding: '7px 12px',
  borderRadius: '5px',
  border: '1px solid #fecaca',
  cursor: 'pointer'
};

export default AdminProducts;
