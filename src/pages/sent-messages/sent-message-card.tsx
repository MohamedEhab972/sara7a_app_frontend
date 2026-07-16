import { useState } from "react";
import { motion } from "motion/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { groupReactions } from "@/lib/utils";
import type { Message } from "@/types";

interface SentMessageCardProps {
  message: Message;
}

export function SentMessageCard({ message }: SentMessageCardProps) {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="flex items-start gap-3 border-border/60 bg-card/70 p-4 shadow-glass backdrop-blur-xl">
        {message.Image && (
          <button
            type="button"
            onClick={() => setImageOpen(true)}
            className="shrink-0 overflow-hidden rounded-lg transition hover:opacity-90"
          >
            <img src={message.Image} alt="Attachment" className="size-14 rounded-lg object-cover" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">{message.content}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDistanceToNowStrict(new Date(message.createdAt), { addSuffix: true })}
          </p>

          {(message.reactions?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {groupReactions(message.reactions).map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="rounded-full bg-accent/60 px-2 py-0.5 text-xs leading-relaxed"
                >
                  {emoji}
                  {count > 1 && ` ${count}`}
                </span>
              ))}
            </div>
          )}

          {message.reply?.content && (
            <div className="mt-3 rounded-lg border-l-2 border-primary/50 bg-accent/30 px-3 py-2">
              <p className="text-xs font-medium text-primary">Their reply</p>
              <p className="mt-0.5 whitespace-pre-wrap wrap-break-word text-sm">{message.reply.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDistanceToNowStrict(new Date(message.reply.createdAt), { addSuffix: true })}
              </p>
            </div>
          )}
        </div>
      </Card>

      {message.Image && imageOpen && (
        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="max-w-lg p-2">
            <img src={message.Image} alt="Attachment" className="max-h-[70vh] w-full rounded-xl object-contain" />
          </DialogContent>
        </Dialog>
      )}
    </motion.li>
  );
}
