import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserData, updateUserData } from "@/services/user.service";
import { updateStoredUser } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth.context";
import { getErrorMessage } from "@/lib/api-error";
import type { User } from "@/types";
import type { UpdateProfileFormData } from "@/pages/profile/update-profile.schema";

export function useProfile() {
  const { user, setUser } = useAuth();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setFetchLoading(true);
      try {
        const res = await getUserData();
        const fresh: User = res.data;
        updateStoredUser(fresh);
        setUser(fresh);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setFetchLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function update(fields: UpdateProfileFormData, image?: File) {
    setUpdateLoading(true);
    try {
      const cleaned = Object.fromEntries(
        Object.entries(fields).filter(([, v]) => v !== "" && v !== undefined),
      ) as UpdateProfileFormData;

      const res = await updateUserData(cleaned, image);
      const updated: User = res.data;
      updateStoredUser(updated);
      setUser(updated);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdateLoading(false);
    }
  }

  return { user, fetchLoading, updateLoading, update };
}
