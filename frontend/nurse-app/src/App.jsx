import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import AppLayout from "./components/AppLayout";
import VitalSigns from "./pages/VitalSigns";
import MotivationalTipsPage from "./pages/MotivationalTipsPage";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const Dashboard = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Dashboard</h1>
    </div>
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Welcome Back</h2>
      </div>
      <div className="card-body">
        <p>
          This is your nursing dashboard. View your daily tasks and patient
          information.
        </p>
      </div>
    </div>
  </div>
);

const VitalsPage = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Patient Vitals</h1>
    </div>
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Vital Signs Monitor</h2>
      </div>
      <div className="card-body">
        <p>View and track patient vital signs here.</p>
      </div>
    </div>
  </div>
);

const EmergencyPage = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Emergency Alerts</h1>
    </div>
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Emergency Response System</h2>
      </div>
      <div className="card-body">
        <p>Track and respond to emergency alerts from patients.</p>
      </div>
    </div>
  </div>
);

const SymptomsPage = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Symptom Reports</h1>
    </div>
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Patient Reported Symptoms</h2>
      </div>
      <div className="card-body">
        <p>Review symptoms reported by patients.</p>
      </div>
    </div>
  </div>
);

const PatientsPage = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Patient Management</h1>
    </div>
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Patient Records</h2>
      </div>
      <div className="card-body">
        <p>Access and manage patient records here.</p>
      </div>
    </div>
  </div>
);

const AnalyzePage = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Data Analysis</h1>
    </div>
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Patient Data Analysis</h2>
      </div>
      <div className="card-body">
        <p>Analyze patient health data and trends.</p>
      </div>
    </div>
  </div>
);

function App({ user }) {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />

          {/* Protected Routes */}

          <Route
            path="/vitals"
            element={
              <AppLayout>
                <VitalSigns />
              </AppLayout>
            }
          />
          <Route
            path="/emergency"
            element={
              <AppLayout>
                <EmergencyPage />
              </AppLayout>
            }
          />
          <Route
            path="/symptoms"
            element={
              <AppLayout>
                <SymptomsPage />
              </AppLayout>
            }
          />
          <Route
            path="/patients"
            element={
              <AppLayout>
                <PatientsPage />
              </AppLayout>
            }
          />
          <Route
            path="/motivational-tips"
            element={
              <AppLayout>
                <MotivationalTipsPage currentUser={{ role: "nurse" }} />
              </AppLayout>
            }
          />
          <Route
            path="/analyze"
            element={
              <AppLayout>
                <AnalyzePage />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
