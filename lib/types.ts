export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type AppointmentSlot = {
  id: string;
  physicianId: string;
  startTime: string;
};

export type Physician = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  description: string;
  availability: AppointmentSlot[];
};

export type Booking = {
  id: string;
  physicianId: string;
  appointmentTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  reasonForVisit: string;
  status: BookingStatus;
  createdAt: string;
};
