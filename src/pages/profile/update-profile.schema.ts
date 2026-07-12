import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
    email: z.email("Invalid email address").or(z.literal("")),
    uniqueAccName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed")
      .or(z.literal("")),
    password: z.string().min(6, "Must be at least 6 characters").or(z.literal("")),
    newPassword: z.string().min(6, "Must be at least 6 characters").or(z.literal("")),
  })
  .refine(
    (data) => {
      const hasOld = data.password !== "";
      const hasNew = data.newPassword !== "";
      if (hasOld !== hasNew) return false;
      return true;
    },
    {
      message: "Both current and new password are required to change password",
      path: ["newPassword"],
    },
  );

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
