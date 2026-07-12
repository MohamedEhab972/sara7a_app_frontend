import { useState } from "react";
import { toast } from "sonner";
import { registerUser } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: (email: string) => void;
}

export function useRegister({ onSuccess }: Options = {}) {
  const [loading, setLoading] = useState(false);

  async function register(
    fields: { name: string; email: string; password: string; uniqueAccName: string; phone?: string },
    image?: File,
  ) {
    setLoading(true);
    try {
      await registerUser(fields, image);
      toast.success("Account created! Check your email for the OTP.");
      onSuccess?.(fields.email);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { register, loading };
}
