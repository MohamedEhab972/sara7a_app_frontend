import { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: () => void;
}

export function useSetNewPassword({ onSuccess }: Options = {}) {
  const [loading, setLoading] = useState(false);

  async function setNewPassword(resetToken: string, newPassword: string) {
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      toast.success("Password updated successfully");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { setNewPassword, loading };
}
