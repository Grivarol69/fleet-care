import { z } from "zod";

export const formSchema = z.object({
  vehiclePlate: z.string().min(1, "La placa del vehículo es requerida"),
  kilometers: z.number(),
  recordedAt: z.date(),
});
