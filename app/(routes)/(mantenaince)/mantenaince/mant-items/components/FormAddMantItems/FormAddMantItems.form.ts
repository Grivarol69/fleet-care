import { z } from "zod";

export const formSchema = z.object({
  tenantId: z.string(),
  description: z.string().min(1, "La descripción es requerida"),
  mant_type: z.string().min(1, "El tipo de mantenimiento es requerido"),
  estimated_time: z
    .number()
    .min(0, "El tiempo estimado debe ser mayor o igual a 0")
    .max(999.99, "El tiempo estimado no puede ser mayor a 999.99 horas")
    .transform((val) => Number(val.toFixed(2))), // Asegura 2 decimales
  idCategory: z.number().min(1, "Debe seleccionar una categoría"),
});
