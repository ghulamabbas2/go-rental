import { z } from "zod";

export const NewUpdateCarSchema = z.object({
  name: z
    .string({ required_error: "Please enter car name" })
    .min(5, "Name must be at least 5 characters"),
  rentPerDay: z.coerce
    .number({
      invalid_type_error: "Please enter car rent per day",
    })
    .positive(),
  description: z
    .string({ required_error: "Please enter car description" })
    .min(10, "Name must be at least 10 characters"),
  address: z.string({ required_error: "Please enter car address" }),
  milleage: z.coerce
    .number({
      invalid_type_error: "Please enter car milleage",
    })
    .positive(),
  power: z.coerce
    .number({
      invalid_type_error: "Please enter car power",
    })
    .positive(),
  year: z.coerce
    .number({
      invalid_type_error: "Please enter car year",
    })
    .positive(),

  brand: z.string({ required_error: "Please select car brand" }),
  transmission: z.string({ required_error: "Please select car transmission" }),
  fuelType: z.string({ required_error: "Please select car fuel type" }),
  category: z.string({ required_error: "Please select car category" }),
  seats: z.string({ required_error: "Please select car seats" }),
  doors: z.string({ required_error: "Please select car doors" }),
  status: z.string().optional(),
});
