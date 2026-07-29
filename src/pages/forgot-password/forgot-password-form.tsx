import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "./forgot-password.schema";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { requestReset, loading } = useForgotPassword({
    onSuccess: () => onSuccess(getValues("email")),
  });

  return (
    <form onSubmit={handleSubmit((data) => requestReset(data.email))} className="flex flex-col gap-4">

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          disabled={loading}
          placeholder="you@example.com"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </motion.div>
    </form>
  );
}
