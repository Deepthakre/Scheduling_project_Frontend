// frontend/src/pages/PublicBookingPage.tsx

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { meetingApi } from "../api/meeting.api";
import { IMeeting } from "../types";
import "./Booking.css";

// ── Calendar helpers ──
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const toDateStr = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// ── Mini Calendar ──
const MiniCalendar = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (d: string) => void;
}) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    const t = new Date();
    d.setHours(0, 0, 0, 0);
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="calendar-header">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="calendar-month-label">{MONTHS[month]} {year}</span>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>
      <div className="calendar-grid">
        {DAY_NAMES.map((d) => (
          <div className="cal-day-name" key={d}>{d}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div className="cal-day cal-empty" key={`e-${idx}`} />;
          const dateStr = toDateStr(year, month, day);
          const past = isPast(day);
          return (
            <button
              key={day}
              type="button"
              className={`cal-day ${dateStr === todayStr ? "cal-today" : ""} ${
                dateStr === selected ? "cal-selected" : ""
              } ${past ? "cal-past" : ""}`}
              onClick={() => !past && onSelect(dateStr)}
              disabled={past}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Page ──
const PublicBookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState<IMeeting | null>(null);
  const [host, setHost] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
 const [customAnswers, setCustomAnswers] = useState<{ question: string; answer: string }[]>([]);

  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Meeting load karo
  useEffect(() => {
    const load = async () => {
      try {
       const res = await meetingApi.getPublicMeeting(slug!);
if (res.success && res.meeting) {
  setMeeting(res.meeting);
  const u = res.meeting.userId as any;
  setHost({ name: u.name, email: u.email });
  if (res.meeting.customQuestions?.length) {
    setCustomAnswers(
      res.meeting.customQuestions.map((q: any) => ({
        question: q.question,
        answer: "",
      }))
    );
  }
}
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  // Slots load karo jab date change ho
  const fetchSlots = useCallback(
    async (date: string) => {
      setSlotsLoading(true);
      setSelectedSlot("");
      try {
       const res = await meetingApi.getAvailableSlots(slug!, date);
if (res.success && res.slots) {
  setSlots(res.slots);
}
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    [slug]
  );

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  const handleConfirm = async () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      setBookingError("Name and email are required.");
      return;
    }
    setBooking(true);
    setBookingError("");
    try {
      await meetingApi.createBooking({
        meetingSlug: slug!,
        guestName,
        guestEmail,
        selectedDate,
        selectedTime: selectedSlot,
        customAnswers,
      });
      navigate("/booking-success", {
        state: {
          meetingTitle: meeting?.title,
          hostName: host?.name,
          date: selectedDate,
          time: selectedSlot,
          guestEmail,
        },
      });
    } catch (err: any) {
      setBookingError(
        err.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="booking-not-found"><p>Loading...</p></div>;
  if (notFound || !meeting)
    return (
      <div className="booking-not-found">
        <div style={{ fontSize: "3rem" }}>😕</div>
        <h2>Meeting not found</h2>
        <p>This link may be invalid or expired.</p>
      </div>
    );

  const hostInitials = host?.name
    ? host.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "H";

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Left: Meeting Info */}
        <div className="booking-info-panel">
          <div className="booking-host-avatar">{hostInitials}</div>
          <div className="booking-host-name">{host?.name}</div>
          <div className="booking-meeting-title">{meeting.title}</div>
          <ul className="booking-meta-list">
            <li>⏱ {meeting.duration} minutes</li>
            {meeting.location && <li>📍 {meeting.location}</li>}
            <li>
              🗓 {meeting.meetingType === "one-on-one" ? "One-on-One" : "Group"}
            </li>
          </ul>
          {meeting.description && (
            <div className="booking-description">{meeting.description}</div>
          )}
        </div>

        {/* Right: Booking Flow */}
        <div className="booking-right-panel">
          <div className="booking-section-title">Select a date</div>
          <MiniCalendar selected={selectedDate} onSelect={handleDateSelect} />

          {/* Time Slots */}
          {selectedDate && (
            <div className="slots-section">
              <div className="slots-date-label">
                Available times —{" "}
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {slotsLoading ? (
                <p className="no-slots">Loading slots...</p>
              ) : slots.length === 0 ? (
                <p className="no-slots">No available slots on this day</p>
              ) : (
                <div className="slots-grid">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guest Form */}
          {selectedDate && selectedSlot && (
            <div className="guest-form-section">
              <div className="selected-slot-summary">
                📅 {selectedDate} at {selectedSlot}
              </div>
              <div className="guest-form-title">Your details</div>

              <div className="booking-form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="booking-form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>

              {/* Custom questions */}
              {meeting.customQuestions?.map((q, i) => (
                <div className="booking-form-group" key={i}>
                  <label>
                    {q.question}{" "}
                    {q.required && (
                      <span style={{ color: "#e53e3e" }}>*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={customAnswers[i]?.answer || ""}
                    onChange={(e) => {
                      const updated = [...customAnswers];
                      updated[i] = { question: q.question, answer: e.target.value };
                      setCustomAnswers(updated);
                    }}
                  />
                </div>
              ))}

              {bookingError && (
                <div className="booking-error">{bookingError}</div>
              )}

              <button
                className="confirm-booking-btn"
                onClick={handleConfirm}
                disabled={booking}
              >
                {booking ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;