"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  addBooking,
  getBookingsSnapshot,
  getServerBookingsSnapshot,
  isSlotBlocked,
  subscribeToBookingChanges,
} from "@/lib/bookingStorage";
import { physicians } from "@/lib/mockData";
import type { Booking } from "@/lib/types";
import {
  BookingForm,
  type BookingFormErrors,
  type BookingFormValues,
} from "./BookingForm";
import { BookingSummary } from "./BookingSummary";
import { PhysicianCard } from "./PhysicianCard";
import { TimeSlotPicker } from "./TimeSlotPicker";

const initialFormValues: BookingFormValues = {
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  reasonForVisit: "",
};

function validateForm(values: BookingFormValues) {
  const errors: BookingFormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.patientName.trim()) {
    errors.patientName = "Enter the patient's full name.";
  }

  if (!values.patientEmail.trim()) {
    errors.patientEmail = "Enter an email address.";
  } else if (!emailPattern.test(values.patientEmail.trim())) {
    errors.patientEmail = "Enter a valid email address.";
  }

  if (!values.reasonForVisit.trim()) {
    errors.reasonForVisit = "Enter a brief reason for the visit.";
  }

  return errors;
}

export function PatientBookingFlow() {
  const bookings = useSyncExternalStore(
    subscribeToBookingChanges,
    getBookingsSnapshot,
    getServerBookingsSnapshot,
  );
  const [selectedPhysicianId, setSelectedPhysicianId] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formValues, setFormValues] =
    useState<BookingFormValues>(initialFormValues);
  const [formErrors, setFormErrors] = useState<BookingFormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const selectedPhysician = useMemo(
    () => physicians.find((physician) => physician.id === selectedPhysicianId),
    [selectedPhysicianId],
  );

  const selectedSlotIsBlocked = Boolean(
    selectedPhysician &&
      selectedTime &&
      isSlotBlocked(bookings, selectedPhysician.id, selectedTime),
  );

  const canSubmit = Boolean(
    selectedPhysician && selectedTime && !selectedSlotIsBlocked,
  );

  function handlePhysicianSelect(physicianId: string) {
    setSelectedPhysicianId(physicianId);
    setSelectedTime("");
    setSubmissionError("");
  }

  function handleFormChange(field: keyof BookingFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmissionError("");

    const nextErrors = validateForm(formValues);
    setFormErrors(nextErrors);

    if (!selectedPhysician || !selectedTime || Object.keys(nextErrors).length) {
      return;
    }

    const result = addBooking({
      physicianId: selectedPhysician.id,
      appointmentTime: selectedTime,
      patientName: formValues.patientName.trim(),
      patientEmail: formValues.patientEmail.trim(),
      patientPhone: formValues.patientPhone.trim() || undefined,
      reasonForVisit: formValues.reasonForVisit.trim(),
    });

    if (result.conflict || !result.booking) {
      setSubmissionError(
        "That appointment time was just taken. Choose another available time.",
      );
      setSelectedTime("");
      return;
    }

    setConfirmation(result.booking);
    setFormValues(initialFormValues);
    setFormErrors({});
    setSubmitAttempted(false);
    setSelectedTime("");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Vero work sample</p>
          <h1>Book an Appointment</h1>
          <p>
            Request a visit with an available physician. The clinic can confirm
            or cancel the request from the admin view.
          </p>
        </div>
        <Link className="nav-link" href="/admin">
          Admin view
        </Link>
      </header>

      <div className="flow-grid">
        <div className="flow-stack">
          <section className="panel">
            <div className="section-heading">
              <p className="step-label">Step 1</p>
              <h2>Choose a physician</h2>
            </div>
            <div className="physician-grid">
              {physicians.map((physician) => (
                <PhysicianCard
                  key={physician.id}
                  physician={physician}
                  isSelected={selectedPhysicianId === physician.id}
                  onSelect={handlePhysicianSelect}
                />
              ))}
            </div>
            {submitAttempted && !selectedPhysician ? (
              <p className="field-error" role="alert">
                Select a physician.
              </p>
            ) : null}
          </section>

          <section className="panel">
            <div className="section-heading">
              <p className="step-label">Step 2</p>
              <h2>Select an appointment time</h2>
            </div>
            <TimeSlotPicker
              physician={selectedPhysician}
              bookings={bookings}
              selectedTime={selectedTime}
              showError={
                submitAttempted && selectedPhysicianId !== "" && !selectedTime
              }
              onSelect={(appointmentTime) => {
                setSelectedTime(appointmentTime);
                setSubmissionError("");
              }}
            />
            {submissionError ? (
              <p className="field-error" role="alert">
                {submissionError}
              </p>
            ) : null}
          </section>

          <section className="panel">
            <div className="section-heading">
              <p className="step-label">Step 3</p>
              <h2>Patient details</h2>
            </div>
            <BookingForm
              values={formValues}
              errors={formErrors}
              canSubmit={canSubmit}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
            />
          </section>
        </div>

        <aside className="sidebar" aria-label="Booking status">
          {confirmation ? (
            <BookingSummary booking={confirmation} />
          ) : (
            <section className="summary-card summary-card--muted">
              <div className="section-heading section-heading--compact">
                <p className="eyebrow">Booking request</p>
                <h2>Pending review after submission</h2>
              </div>
              <p>
                Submitted requests are saved locally and appear in the admin
                view for status updates.
              </p>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
