//MOCK DATA

import { addDays, setHours, setMinutes, startOfDay } from "date-fns";

//physician roster 
export const physicians = [
  {
    id: "dr-chen",
    name: "Dr. Madeleine Chen",
    specialty: "Internal Medicine",
    bio: "Board-certified with 12 years of experience in preventive care and chronic disease management.",
    avatar: "MC",
    color: "#2a9e5c",
    acceptingNew: true,
  },
  {
    id: "dr-okafor",
    name: "Dr. Isabella Okafor",
    specialty: "Family Medicine",
    bio: "Family physician focused on care for patients of all ages. Fluent in English and French.",
    avatar: "IO",
    color: "#3B82C4",
    acceptingNew: true,
  },
  {
    id: "dr-gomez",
    name: "Dr. Sarah Gomez",
    specialty: "Cardiology",
    bio: "Cardiologist specializing in heart failure, arrhythmia, and preventive cardiac care.",
    avatar: "SG",
    color: "#A66BC4",
    acceptingNew: true,
  },
  {
    id: "dr-patel",
    name: "Dr. Neel Patel",
    specialty: "Dermatology",
    bio: "Dermatologist with expertise in medical and cosmetic dermatology, skin cancer screening, and acne treatment.",
    avatar: "NP",
    color: "#E8705A",
    acceptingNew: false, //intentionally closed to demonstrate UI handling of unavailable physicians
  },
];

/* generates a realistic set of available appointment slots for a physician
over the next 14 days (weekdays only).

We randomly drop 30% of slots to simulate a somewhat booked calendar.
Slots start from tomorrow which is a deliberate product decision to give staff time to prepare.
 */
const generateSlots = (physicianId) => {
  const slots = [];
  const today = startOfDay(new Date());

  const times = [
    { h: 9,  m: 0  },
    { h: 9,  m: 30 },
    { h: 10, m: 0  },
    { h: 10, m: 30 },
    { h: 11, m: 0  },
    { h: 13, m: 0  },
    { h: 13, m: 30 },
    { h: 14, m: 0  },
    { h: 14, m: 30 },
    { h: 15, m: 0  },
    { h: 15, m: 30 },
    { h: 16, m: 0  },
  ];

  let slotId = 1;
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = addDays(today, dayOffset);
    const dow = date.getDay();

    //skip weekends - assume clinic runs mon-fri
    if (dow === 0||dow === 6) continue;

    //randomly remove 30% of slots to simulate  partial availability
    const available = times.filter(() => Math.random() > 0.3);

    available.forEach(({ h, m }) => {
      const dt = setMinutes(setHours(date, h), m);
      slots.push({
        id: `${physicianId}-slot-${slotId++}`,
        physicianId,
        datetime: dt.toISOString(),
      });
    });
  }

  return slots;
};

//pre-generate all slots at  startup so every component shares the same data
export const allSlots = physicians.flatMap((p) => generateSlots(p.id));

/*
Visit reasons shown in the booking form dropdown. 
"Other" is always last and triggers a free-text input in the UI,so the physician knows 
what they're dealing with
 
 */
export const visitReasons = [
  "Annual physical/wellness exam",
  "Sick visit/acute illness",
  "Follow-up appointment",
  "Prescription refill",
  "Lab results review",
  "Mental health concern",
  "Chronic condition management",
  "Referral consultation",
  "Preventive screening",
  "Other",
];
