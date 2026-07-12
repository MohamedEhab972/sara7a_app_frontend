import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { ImagePlus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicMessageSchema, type PublicMessageFormData } from "./send-message.schema";

interface SendMessageFormProps {
  onSubmit: (data: PublicMessageFormData, image?: File) => void;
  loading: boolean;
}

export function SendMessageForm({ onSubmit, loading }: SendMessageFormProps) {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PublicMessageFormData>({
    resolver: zodResolver(publicMessageSchema),
    defaultValues: { content: "" },
  });

  const content = watch("content") ?? "";

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(undefined);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, imageFile))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <textarea
          rows={5}
          disabled={loading}
          placeholder="Say something anonymously..."
          maxLength={500}
          className="resize-none rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("content")}
        />
        <div className="flex items-center justify-between">
          {errors.content ? (
            <p className="text-xs text-destructive">{errors.content.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary disabled:opacity-50"
        >
          <ImagePlus className="size-4" />
          {imagePreview ? "Change image" : "Attach an image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <img src={imagePreview} alt="Attachment preview" className="size-10 rounded-lg object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
              aria-label="Remove image"
            >
              <X className="size-2.5" />
            </button>
          </motion.div>
        )}
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="submit" disabled={loading} className="w-full">
          <Send className="size-4" />
          {loading ? "Sending..." : "Send anonymously"}
        </Button>
      </motion.div>
    </form>
  );
}
