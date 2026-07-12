import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/services/message.service";

export function useSendAnonymousMessage() {
  const mutation = useMutation({
    mutationFn: ({ content, receiver, image }: { content: string; receiver: string; image?: File }) =>
      sendMessage({ content, receiver }, image),
  });

  return {
    send: mutation.mutate,
    isSending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
