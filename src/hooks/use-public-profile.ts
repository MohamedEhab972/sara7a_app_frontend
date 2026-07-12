import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/services/user.service";
import { ApiError } from "@/lib/api-error";

export function usePublicProfile(uniqueAccName: string | undefined) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-profile", uniqueAccName],
    queryFn: () => getPublicProfile(uniqueAccName!),
    enabled: !!uniqueAccName,
    retry: false,
  });

  const isNotFound = isError && error instanceof ApiError && error.statusCode === 404;

  return {
    profile: data?.data ?? null,
    isLoading,
    isNotFound,
  };
}
