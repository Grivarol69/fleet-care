import { z } from "zod";

export const formSchema = z.object({
  modelVehicleId: z.number(),
  photo: z.string(),
  licensePlate: z.string(),
  typePlate: z.string(),
  mileage: z.number(),
  color: z.string(),
  owner: z.string(),
  year: z.number(),
  situation: z.string(),
});
