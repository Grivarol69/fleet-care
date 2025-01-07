import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(5, {
    message: "El nombre al menos debe tener al menos 5 caractéres",
  }),
  description: z.string(),
});
