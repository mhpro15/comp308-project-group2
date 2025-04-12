// import PatientDashboard from "./components/PatientDashboard";

// function App() {
//   return (
//     <>
//       <PatientDashboard />
//     </>
//   );
// }

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

//test
// import HelpAlerts from "./components/HelpAlerts";
import MotivationCards from "./components/MotivationCard";

// Import components
import AppLayout from "./components/AppLayout";
import VitalSigns from "./pages/VitalSigns";
import MotivationalTipsPage from "./pages/MotivationalTipsPage";
import SymptomsPage from "./pages/SymptomsPage";
import AnalyzePage from "./pages/AnalyzePage";
import EmergencyAlertsPage from "./pages/EmergencyAlertsPage";

function App({ user }) {
  console.log("User in App component:", user);
  return (
    <Router>
      {/* <HelpAlerts />
      <MotivationCard /> */}
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
              <EmergencyAlertsPage currentUser={user} />
            </AppLayout>
          }
        />
        <Route
          path="/symptoms"
          element={
            <AppLayout>
              <SymptomsPage currentUser={user} />
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
