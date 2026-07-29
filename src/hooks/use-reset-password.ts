import { useState } from "react";
import { toast } from "sonner";
import { verifyResetOtp, resetPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: () => void;
}

export function useResetPassword({ onSuccess }: Options = {}) {
  const [loading, setLoading] = useState(false);

  async function reset(email: string, otp: string, newPassword: string) {
    setLoading(true);
    try {
      const { data } = await verifyResetOtp(email, otp);
      await resetPassword(data.resetToken, newPassword);
      toast.success("Password updated successfully");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { reset, loading };
}
