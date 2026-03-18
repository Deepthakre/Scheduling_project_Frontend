// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages (tera existing)
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OAuthSuccessPage from "./pages/OAuthSuccessPage";

// Scheduling pages (naye)
import DashboardPage from "./pages/DashboardPage";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import PublicBookingPage from "./pages/PublicBookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          {/* ── Public Auth Routes ── */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />

          {/* ── Public Booking Routes ── */}
          <Route path="/book/:slug" element={<PublicBookingPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />

          {/* ── Protected Routes ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-meeting"
            element={
              <ProtectedRoute>
                <CreateMeetingPage />
              </ProtectedRoute>
            }
          />

          {/* ── Redirects ── */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;