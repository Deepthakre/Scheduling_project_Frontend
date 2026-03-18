// frontend/src/pages/CreateMeetingPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { meetingApi } from "../api/meeting.api";
import { MeetingFormData, IAvailability, ICustomQuestion } from "../types";
import "./CreateMeeting.css";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DURATIONS = [15, 30, 45, 60, 90];
const TOTAL_STEPS = 5;

// ─── STEP 1: Meeting Type ─────────────────────────────────
const StepType = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "one-on-one" | "group") => void;
}) => (
  <div>
    <div className="step-card-title">What type of meeting?</div>
    <div className="step-card-subtitle">Choose how guests will book you</div>
    <div className="type-grid">
      <div
        className={`type-card ${value === "one-on-one" ? "selected" : ""}`}
        onClick={() => onChange("one-on-one")}
      >
        <div className="type-card-icon">👤</div>
        <div className="type-card-name">One-on-One</div>
        <div className="type-card-desc">Single guest books with you</div>
      </div>
      <div
        className={`type-card ${value === "group" ? "selected" : ""}`}
        onClick={() => onChange("group")}
      >
        <div className="type-card-icon">👥</div>
        <div className="type-card-name">Group</div>
        <div className="type-card-desc">Multiple people join at once</div>
      </div>
    </div>
  </div>
);

