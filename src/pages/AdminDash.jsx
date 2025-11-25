import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TempUpload from '../components/admin/TempUpload';

const AdminDash = () => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6'
    }}>
      <div style={{
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Admin Dashboard
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              Welcome, {user?.firstName || 'Admin'}! Manage templates and admin features.
            </p>
          </div>
          
          <TempUpload />
        </div>
      </div>
    </div>
  );
};

export default AdminDash;

