import { useState } from "react";
import { toast } from "sonner";
import { verifyResetOtp } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: (resetToken: string) => void;
}

export function useVerifyResetOtp({ onSuccess }: Options = {}) {
  const [loading, setLoading] = useState(false);

  async function verify(email: string, otp: string) {
    setLoading(true);
    try {
      const { data } = await verifyResetOtp(email, otp);
      onSuccess?.(data.resetToken);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { verify, loading };
}
