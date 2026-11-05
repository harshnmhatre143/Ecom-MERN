
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    };
    fetchUsers();
  }, [user]);

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#18181b', marginBottom: '25px' }}>
        User Directory
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>EMAIL</th>
              <th style={thStyle}>ROLE</th>
              <th style={thStyle}>JOINED</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u._id} style={rowStyle}>
                <td style={tdStyle}>{u._id.substring(0, 8)}...</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>
                  <span style={{
                    background: u.role === 'admin' ? '#fff7ed' : '#f0fdf4',
                    color: u.role === 'admin' ? '#ea580c' : '#16a34a',
                    padding: '5px 9px',
                    borderRadius: '5px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={tdStyle}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p style={{
            textAlign: 'center',
            padding: '25px',
            color: '#71717a'
          }}>
            No users found.
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
  minWidth: '650px',
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

export default AdminUsers;
