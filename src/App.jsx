import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useAuth } from "./context/AuthContext";

import AuthPage from "./components/AuthPage";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import GuestPage from "./components/Guest/GuestPage";
import VendorPage from "./components/Vendors/VendorPage";
import VendorProfilesPage from "./components/VendorProfiles/VendorProfilesPage";
import BudgetPage from "./components/Budget/BudgetPage";
import ChecklistPage from "./components/Checklist/ChecklistPage";
import EventsPage from "./components/Events/EventsPage";
import SubEventPage from "./components/Events/SubEventsPage";
import ProfilePage from "./components/Profile/ProfilePage";
import AIChatWidget from "./components/AIChatWidget";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId/subevents/:subEventId/:subEventName" element={<SubEventPage />} />
          <Route path="guests" element={<GuestPage />} />
          <Route path="vendors" element={<VendorPage />} />
          <Route path="marketplace" element={<VendorProfilesPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIChatWidget />
    </BrowserRouter>
  );
}
