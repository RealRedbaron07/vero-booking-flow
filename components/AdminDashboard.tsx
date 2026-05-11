"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getBookingsSnapshot,
  getServerBookingsSnapshot,
  subscribeToBookingChanges,
  updateBookingStatus,
} from "@/lib/bookingStorage";
import { physicians } from "@/lib/mockData";
import type { BookingStatus } from "@/lib/types";
import { AppHeader } from "./AppHeader";
import { AdminBookingTable } from "./AdminBookingTable";

export function AdminDashboard() {
  const bookings = useSyncExternalStore(
    subscribeToBookingChanges,
    getBookingsSnapshot,
    getServerBookingsSnapshot,
  );

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort((first, second) => {
        const appointmentDifference =
          new Date(first.appointmentTime).getTime() -
          new Date(second.appointmentTime).getTime();

        if (appointmentDifference !== 0) {
          return appointmentDifference;
        }

        return (
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime()
        );
      }),
    [bookings],
  );

  const counts = useMemo(
    () => ({
      pending: bookings.filter((booking) => booking.status === "pending")
        .length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed")
        .length,
      cancelled: bookings.filter((booking) => booking.status === "cancelled")
        .length,
    }),
    [bookings],
  );

  function handleStatusChange(bookingId: string, status: BookingStatus) {
    updateBookingStatus(bookingId, status);
  }

  return (
    <main className="app-shell">
      <AppHeader currentPage="admin" />

      <section className="page-hero">
        <div className="page-header">
          <p className="eyebrow">Physician/admin view</p>
          <h1>Upcoming Bookings</h1>
          <p>
            Review patient requests, confirm appointment times, or cancel a
            booking when it should no longer hold a slot.
          </p>
        </div>
        <p className="demo-note">
          Demo data only: booking records are stored in this browser for local
          review.
        </p>
      </section>

      <section className="metric-grid" aria-label="Booking status summary">
        <div className="metric-card">
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </div>
        <div className="metric-card">
          <span>Confirmed</span>
          <strong>{counts.confirmed}</strong>
        </div>
        <div className="metric-card">
          <span>Cancelled</span>
          <strong>{counts.cancelled}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="step-label">Schedule</p>
          <h2>Bookings</h2>
        </div>
        <AdminBookingTable
          bookings={sortedBookings}
          physicians={physicians}
          onStatusChange={handleStatusChange}
        />
      </section>
    </main>
  );
}
