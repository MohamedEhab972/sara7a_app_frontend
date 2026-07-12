import { api } from "./auth.service";
import type { ApiResponse, Message, MessageResponse, MessagesResponse } from "@/types";

export async function sendMessage(
  fields: { content: string; receiver: string },
  image?: File,
): Promise<MessageResponse> {
  const formData = new FormData();
  formData.append("content", fields.content);
  formData.append("receiver", fields.receiver);
  if (image) formData.append("image", image);

  const { data } = await api.post<MessageResponse>("/message/send-message", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getMessages(): Promise<MessagesResponse> {
  const { data } = await api.get<MessagesResponse>("/message/get-messages");
  return data;
}

export async function deleteMessage(id: string): Promise<ApiResponse<Message>> {
  const { data } = await api.delete<ApiResponse<Message>>(`/message/delete-message/${id}`);
  return data;
}
