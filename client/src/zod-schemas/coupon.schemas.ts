import { z } from "zod";

export const CreateCouponSchema = z.object({
  name: z
    .string({ required_error: "Please enter coupon name" })
    .min(3, "Coupon name must be at least 3 characters"),
  code: z
    .string({ required_error: "Please enter coupon code" })
    .min(3, "Coupon code must be at least 3 characters"),
  discountPercent: z.coerce
    .number({ required_error: "Please enter coupon discount percent" })
    .min(1, "Discount percent must be at least 1")
    .max(100, "Discount percent must be at least 100"),
  expiry: z.date({ required_error: "Please enter coupon expiry date" }),
});
