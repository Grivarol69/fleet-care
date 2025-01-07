import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  planId: z.number(),
  mantItemId: z.number(),
  triggerKm: z.number().min(0, "El kilometraje debe ser positivo"),
});

export type FormSchema = z.infer<typeof formSchema>;
