import type { Physician } from "./types";

export const physicians: Physician[] = [
  {
    id: "emily-chen",
    name: "Dr. Emily Chen",
    specialty: "Family Medicine",
    location: "Toronto Clinic",
    description:
      "Primary care for adults and families, including preventive visits and new concerns.",
    availability: [
      {
        id: "emily-chen-2026-05-14-0900",
        physicianId: "emily-chen",
        startTime: "2026-05-14T09:00:00-04:00",
      },
      {
        id: "emily-chen-2026-05-14-1030",
        physicianId: "emily-chen",
        startTime: "2026-05-14T10:30:00-04:00",
      },
      {
        id: "emily-chen-2026-05-15-1300",
        physicianId: "emily-chen",
        startTime: "2026-05-15T13:00:00-04:00",
      },
      {
        id: "emily-chen-2026-05-16-0945",
        physicianId: "emily-chen",
        startTime: "2026-05-16T09:45:00-04:00",
      },
    ],
  },
  {
    id: "arjun-patel",
    name: "Dr. Arjun Patel",
    specialty: "Internal Medicine",
    location: "Downtown Care Centre",
    description:
      "Complex adult care, chronic condition follow-up, and medication reviews.",
    availability: [
      {
        id: "arjun-patel-2026-05-14-1130",
        physicianId: "arjun-patel",
        startTime: "2026-05-14T11:30:00-04:00",
      },
      {
        id: "arjun-patel-2026-05-15-0900",
        physicianId: "arjun-patel",
        startTime: "2026-05-15T09:00:00-04:00",
      },
      {
        id: "arjun-patel-2026-05-15-1415",
        physicianId: "arjun-patel",
        startTime: "2026-05-15T14:15:00-04:00",
      },
      {
        id: "arjun-patel-2026-05-16-1115",
        physicianId: "arjun-patel",
        startTime: "2026-05-16T11:15:00-04:00",
      },
    ],
  },
  {
    id: "sarah-roberts",
    name: "Dr. Sarah Roberts",
    specialty: "Pediatrics",
    location: "North York Clinic",
    description:
      "Care for children and adolescents, including wellness checks and acute visits.",
    availability: [
      {
        id: "sarah-roberts-2026-05-14-1330",
        physicianId: "sarah-roberts",
        startTime: "2026-05-14T13:30:00-04:00",
      },
      {
        id: "sarah-roberts-2026-05-15-1000",
        physicianId: "sarah-roberts",
        startTime: "2026-05-15T10:00:00-04:00",
      },
      {
        id: "sarah-roberts-2026-05-16-0900",
        physicianId: "sarah-roberts",
        startTime: "2026-05-16T09:00:00-04:00",
      },
      {
        id: "sarah-roberts-2026-05-16-1230",
        physicianId: "sarah-roberts",
        startTime: "2026-05-16T12:30:00-04:00",
      },
    ],
  },
];

export function getPhysicianById(physicianId: string) {
  return physicians.find((physician) => physician.id === physicianId);
}
