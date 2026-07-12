import { z } from "zod";

export const publicMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Write something before sending")
    .max(500, "Keep it under 500 characters"),
});

export type PublicMessageFormData = z.infer<typeof publicMessageSchema>;
