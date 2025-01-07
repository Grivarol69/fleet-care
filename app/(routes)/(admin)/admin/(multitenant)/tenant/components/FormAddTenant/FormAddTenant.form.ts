import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(10, {
    message: "El nombre al menos debe tener al menos 10 caractéres",
  }),
  photo: z.string(),
  domain: z.string(),
  rut_nit: z.string(),
});
