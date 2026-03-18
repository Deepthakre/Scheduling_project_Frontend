// frontend/src/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { meetingApi } from "../api/meeting.api";
import { IMeeting } from "../types";
import "./Dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await meetingApi.getMyMeetings();
     if (res.success && res.meetings) {
  setMeetings(res.meetings);
}
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await meetingApi.deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m._id !== id));
      toast.success("Meeting deleted");
    } catch {
      toast.error("Failed to delete meeting");
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">📅</div>
          <span className="navbar-logo-text">Scheduly</span>
        </div>
        <div className="navbar-right">
          <span className="navbar-user-name">{user?.name}</span>
          <div className="user-avatar">{initials}</div>
          <button className="navbar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Event Types</h1>
            <p>Create and manage your scheduling links</p>
          </div>
          <button
            className="create-btn"
            onClick={() => navigate("/create-meeting")}
          >
            + New Event Type
          </button>
        </div>

        {loading ? (
          <div className="loading-text">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No event types yet</h3>
            <p>Create your first event type to start accepting bookings</p>
            <button
              className="create-btn"
              style={{ margin: "0 auto" }}
              onClick={() => navigate("/create-meeting")}
            >
              + Create Event Type
            </button>
          </div>
        ) : (
          <div className="meetings-grid">
            {meetings.map((meeting) => (
              <div className="meeting-card" key={meeting._id}>
                <div
                  className={`meeting-card-top-bar ${
                    meeting.meetingType === "group" ? "group" : ""
                  }`}
                />
                <span
                  className={`meeting-badge ${
                    meeting.meetingType === "group" ? "group" : ""
                  }`}
                >
                  {meeting.meetingType === "one-on-one" ? "1-on-1" : "Group"}
                </span>
                <div className="meeting-card-title">{meeting.title}</div>
                <div className="meeting-card-meta">
                  <span>⏱ {meeting.duration} min</span>
                  {meeting.location && <span>📍 {meeting.location}</span>}
                </div>
                {meeting.description && (
                  <p className="meeting-card-desc">{meeting.description}</p>
                )}
                <div className="meeting-card-actions">
                  <button
                    className="copy-link-btn"
                    onClick={() => handleCopyLink(meeting.slug, meeting._id)}
                  >
                    {copiedId === meeting._id ? "✓ Copied!" : "🔗 Copy Link"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(meeting._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;