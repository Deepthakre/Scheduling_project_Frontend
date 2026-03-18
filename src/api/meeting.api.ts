// frontend/src/api/meeting.api.ts

import api from "./axios";
import { IMeeting, IBooking, MeetingFormData } from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const meetingApi = {

  // ─── PROTECTED ────────────────────────────────────────


createMeeting: async (data: MeetingFormData) => {
  const res = await api.post("/meetings", data);
  return res.data;
},

  // Meri saari meetings lao
  getMyMeetings: async () => {
  const res = await api.get("/meetings");
  return res.data;
},

  // Single meeting by ID
  getMeetingById: async (id: string) => {
    const res = await api.get<ApiResponse<{ meeting: IMeeting }>>(
      `/meetings/${id}`
    );
    return res.data;
  },

  // Meeting delete karo
  deleteMeeting: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/meetings/${id}`);
    return res.data;
  },

  // Meeting ki bookings lao
  getMeetingBookings: async (id: string) => {
    const res = await api.get<ApiResponse<{ bookings: IBooking[] }>>(
      `/meetings/${id}/bookings`
    );
    return res.data;
  },

  // ─── PUBLIC ───────────────────────────────────────────

  // Slug se public meeting lao
  getPublicMeeting: async (slug: string) => {
  const res = await api.get(`/meetings/public/${slug}`);
  return res.data;
},

getAvailableSlots: async (slug: string, date: string) => {
  const res = await api.get(`/meetings/public/${slug}/slots?date=${date}`);
  return res.data;
},

  // Booking confirm karo
  createBooking: async (data: {
    meetingSlug: string;
    guestName: string;
    guestEmail: string;
    selectedDate: string;
    selectedTime: string;
    customAnswers: { question: string; answer: string }[];
  }) => {
    const res = await api.post<ApiResponse<{ booking: IBooking }>>(
      "/bookings",
      data
    );
    return res.data;
  },
};