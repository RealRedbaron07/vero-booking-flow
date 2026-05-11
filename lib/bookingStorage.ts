import type { Booking, BookingStatus } from "./types";

const STORAGE_KEY = "vero-booking-flow.bookings";
const BOOKING_CHANGE_EVENT = "vero-booking-flow:bookings-changed";
const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed"];
const TIME_ZONE = "America/Toronto";
const EMPTY_BOOKINGS: Booking[] = [];

type NewBookingInput = Omit<Booking, "id" | "status" | "createdAt">;

let cachedRawBookings: string | null = null;
let cachedBookings: Booking[] = EMPTY_BOOKINGS;

function hasLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isBookingStatus(value: unknown): value is BookingStatus {
  return value === "pending" || value === "confirmed" || value === "cancelled";
}

function isStoredBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") {
    return false;
  }

  const booking = value as Record<string, unknown>;

  return (
    typeof booking.id === "string" &&
    typeof booking.physicianId === "string" &&
    typeof booking.appointmentTime === "string" &&
    typeof booking.patientName === "string" &&
    typeof booking.patientEmail === "string" &&
    (typeof booking.patientPhone === "undefined" ||
      typeof booking.patientPhone === "string") &&
    typeof booking.reasonForVisit === "string" &&
    isBookingStatus(booking.status) &&
    typeof booking.createdAt === "string"
  );
}

function publishBookingChange() {
  window.dispatchEvent(new Event(BOOKING_CHANGE_EVENT));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getBookingsSnapshot(): Booking[] {
  if (!hasLocalStorage()) {
    return EMPTY_BOOKINGS;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue === cachedRawBookings) {
      return cachedBookings;
    }

    cachedRawBookings = storedValue;

    if (!storedValue) {
      cachedBookings = EMPTY_BOOKINGS;
      return cachedBookings;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      cachedBookings = EMPTY_BOOKINGS;
      return cachedBookings;
    }

    cachedBookings = parsedValue.filter(isStoredBooking);
    return cachedBookings;
  } catch {
    cachedRawBookings = null;
    cachedBookings = EMPTY_BOOKINGS;
    return cachedBookings;
  }
}

export function getBookings() {
  return getBookingsSnapshot();
}

export function getServerBookingsSnapshot() {
  return EMPTY_BOOKINGS;
}

export function saveBookings(bookings: Booking[]) {
  if (!hasLocalStorage()) {
    return;
  }

  cachedBookings = bookings;
  cachedRawBookings = JSON.stringify(bookings);
  window.localStorage.setItem(STORAGE_KEY, cachedRawBookings);
  publishBookingChange();
}

export function isActiveBooking(booking: Booking) {
  return ACTIVE_STATUSES.includes(booking.status);
}

export function isSlotBlocked(
  bookings: Booking[],
  physicianId: string,
  appointmentTime: string,
) {
  return bookings.some(
    (booking) =>
      booking.physicianId === physicianId &&
      booking.appointmentTime === appointmentTime &&
      isActiveBooking(booking),
  );
}

export function addBooking(input: NewBookingInput) {
  const currentBookings = getBookings();

  if (
    isSlotBlocked(currentBookings, input.physicianId, input.appointmentTime)
  ) {
    return {
      booking: null,
      bookings: currentBookings,
      conflict: true,
    };
  }

  const booking: Booking = {
    ...input,
    id: createId(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const nextBookings = [...currentBookings, booking];
  saveBookings(nextBookings);

  return {
    booking,
    bookings: nextBookings,
    conflict: false,
  };
}

export function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  const nextBookings = getBookings().map((booking) =>
    booking.id === bookingId ? { ...booking, status } : booking,
  );

  saveBookings(nextBookings);
  return nextBookings;
}

export function subscribeToBookingChanges(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BOOKING_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BOOKING_CHANGE_EVENT, listener);
  };
}

export function formatAppointmentDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

export function formatAppointmentTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

export function formatAppointmentDateTime(value: string) {
  return `${formatAppointmentDate(value)} at ${formatAppointmentTime(value)}`;
}

export function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}
