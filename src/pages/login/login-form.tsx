import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useLogin } from "@/hooks/use-login";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { loginSchema, type LoginFormData } from "./login.schema";

interface LoginFormProps {
  disabled?: boolean;
  onSuccess: () => void;
}

export function LoginForm({ disabled, onSuccess }: LoginFormProps) {
  const { login, loading } = useLogin({ onSuccess });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const isDisabled = loading || disabled;

  return (
    <form
      onSubmit={handleSubmit((data) => login(data.email, data.password))}
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
          disabled={isDisabled}
          placeholder="you@example.com"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          disabled={isDisabled}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="submit" className="w-full" disabled={isDisabled}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </motion.div>
    </form>
  );
}
