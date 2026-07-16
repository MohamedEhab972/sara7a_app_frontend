import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { replySchema, type ReplyFormData } from "./reply.schema";

interface ReplyFormProps {
  defaultContent?: string;
  submitting?: boolean;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export function ReplyForm({ defaultContent, submitting, onSubmit, onCancel }: ReplyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: { content: defaultContent ?? "" },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.content))}
      className="mt-3 flex flex-col gap-1.5"
    >
      <textarea
        rows={2}
        disabled={submitting}
        placeholder="Write a reply..."
        className="resize-none rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        {...register("content")}
      />
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
