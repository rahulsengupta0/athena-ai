import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TempUpload from '../components/admin/TempUpload';
import TemplateManager from '../components/admin/TemplateManager';

const AdminDash = () => {
  const { user } = useAuth();
  // State to toggle views: 'create' for uploading new templates, 'manage' for deleting existing ones
  const [activeView, setActiveView] = useState('create');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      paddingBottom: '40px'
    }}>
      <div style={{
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>

          {/* Dashboard Header Card */}
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
              Welcome, {user?.firstName || 'Admin'}! Manage your platform's templates.
            </p>

            {/* Navigation Tabs for Switching Views */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveView('create')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeView === 'create' ? '#111827' : '#e5e7eb',
                  color: activeView === 'create' ? 'white' : '#374151',
                  transition: 'all 0.2s'
                }}
              >
                + Create New Template
              </button>
              <button
                onClick={() => setActiveView('manage')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeView === 'manage' ? '#111827' : '#e5e7eb',
                  color: activeView === 'manage' ? 'white' : '#374151',
                  transition: 'all 0.2s'
                }}
              >
                Manage & Delete Templates
              </button>
            </div>
          </div>

          {/* Conditional Rendering Area */}
          <div style={{ minHeight: '500px' }}>
            {activeView === 'create' ? (
              <TempUpload />
            ) : (
              <TemplateManager />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDash;