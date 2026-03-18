// frontend/src/pages/BookingSuccessPage.tsx

import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as any) || {};

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1 className="success-title">You're booked!</h1>
        <p className="success-subtitle">
          Confirmation sent to{" "}
          <strong>{state.guestEmail || "your email"}</strong>
        </p>

        {(state.meetingTitle || state.date || state.time) && (
          <div className="success-details">
            {state.meetingTitle && (
              <div className="success-detail-row">
                <span className="success-detail-label">Meeting</span>
                <span className="success-detail-value">{state.meetingTitle}</span>
              </div>
            )}
            {state.hostName && (
              <div className="success-detail-row">
                <span className="success-detail-label">Host</span>
                <span className="success-detail-value">{state.hostName}</span>
              </div>
            )}
            {state.date && (
              <div className="success-detail-row">
                <span className="success-detail-label">Date</span>
                <span className="success-detail-value">
                  {new Date(state.date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {state.time && (
              <div className="success-detail-row">
                <span className="success-detail-label">Time</span>
                <span className="success-detail-value">{state.time}</span>
              </div>
            )}
          </div>
        )}

        <button
          className="success-done-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;