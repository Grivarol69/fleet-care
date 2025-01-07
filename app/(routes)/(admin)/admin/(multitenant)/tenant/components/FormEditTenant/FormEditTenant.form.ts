import { z } from "zod";

export const formSchema = z.object({
  id: z.string(),
  name: z.string().min(5, {
    message: "El nombre al menos debe tener al menos 5 caractéres",
  }),
  domain: z.string(),
  photo: z.string(),
  rut_nit: z.string(),
});
