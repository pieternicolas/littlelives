import { z } from "zod";

export const DURATION_LIMITS = [15, 30, 45, 60, 90];

export const TIMESLOTS_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

const START = 7; // 7AM
const END = 19; // 7PM
export const START_TIMES = Array.from(
  { length: END - START + 1 },
  (_, i) => START + i
);

export const timeslotFormSchema = z
  .object({
    enabled: z.boolean().optional(),
    startTimes: z.array(z.string()).optional(),
  })
  .optional();

export const settingsFormSchema = z.object({
  visitDuration: z.coerce.number({
    required_error: "Visit duration is required.",
    invalid_type_error: "Visit duration is required.",
  }),
  numberOfBookingSlots: z.number().min(1).max(99),
  allowVideoTourCall: z.boolean().optional(),
  timeslots: z.object({
    mon: timeslotFormSchema,
    tue: timeslotFormSchema,
    wed: timeslotFormSchema,
    thu: timeslotFormSchema,
    fri: timeslotFormSchema,
    sat: timeslotFormSchema,
    sun: timeslotFormSchema,
  }),
});
