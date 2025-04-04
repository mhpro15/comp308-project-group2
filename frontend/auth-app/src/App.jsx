import React, { useState, useEffect } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import LogoutButton from './components/LogoutButton';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <h1>Welcome to the App!</h1>
          <LogoutButton onLogout={handleLogout} />
        </>
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
