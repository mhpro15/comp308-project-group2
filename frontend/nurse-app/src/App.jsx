import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

//test
import HelpAlerts from "./components/HelpAlerts";
import MotivationCards from "./components/MotivationCards";

// Import components
import AppLayout from "./components/AppLayout";
import VitalSigns from "./pages/VitalSigns";
import MotivationalTipsPage from "./pages/MotivationalTipsPage";

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
  console.log("User in App component:", user);
  return (
    <Router>
      <HelpAlerts />
      <MotivationCards />
      <Routes>
        {/* Default route - redirect to vitals */}
        <Route path="/" element={<Navigate to="/vitals" replace />} />

        {/* Protected Routes */}
        <Route
          path="/vitals"
          element={
            <AppLayout>
              <VitalSigns currentUser={user} />
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
          path="/motivational-tips"
          element={
            <AppLayout>
              <MotivationalTipsPage currentUser={user} />
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
  );
}

export default App;
