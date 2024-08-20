import { z } from "zod";

export const RegisterUserSchema = z.object({
  name: z
    .string({ required_error: "Please enter name" })
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ required_error: "Please enter email" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Please enter password" })
    .min(6, "Password must be at least 6 characters"),
  phoneNo: z
    .string({ required_error: "Please enter phone no" })
    .refine(
      (value) => /^\d{10}$/.test(value),
      "Please enter a valid phone no. Example: 1234567890"
    ),
});

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Please enter email" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Please enter password" })
    .min(6, "Password must be at least 6 characters"),
});
