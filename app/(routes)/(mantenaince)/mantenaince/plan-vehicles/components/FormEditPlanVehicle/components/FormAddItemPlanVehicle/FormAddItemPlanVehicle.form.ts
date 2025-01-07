import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  vehicleMantPlanId: z.string(),
  mantItemId: z.number(),
  providerId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  cost: z
    .number()
    .min(0)
    .max(99999999.99)
    .transform((val) => Number(val.toFixed(2))), // Asegura 2 decimales
  actualDuration: z.number(),
  executionMileage: z.number(),
  notes: z.string(),
  state: z.string(),
});
