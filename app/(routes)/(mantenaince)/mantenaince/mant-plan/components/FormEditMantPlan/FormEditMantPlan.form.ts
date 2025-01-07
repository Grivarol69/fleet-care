import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  tenantId: z.string(),
  description: z.string(),
  vehicleBrandId: z.number(),
  vehicleLineId: z.number(),
  status: z.string(),
});
