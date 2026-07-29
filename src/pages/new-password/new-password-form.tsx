import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useSetNewPassword } from "@/hooks/use-set-new-password";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { newPasswordSchema, type NewPasswordFormData } from "./new-password.schema";

interface NewPasswordFormProps {
  resetToken: string;
  onSuccess: () => void;
}

export function NewPasswordForm({ resetToken, onSuccess }: NewPasswordFormProps) {
  const { setNewPassword, loading } = useSetNewPassword({ onSuccess });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => setNewPassword(resetToken, data.newPassword))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className="text-sm font-medium">
          New password
        </label>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          disabled={loading}
          placeholder="••••••••"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm new password
        </label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          disabled={loading}
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </Button>
      </motion.div>
    </form>
  );
}
