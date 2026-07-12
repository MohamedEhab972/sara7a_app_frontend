import { z } from "zod";

export const verifySchema = z.object({
  email: z.email("Invalid email address"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
