import { z } from "zod";

export const formSchema = z.object({
  tenantId: z.string(),
  vehiclePlate: z.string(),
  mantPlanId: z.number(),
  assignedAt: z.date(),
  completedKm: z.number(),
  status: z.string(),
  lastKmCheck: z.number(),
});
