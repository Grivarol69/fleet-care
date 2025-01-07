import { z } from "zod";

export const formSchema = z.object({
  tenantId: z.string(),
  vehiclePlate: z.string(),
  maintenanceType: z.string(),
  priority: z.string(),
  creationDate: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  plannedAmount: z
    .number()
    .min(0)
    .max(99999999.99)
    .transform((val) => Number(val.toFixed(2))), // Asegura 2 decimales,
  realAmount: z
    .number()
    .min(0)
    .max(99999999.99)
    .transform((val) => Number(val.toFixed(2))), // Asegura 2 decimales,
  otstatus: z.string(),
  creationMileage: z.number(),
  technicianId: z.number(),
  providerId: z.number(),
  remarks: z.string(),
  status: z.string(),
});