// ─── STEP 2: Meeting Details ──────────────────────────────
const StepDetails = ({
  form,
  onChange,
}: {
  form: MeetingFormData;
  onChange: (k: keyof MeetingFormData, v: any) => void;
}) => (
  <div>
    <div className="step-card-title">Meeting details</div>
    <div className="step-card-subtitle">Tell guests what to expect</div>

    <div className="form-group">
      <label>Meeting Name *</label>
      <input
        type="text"
        placeholder="e.g. 30 Minute Chat"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Duration *</label>
      <div className="duration-chips">
        {DURATIONS.map((d) => (
          <button
            key={d}
            type="button"
            className={`duration-chip ${form.duration === d ? "active" : ""}`}
            onClick={() => onChange("duration", d)}
          >
            {d} min
          </button>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label>Location / Link</label>
      <input
        type="text"
        placeholder="e.g. Zoom link, Google Meet, or office address"
        value={form.location}
        onChange={(e) => onChange("location", e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Description</label>
      <textarea
        rows={3}
        placeholder="Brief description of the meeting..."
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        style={{ resize: "vertical" }}
      />
    </div>
  </div>
);

// ─── STEP 3: Availability ─────────────────────────────────
const StepAvailability = ({
  availability,
  onChange,
}: {
  availability: IAvailability[];
  onChange: (a: IAvailability[]) => void;
}) => {
  const addRow = () =>
    onChange([...availability, { day: "Monday", startTime: "09:00", endTime: "17:00" }]);

  const removeRow = (i: number) =>
    onChange(availability.filter((_, idx) => idx !== i));

  const updateRow = (i: number, field: keyof IAvailability, value: string) =>
    onChange(availability.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  return (
    <div>
      <div className="step-card-title">Set your availability</div>
      <div className="step-card-subtitle">When can guests book you?</div>

      <div className="availability-list">
        {availability.map((row, i) => (
          <div className="availability-row" key={i}>
            <select
              value={row.day}
              onChange={(e) => updateRow(i, "day", e.target.value)}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="time"
              value={row.startTime}
              onChange={(e) => updateRow(i, "startTime", e.target.value)}
            />
            <input
              type="time"
              value={row.endTime}
              onChange={(e) => updateRow(i, "endTime", e.target.value)}
            />
            <button
              type="button"
              className="remove-row-btn"
              onClick={() => removeRow(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="add-row-btn" onClick={addRow}>
        + Add availability slot
      </button>
    </div>
  );
};

// ─── STEP 4: Custom Questions ─────────────────────────────
const StepQuestions = ({
  questions,
  onChange,
}: {
  questions: ICustomQuestion[];
  onChange: (q: ICustomQuestion[]) => void;
}) => {
  const addQuestion = () =>
    onChange([...questions, { question: "", required: false }]);

  const removeQuestion = (i: number) =>
    onChange(questions.filter((_, idx) => idx !== i));

  const updateQuestion = (i: number, field: keyof ICustomQuestion, value: any) =>
    onChange(questions.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));

  return (
    <div>
      <div className="step-card-title">Additional questions</div>
      <div className="step-card-subtitle">
        Ask guests anything before the meeting (optional)
      </div>

      <div className="questions-list">
        {questions.map((q, i) => (
          <div className="question-item" key={i}>
            <div className="question-item-top">
              <input
                type="text"
                placeholder="e.g. What would you like to discuss?"
                value={q.question}
                onChange={(e) => updateQuestion(i, "question", e.target.value)}
              />
              <button
                type="button"
                className="remove-row-btn"
                onClick={() => removeQuestion(i)}
              >
                ✕
              </button>
            </div>
            <label className="question-required">
              <input
                type="checkbox"
                checked={q.required}
                onChange={(e) => updateQuestion(i, "required", e.target.checked)}
              />
              Required
            </label>
          </div>
        ))}
      </div>

      <button type="button" className="add-question-btn" onClick={addQuestion}>
        + Add a question
      </button>
    </div>
  );
};

// ─── STEP 5: Review ───────────────────────────────────────
const StepReview = ({ form }: { form: MeetingFormData }) => (
  <div>
    <div className="step-card-title">Review & Create</div>
    <div className="step-card-subtitle">Confirm your event type details</div>

    <div className="review-block">
      <div className="review-block-title">Basic Info</div>
      <div className="review-row">
        <span className="review-row-label">Type</span>
        <span className="review-row-value">
          {form.meetingType === "one-on-one" ? "One-on-One" : "Group"}
        </span>
      </div>
      <div className="review-row">
        <span className="review-row-label">Name</span>
        <span className="review-row-value">{form.title}</span>
      </div>
      <div className="review-row">
        <span className="review-row-label">Duration</span>
        <span className="review-row-value">{form.duration} minutes</span>
      </div>
      {form.location && (
        <div className="review-row">
          <span className="review-row-label">Location</span>
          <span className="review-row-value">{form.location}</span>
        </div>
      )}
      {form.description && (
        <div className="review-row">
          <span className="review-row-label">Description</span>
          <span className="review-row-value">{form.description}</span>
        </div>
      )}
    </div>

    <div className="review-block">
      <div className="review-block-title">Availability</div>
      <div style={{ padding: "10px 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {form.availability.map((a, i) => (
          <span className="avail-tag" key={i}>
            {a.day}: {a.startTime}–{a.endTime}
          </span>
        ))}
      </div>
    </div>

    {form.customQuestions.length > 0 && (
      <div className="review-block">
        <div className="review-block-title">Questions</div>
        {form.customQuestions.map((q, i) => (
          <div className="review-row" key={i}>
            <span className="review-row-label">Q{i + 1}</span>
            <span className="review-row-value">
              {q.question} {q.required && <em>(required)</em>}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────
const CreateMeetingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<MeetingFormData>({
    meetingType: "",
    title: "",
    duration: 30,
    description: "",
    location: "",
    availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
    customQuestions: [],
  });

  const setField = (key: keyof MeetingFormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canGoNext = (): boolean => {
    if (step === 1) return form.meetingType !== "";
    if (step === 2) return form.title.trim().length > 0;
    if (step === 3) return form.availability.length > 0;
    return true;
  };

 const handleSubmit = async () => {
  setSaving(true);
  setError("");
  try {
    const res = await meetingApi.createMeeting(form);
    if (res.success && res.meeting) {
      toast.success("Event type created!");
      navigate(`/book/${res.meeting.slug}`);
    }
  } catch {
    setError("Failed to create meeting. Please try again.");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="create-meeting-page">
      {/* Header */}
      <div className="create-meeting-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <span className="step-label">Step {step} of {TOTAL_STEPS}</span>
      </div>

      <div className="create-meeting-content">
        {/* Progress */}
        <div className="step-indicator">
          {[1, 2, 3, 4, 5].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`step-circle ${
                  s === step ? "active" : s < step ? "done" : ""
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {i < 4 && (
                <div className={`step-line ${s < step ? "done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-card">
          {step === 1 && (
            <StepType
              value={form.meetingType}
              onChange={(v) => setField("meetingType", v)}
            />
          )}
          {step === 2 && <StepDetails form={form} onChange={setField} />}
          {step === 3 && (
            <StepAvailability
              availability={form.availability}
              onChange={(a) => setField("availability", a)}
            />
          )}
          {step === 4 && (
            <StepQuestions
              questions={form.customQuestions}
              onChange={(q) => setField("customQuestions", q)}
            />
          )}
          {step === 5 && <StepReview form={form} />}

          {error && <p className="form-error">{error}</p>}

          {/* Navigation */}
          <div className="step-nav">
            {step > 1 ? (
              <button
                className="step-prev-btn"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                className="step-next-btn"
                onClick={() => setStep(step + 1)}
                disabled={!canGoNext()}
              >
                Continue →
              </button>
            ) : (
              <button
                className="step-next-btn"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Creating..." : "✓ Create Event"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetingPage;