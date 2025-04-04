import React from "react";

export default function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      style={{
        marginTop: "5px",
        display: "fixed",
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      Logout
    </button>
  );
}
