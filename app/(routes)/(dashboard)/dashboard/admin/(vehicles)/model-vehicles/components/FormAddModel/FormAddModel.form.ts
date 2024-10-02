import { z } from "zod";

export const formSchema = z.object({
  brandId: z.number(),
  lineId: z.number(),
  typeId: z.number(),
  year: z.number(),
  engine: z.string().min(2).max(20),
  wheels: z.number(),
});
