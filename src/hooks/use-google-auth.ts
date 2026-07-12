import { useState } from "react";
import { toast } from "sonner";
import { loginWithGoogle, setSession } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth.context";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: () => void;
}

export function useGoogleAuth({ onSuccess }: Options = {}) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleCredential(credential: string) {
    setLoading(true);
    try {
      const response = await loginWithGoogle(credential);
      const { user, tokens } = response.data;
      setSession(user, tokens);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { loading, handleCredential };
}
