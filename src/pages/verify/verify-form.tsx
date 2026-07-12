import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useVerify } from "@/hooks/use-verify";
import { Button } from "@/components/ui/button";
import { verifySchema, type VerifyFormData } from "./verify.schema";

interface VerifyFormProps {
  defaultEmail?: string;
  onSuccess: () => void;
}

export function VerifyForm({ defaultEmail, onSuccess }: VerifyFormProps) {
  const { verify, loading } = useVerify({ onSuccess });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: defaultEmail ?? "" },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => verify(data.email, data.otp))}
      className="flex flex-col gap-4"
    >
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="otp" className="text-sm font-medium">
          OTP Code
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          disabled={loading}
          placeholder="123456"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-center font-mono text-lg tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("otp")}
        />
        {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify email"}
        </Button>
      </motion.div>
    </form>
  );
}
