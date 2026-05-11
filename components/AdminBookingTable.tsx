import {
  formatAppointmentDateTime,
  formatCreatedAt,
} from "@/lib/bookingStorage";
import type { Booking, BookingStatus, Physician } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

type AdminBookingTableProps = {
  bookings: Booking[];
  physicians: Physician[];
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
};

export function AdminBookingTable({
  bookings,
  physicians,
  onStatusChange,
}: AdminBookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        No bookings yet. Submitted patient requests will appear here.
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="booking-table">
        <thead>
          <tr>
            <th scope="col">Patient</th>
            <th scope="col">Physician</th>
            <th scope="col">Appointment</th>
            <th scope="col">Reason</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const physician = physicians.find(
              (item) => item.id === booking.physicianId,
            );

            return (
              <tr key={booking.id}>
                <td data-label="Patient">
                  <strong>{booking.patientName}</strong>
                  <span>{booking.patientEmail}</span>
                  {booking.patientPhone ? (
                    <span>{booking.patientPhone}</span>
                  ) : null}
                </td>
                <td data-label="Physician">{physician?.name ?? "Unknown"}</td>
                <td data-label="Appointment">
                  {formatAppointmentDateTime(booking.appointmentTime)}
                </td>
                <td data-label="Reason">{booking.reasonForVisit}</td>
                <td data-label="Status">
                  <StatusBadge status={booking.status} />
                </td>
                <td data-label="Created">
                  {formatCreatedAt(booking.createdAt)}
                </td>
                <td data-label="Actions">
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={booking.status !== "pending"}
                      onClick={() => onStatusChange(booking.id, "confirmed")}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      disabled={booking.status === "cancelled"}
                      onClick={() => onStatusChange(booking.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
