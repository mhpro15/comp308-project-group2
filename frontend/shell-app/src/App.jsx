import React, { lazy, Suspense } from 'react';
import './App.css';
//
const AuthComponent = lazy(() => import('authApp/AuthComponent'));
//
function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Shell Application</h1>
        <Suspense fallback={<div>Loading User Component...</div>}>
          <AuthComponent />
        </Suspense>
      </header>
    </div>
  );
}
//
export default App;