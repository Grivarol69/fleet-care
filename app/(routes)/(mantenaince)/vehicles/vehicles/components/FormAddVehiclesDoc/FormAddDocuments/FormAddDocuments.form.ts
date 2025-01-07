import { z } from "zod";

export const formSchema = z.object({
  type: z.enum(["SOAT", "TECNOMECANICA", "POLIZA", "OTRO"]),
  fileName: z.string().min(1, "El nombre del archivo es requerido"),
  fileUrl: z.string().url("La URL del archivo debe ser válida"),
  uploadDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fecha de expiración debe ser válida",
    }),
  expiryDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fecha de expiración debe ser válida",
    }),
  insurance: z.string().optional(),
});
