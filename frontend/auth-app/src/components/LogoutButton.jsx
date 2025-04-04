import React from 'react';

export default function LogoutButton({ onLogout }) {
  return (
    <button onClick={onLogout} style={{ marginTop: '20px' }}>
      Logout
    </button>
  );
}