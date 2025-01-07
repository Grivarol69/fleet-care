import { z } from "zod";

export const formSchema = z.object({
  tenantId: z.string(),
  name: z.string().min(10, {
    message: "El nombre al menos debe tener al menos 10 caractéres",
  }),
  rut_nit: z.string(),
  specialty: z.string(),
  contact_info: z.string(),
});
