import { useQuery } from "@tanstack/react-query";
import { getSentMessages } from "@/services/message.service";

const SENT_MESSAGES_KEY = ["sent-messages"];

export function useSentMessages() {
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: SENT_MESSAGES_KEY,
    queryFn: getSentMessages,
    select: (res) => res.data,
  });

  return { messages, isLoading, isError, refetch };
}
