import { formatAppointmentDateTime } from "@/lib/bookingStorage";
import { getPhysicianById } from "@/lib/mockData";
import type { Booking } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

type BookingSummaryProps = {
  booking: Booking;
};

export function BookingSummary({ booking }: BookingSummaryProps) {
  const physician = getPhysicianById(booking.physicianId);

  return (
    <section className="summary-card" aria-live="polite">
      <div className="section-heading section-heading--compact">
        <p className="eyebrow">Request received</p>
        <h2>Appointment Summary</h2>
      </div>
      <dl className="summary-list">
        <div>
          <dt>Patient</dt>
          <dd>{booking.patientName}</dd>
        </div>
        <div>
          <dt>Physician</dt>
          <dd>{physician?.name ?? "Unknown physician"}</dd>
        </div>
        <div>
          <dt>Appointment</dt>
          <dd>{formatAppointmentDateTime(booking.appointmentTime)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={booking.status} />
          </dd>
        </div>
      </dl>
      <p className="summary-note">
        This request is awaiting confirmation from the clinic team.
      </p>
    </section>
  );
}
