import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import LogoutButton from "./components/LogoutButton";

function App({ onUserChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    if (onUserChange) {
      const user = localStorage.getItem("user");
      onUserChange(JSON.parse(user)); // Set user state in parent component
    }
  }, [onUserChange]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onUserChange) {
      onUserChange(null); // Reset user state in parent component
    }
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
        <AuthForm
          onAuthSuccess={handleAuthSuccess}
          onUserChange={onUserChange}
        />
      )}
    </div>
  );
}

export default App;
