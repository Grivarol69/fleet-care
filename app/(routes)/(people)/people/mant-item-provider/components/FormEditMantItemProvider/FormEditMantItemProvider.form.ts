import { z } from "zod";

export const formSchema = z.object({
  mantItemId: z.number(),
  providerId: z.number(),
  priority: z.number(),
  status: z.string(),
});
