import { useState } from "react";
import { toast } from "sonner";
import { verifyAccount } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: () => void;
}

export function useVerify({ onSuccess }: Options = {}) {
  const [loading, setLoading] = useState(false);

  async function verify(email: string, otp: string) {
    setLoading(true);
    try {
      await verifyAccount(email, otp);
      toast.success("Email verified! You can now sign in.");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { verify, loading };
}
