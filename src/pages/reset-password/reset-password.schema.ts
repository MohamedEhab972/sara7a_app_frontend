import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
