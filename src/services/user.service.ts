import { api } from "./auth.service";
import type { ApiResponse, PublicProfileResponse, User } from "@/types";

export async function getUserData(): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>("/user/get-user-data");
  return data;
}

export async function getPublicProfile(uniqueAccName: string): Promise<PublicProfileResponse> {
  const { data } = await api.get<PublicProfileResponse>(`/user/public/${uniqueAccName}`);
  return data;
}

export async function updateUserData(
  fields: {
    name?: string;
    email?: string;
    uniqueAccName?: string;
    password?: string;
    newPassword?: string;
  },
  image?: File,
): Promise<ApiResponse<User>> {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  if (image) formData.append("image", image);

  const { data } = await api.put<ApiResponse<User>>("/user/update-user-data", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
