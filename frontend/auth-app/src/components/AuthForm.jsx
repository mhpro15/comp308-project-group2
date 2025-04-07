import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import client from "../apollo/client";

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: UserInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;
const GET_PATIENTS1 = gql`
  query GetPatients {
    getAllUsers {
      email
      id
      name
      role
    }
  }
`;

export default function AuthForm({ onAuthSuccess, onUserChange }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "patient", // Default role for registration
  });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  // Mutations
  const [login] = useMutation(LOGIN_MUTATION, { client });
  const [register] = useMutation(REGISTER_MUTATION, { client });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Login logic
        const { data } = await login({
          variables: { email: form.email, password: form.password },
        });
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("user", JSON.stringify(data.login.user));

        if (onAuthSuccess) {
          onAuthSuccess({ id: data.login.user.id });
        }
        if (onUserChange) {
          onUserChange(data.login.user); // Set user state in parent component
        }

        setUser(data.login.user);

        alert(
          `Welcome back, ${data.login.user.username || data.login.user.email}!`
        );
      } else {
        // Register logic
        const { data } = await register({
          variables: {
            input: {
              email: form.email,
              password: form.password,
              name: form.name,
              role: form.role,
            },
          },
        });
        localStorage.setItem("token", data.register.token);
        localStorage.setItem("user", JSON.stringify(data.register.user));

        if (onAuthSuccess) {
          onAuthSuccess({ id: data.register.user.id });
        }
        if (onUserChange) {
          onUserChange(data.register.user); // Set user state in parent component
        }
        setUser(data.register.user);

        alert(
          `Welcome, ${data.register.user.name}! Your account has been created.`
        );
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <>
        <h2>{isLogin ? "Login" : "Register"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="patient">Patient</option>
                <option value="nurse">Nurse</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </>
    </div>
  );
}
