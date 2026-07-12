import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMessage, getMessages } from "@/services/message.service";
import { getErrorMessage } from "@/lib/api-error";
import type { Message, MessagesResponse } from "@/types";

const MESSAGES_KEY = ["messages"];

export function useMessages() {
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: getMessages,
    select: (res) => res.data,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: MESSAGES_KEY });
      const previous = queryClient.getQueryData<MessagesResponse>(MESSAGES_KEY);
      if (previous) {
        queryClient.setQueryData<MessagesResponse>(MESSAGES_KEY, {
          ...previous,
          data: previous.data.filter((m: Message) => m._id !== id),
        });
      }
      return { previous };
    },
    onError: (err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MESSAGES_KEY, context.previous);
      }
      toast.error(getErrorMessage(err));
    },
    onSuccess: () => {
      toast.success("Message deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_KEY });
    },
  });

  return {
    messages,
    isLoading,
    isError,
    refetch,
    deletingId: deleteMutation.isPending ? (deleteMutation.variables as string) : null,
    remove: deleteMutation.mutate,
  };
}
