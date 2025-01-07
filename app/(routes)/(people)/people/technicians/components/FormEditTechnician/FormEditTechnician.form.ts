import { z } from "zod";

export const formSchema = z.object({
  tenantId: z.string(),
  id: z.number(),
  name: z.string().min(10, {
    message: "El nombre al menos debe tener al menos 10 caractéres",
  }),
  specialty: z.string(),
  contact_info: z.string(),
  photo: z.string(),
});
