import { z } from "zod";

export const replySchema = z.object({
  content: z.string().trim().min(1, "Write something before sending"),
});

export type ReplyFormData = z.infer<typeof replySchema>;
