import {
  formatAppointmentDate,
  formatAppointmentTime,
  isSlotBlocked,
} from "@/lib/bookingStorage";
import type { Booking, Physician } from "@/lib/types";

type TimeSlotPickerProps = {
  physician?: Physician;
  bookings: Booking[];
  selectedTime: string;
  showError: boolean;
  onSelect: (appointmentTime: string) => void;
};

export function TimeSlotPicker({
  physician,
  bookings,
  selectedTime,
  showError,
  onSelect,
}: TimeSlotPickerProps) {
  if (!physician) {
    return (
      <div className="empty-state empty-state--compact">
        Choose a physician to view appointment times.
      </div>
    );
  }

  return (
    <>
      <div className="slot-grid" role="list">
        {physician.availability.map((slot) => {
          const isBlocked = isSlotBlocked(
            bookings,
            physician.id,
            slot.startTime,
          );
          const isSelected = selectedTime === slot.startTime;

          return (
            <button
              key={slot.id}
              type="button"
              className={`slot-button ${isSelected ? "slot-button--selected" : ""}`}
              disabled={isBlocked}
              aria-pressed={isSelected}
              onClick={() => onSelect(slot.startTime)}
            >
              <span>{formatAppointmentDate(slot.startTime)}</span>
              <strong>{formatAppointmentTime(slot.startTime)}</strong>
              <small>{isBlocked ? "Unavailable" : "Available"}</small>
            </button>
          );
        })}
      </div>
      {showError ? (
        <p className="field-error" role="alert">
          Select an available appointment time.
        </p>
      ) : null}
    </>
  );
}
