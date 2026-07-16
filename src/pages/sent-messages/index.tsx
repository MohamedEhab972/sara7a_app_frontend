import { AnimatePresence } from "motion/react";
import { Send, RefreshCw } from "lucide-react";
import { useSentMessages } from "@/hooks/use-sent-messages";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { SentMessageCard } from "./sent-message-card";

export function SentMessagesPage() {
  const { messages, isLoading, isError, refetch } = useSentMessages();

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight">Sent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages you've sent, with any reactions or reply from the receiver.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={RefreshCw}
            title="Couldn't load your sent messages"
            description="Something went wrong while fetching this list."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : messages.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No sent messages yet"
            description="Messages you send while signed in will show up here."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <SentMessageCard key={message._id} message={message} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
