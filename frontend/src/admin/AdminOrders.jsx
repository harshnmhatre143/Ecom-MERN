
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.token) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const data = await res.json();

        console.log('Orders API response:', data);

        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error('Failed to fetch orders:', data.message || data);
          setOrders([]);
        }
      }
      catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(prev =>
          prev.map(order =>
            order._id === id ? { ...order, status } : order
          )
        );
      } else {
        console.error('Status update failed:', data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#18181b', marginBottom: '25px' }}>
        Manage Orders
      </h2>

      {loading ? (
        <p style={{ color: '#71717a' }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: '#71717a', padding: '15px 0' }}>
          No orders found.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={rowStyle}>
                <th style={thStyle}>ORDER ID</th>
                <th style={thStyle}>USER</th>
                <th style={thStyle}>TOTAL</th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={rowStyle}>
                  <td style={tdStyle}>
                    {order._id?.substring(0, 8)}...
                  </td>

                  <td style={tdStyle}>
                    {order.user?.name || order.user?.email || 'Deleted User'}
                  </td>

                  <td style={{ ...tdStyle, color: '#f97316', fontWeight: '600' }}>
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </td>

                  <td style={tdStyle}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : '-'}
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      style={selectStyle}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  minWidth: '700px',
  borderCollapse: 'collapse'
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

const selectStyle = {
  background: '#fff',
  color: '#18181b',
  padding: '8px',
  border: '1px solid #d4d4d8',
  borderRadius: '5px',
  outline: 'none'
};

export default AdminOrders;
