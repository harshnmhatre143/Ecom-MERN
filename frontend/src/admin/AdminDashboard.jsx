
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setStats({
          totalOrders: 0,
          totalProducts: 0,
          totalUsers: 0,
          totalRevenue: 0
        });
      }
    };

    fetchStats();
  }, [user, navigate]);

  const cards = [
    { title: 'Total Orders', value: stats?.totalOrders ?? 0 },
    { title: 'Total Products', value: stats?.totalProducts ?? 0 },
    { title: 'Total Users', value: stats?.totalUsers ?? 0 },
    { title: 'Total Revenue', value: `₹${stats?.totalRevenue ?? 0}` }
  ];

  const actions = [
    { title: 'Add Product', path: '/admin/add-product' },
    { title: 'Manage Products', path: '/admin/products' },
    { title: 'Manage Orders', path: '/admin/orders' },
    { title: 'Manage Users', path: '/admin/users' }
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      color: '#18181b'
    }}>
      <h2>Admin Dashboard</h2>

      <p style={{ color: '#71717a', marginBottom: '30px' }}>
        Welcome, {user.name || user.email}
      </p>

      {!stats ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '35px'
          }}>
            {cards.map((card) => (
              <div key={card.title} style={{
                background: '#fff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                padding: '25px'
              }}>
                <p style={{ color: '#71717a', marginBottom: '12px' }}>
                  {card.title}
                </p>
                <h2 style={{ color: '#f97316', margin: 0 }}>
                  {card.value}
                </h2>
              </div>
            ))}
          </div>

          <h2>Manage Store</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {actions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                style={{
                  padding: '16px',
                  background: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '7px',
                  color: '#18181b',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {action.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
