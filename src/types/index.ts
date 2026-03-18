export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { msg: string; path: string }[];
}

// --- Existing types ke NEECHE add karo ---

export interface IAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ICustomQuestion {
  question: string;
  required: boolean;
}

export interface IMeeting {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  title: string;
  meetingType: "one-on-one" | "group";
  duration: number;
  description?: string;
  location?: string;
  availability: IAvailability[];
  customQuestions: ICustomQuestion[];
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export interface IBooking {
  _id: string;
  meetingId: string;
  guestName: string;
  guestEmail: string;
  selectedDate: string;
  selectedTime: string;
  customAnswers: { question: string; answer: string }[];
  status: "confirmed" | "cancelled";
  createdAt: string;
}

// Create meeting form ka state
export interface MeetingFormData {
  meetingType: "one-on-one" | "group" | "";
  title: string;
  duration: number;
  description: string;
  location: string;
  availability: IAvailability[];
  customQuestions: ICustomQuestion[];
}