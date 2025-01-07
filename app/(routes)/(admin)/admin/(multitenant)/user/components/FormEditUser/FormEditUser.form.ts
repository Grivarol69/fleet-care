import { z } from "zod";

export const formSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(5, {
    message: "El nombre al menos debe tener al menos 5 caractéres",
  }),
  lastName: z.string().min(5, {
    message: "El apellido al menos debe tener al menos 5 caractéres",
  }),
});
