
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        if (res.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '20px',
      color: '#18181b'
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e4e4e7',
        borderRadius: '10px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h2>My Profile</h2>

        <p style={{ marginBottom: '12px' }}>
          <strong>Name:</strong> {user.name}
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong>Email:</strong> {user.email}
        </p>
        <p style={{ marginBottom: '20px' }}>
          <strong>Role:</strong> {user.role}
        </p>

        <button
          onClick={handleLogout}
          style={{
            background: '#fff',
            color: '#dc2626',
            border: '1px solid #fecaca',
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <h2>My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: '#71717a' }}>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{
            background: '#fff',
            border: '1px solid #e4e4e7',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px'
          }}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p style={{ marginTop: '10px' }}>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>Status:</strong>{' '}
              <span style={{
                color: order.status === 'Delivered' ? '#16a34a' :
                  order.status === 'Shipped' ? '#2563eb' : '#f97316',
                fontWeight: '600'
              }}>
                {order.status || 'Pending'}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
