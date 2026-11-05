
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();

      if (res.ok) {
        alert('Product created successfully with Cloudinary Image URL!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      background: '#fff',
      padding: '35px',
      borderRadius: '10px',
      border: '1px solid #e4e4e7'
    }}>
      <h2 style={{ color: '#18181b', marginBottom: '25px' }}>
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <input
          type="text"
          placeholder="Product Name"
          required
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          required
          rows="4"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Price"
          required
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Category"
          required
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          required
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
          style={inputStyle}
        />

        <div style={{
          padding: '15px',
          border: '1px dashed #d4d4d8',
          borderRadius: '7px',
          background: '#fafafa'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            color: '#52525b'
          }}>
            Upload Product Image (Cloudinary)
          </label>

          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: '#52525b' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Uploading & Creating...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '13px',
  background: '#fff',
  border: '1px solid #d4d4d8',
  borderRadius: '6px',
  color: '#18181b',
  fontSize: '15px',
  outline: 'none',
  width: '100%'
};

export default AddProduct;
