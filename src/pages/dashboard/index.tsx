import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { isAfter, subDays } from "date-fns";
import { Check, Copy, Inbox as InboxIcon, MessageSquareText, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { useMessages } from "@/hooks/use-messages";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { getInitials } from "@/lib/utils";
import { MessageCard } from "@/pages/messages/message-card";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { user } = useAuth();
  const { messages, isLoading } = useMessages();
  const { copy, copied } = useCopyToClipboard();

  const publicLink = `${window.location.origin}/u/${user?.uniqueAccName}`;

  const recentMessages = useMemo(
    () =>
      [...messages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [messages],
  );

  const thisWeekCount = useMemo(() => {
    const weekAgo = subDays(new Date(), 7);
    return messages.filter((m) => isAfter(new Date(m.createdAt), weekAgo)).length;
  }, [messages]);

  if (!user) return null;

  return (
    <PageTransition>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl px-4 py-10"
      >
        <motion.div variants={item} className="mb-8 flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back, {user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.uniqueAccName}</p>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <Card className="mb-6 border-border/60 bg-card/70 p-5 shadow-glass backdrop-blur-xl">
            <p className="text-sm font-medium">Your anonymous link</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share this link — anyone can send you a message without logging in.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 truncate rounded-lg border border-border/60 bg-muted/50 px-3 py-2 font-mono text-sm">
                {publicLink}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copy(publicLink)}
                    aria-label="Copy link"
                  >
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex"
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </motion.span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to clipboard</TooltipContent>
              </Tooltip>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="mb-6 grid grid-cols-2 gap-4">
          <Card className="border-border/60 bg-card/70 p-5 shadow-glass backdrop-blur-xl">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquareText className="size-4" />
              <span className="text-xs font-medium">Total messages</span>
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-2 font-display text-3xl font-bold"
            >
              {messages.length}
            </motion.p>
          </Card>
          <Card className="border-border/60 bg-card/70 p-5 shadow-glass backdrop-blur-xl">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="size-4" />
              <span className="text-xs font-medium">This week</span>
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 font-display text-3xl font-bold"
            >
              {thisWeekCount}
            </motion.p>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Recent messages</h2>
            {messages.length > 0 && (
              <Link to="/messages" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <Card className="border-border/60 bg-card/70 shadow-glass backdrop-blur-xl">
              <EmptyState
                icon={InboxIcon}
                title="No messages yet"
                description="Copy your link above to get your first anonymous message."
              />
            </Card>
          ) : (
            <ul className="flex flex-col gap-3">
              {recentMessages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))}
            </ul>
          )}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
