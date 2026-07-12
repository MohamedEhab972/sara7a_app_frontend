import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Check, UserX } from "lucide-react";
import { usePublicProfile } from "@/hooks/use-public-profile";
import { useSendAnonymousMessage } from "@/hooks/use-send-anonymous-message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Sara7aLogo } from "@/components/ui/sara7a-logo";
import { getErrorMessage } from "@/lib/api-error";
import { getInitials } from "@/lib/utils";
import { SendMessageForm } from "./send-message-form";
import type { PublicMessageFormData } from "./send-message.schema";

export function PublicMessagePage() {
  const { uniqueAccName } = useParams<{ uniqueAccName: string }>();
  const { profile, isLoading, isNotFound } = usePublicProfile(uniqueAccName);
  const { send, isSending, isSuccess, reset } = useSendAnonymousMessage();

  function handleSubmit(data: PublicMessageFormData, image?: File) {
    if (!profile) return;
    send(
      { content: data.content, receiver: profile._id, image },
      {
        onSuccess: () => {
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Sara7aLogo size="md" />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-glass backdrop-blur-xl">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-4 h-32 w-full rounded-xl" />
            </div>
          ) : isNotFound || !profile ? (
            <EmptyState
              icon={UserX}
              title="This link doesn't exist"
              description="Double-check the link — this user couldn't be found."
            />
          ) : (
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="flex size-16 items-center justify-center rounded-full bg-success/15"
                  >
                    <Check className="size-8 text-success" />
                  </motion.div>
                  <div>
                    <p className="font-display text-lg font-semibold">Message sent!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.name} won&apos;t know it was you.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => reset()}>
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-5 flex flex-col items-center gap-2 text-center">
                    <Avatar className="size-16">
                      <AvatarImage src={profile.profilePicture} alt={profile.name} />
                      <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display text-lg font-semibold">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">@{profile.uniqueAccName}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Send an anonymous message — they&apos;ll never know it's from you.
                    </p>
                  </div>
                  <SendMessageForm onSubmit={handleSubmit} loading={isSending} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
