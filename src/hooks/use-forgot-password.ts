import { useState } from "react";
import { toast } from "sonner";
import { forgotPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: () => void;
}

export function useForgotPassword({ onSuccess }: Options = {}) {
  const [loading, setLoading] = useState(false);

  async function requestReset(email: string) {
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("OTP sent to your email");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { requestReset, loading };
}
