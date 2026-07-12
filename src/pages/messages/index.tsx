import { AnimatePresence } from "motion/react";
import { Inbox as InboxIcon, RefreshCw } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { MessageCard } from "./message-card";

export function MessagesPage() {
  const { messages, isLoading, isError, deletingId, remove, refetch } = useMessages();

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Anonymous messages sent to you — the sender is never revealed.
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
            title="Couldn't load your messages"
            description="Something went wrong while fetching your inbox."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : messages.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="No messages yet"
            description="Share your link and your first anonymous message will show up here."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onDelete={remove}
                  deleting={deletingId === message._id}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
