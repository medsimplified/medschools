"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Create a separate component for the form that uses useSearchParams
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Add your password reset logic here
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();
      setMessage(data.message || 'Password reset successfully');
    } catch (error) {
      setMessage('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: 40,
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        background: 'white',
        padding: 40,
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#5624d0',
          marginBottom: 20,
          textAlign: 'center'
        }}>
          Reset Password
        </h1>

        {message && (
          <div style={{
            padding: 12,
            marginBottom: 20,
            borderRadius: 6,
            background: message.includes('Error') ? '#fee' : '#efe',
            color: message.includes('Error') ? '#c33' : '#383',
            border: `1px solid ${message.includes('Error') ? '#fcc' : '#cfc'}`
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block',
              marginBottom: 6,
              fontWeight: 'bold',
              color: '#333'
            }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: 16
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block',
              marginBottom: 6,
              fontWeight: 'bold',
              color: '#333'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: 16
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              background: loading ? '#ccc' : '#5624d0',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: 40,
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: 400,
          width: '100%',
          background: 'white',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
