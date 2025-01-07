import { z } from "zod";

export const formSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  vehicleBrandId: z.number().min(1, "Debe seleccionar una marca"),
  vehicleLineId: z.number().min(1, "Debe seleccionar una línea"),
  tenantId: z.string(),
  brand: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
  line: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
  status: z.string().optional().default("ACTIVE"),
});
