import { useState } from "react";
import { toast } from "sonner";
import { loginUser, setSession } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth.context";
import { getErrorMessage } from "@/lib/api-error";

interface Options {
  onSuccess?: () => void;
}

export function useLogin({ onSuccess }: Options = {}) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const response = await loginUser(email, password);
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

  return { login, loading };
}
