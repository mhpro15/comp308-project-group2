import React, { lazy, Suspense } from "react";
import "./App.css";
//
const AuthComponent = lazy(() => import("authApp/AuthComponent"));
const NurseApp = lazy(() => import("nurseApp/NurseAppComponent"));
//
function App() {
  const [user, setUser] = React.useState(null);
  console.log("User in Shell App:", user);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Shell Application</h1>
        <Suspense fallback={<div>Loading User Component...</div>}>
          <AuthComponent onUserChange={setUser} />
          {user?.role === "nurse" && (
            <div
              style={{
                minHeight: "100vh",
                width: "100vw",
                overflow: "hidden",
                position: "absolute",
                top: 50,
                left: 0,
              }}
            >
              <NurseApp user={user} />
            </div>
          )}
        </Suspense>
      </header>
    </div>
  );
}
//
export default App;
