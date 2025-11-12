import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import api from '../services/api';
import './AcceptInvite.css';

export const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Processing invitation...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid invitation link. No token provided.');
      return;
    }

    acceptInvite();
  }, [token]);

  const acceptInvite = async () => {
    try {
      setStatus('loading');
      setMessage('Accepting invitation...');
      
      await api.acceptInvite(token);
      
      setStatus('success');
      setMessage('Invitation accepted successfully! Redirecting to team page...');
      
      // Redirect to team page after 2 seconds
      setTimeout(() => {
        navigate('/team');
      }, 2000);
    } catch (error) {
      console.error('Error accepting invite:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to accept invitation. The invitation may have expired or already been used.');
    }
  };

  return (
    <div className="accept-invite-container">
      <div className="accept-invite-card">
        <div className="accept-invite-icon">
          {status === 'loading' && <FiLoader className="spinner" size={48} />}
          {status === 'success' && <FiCheckCircle size={48} color="#16a34a" />}
          {status === 'error' && <FiXCircle size={48} color="#dc2626" />}
        </div>
        
        <h1 className="accept-invite-title">
          {status === 'loading' && 'Processing Invitation'}
          {status === 'success' && 'Invitation Accepted!'}
          {status === 'error' && 'Invitation Error'}
        </h1>
        
        <p className="accept-invite-message">{message}</p>
        
        {status === 'error' && (
          <div className="accept-invite-actions">
            <button 
              className="accept-invite-button"
              onClick={() => navigate('/team')}
            >
              Go to Team Page
            </button>
            <button 
              className="accept-invite-button secondary"
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
          </div>
        )}
        
        {status === 'success' && (
          <div className="accept-invite-actions">
            <button 
              className="accept-invite-button"
              onClick={() => navigate('/team')}
            >
              Go to Team Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;

