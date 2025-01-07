import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  description: z.string().min(2, {
    message: "La descripción al menos debe tener 2 caractéres",
  }),
  mant_type: z.string(),
  estimated_time: z.number(),

  idCategory: z.number(),
});
