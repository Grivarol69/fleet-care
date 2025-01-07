import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  planId: z.number(),
  mantItemId: z.number(),
  triggerKm: z.number(),
});
