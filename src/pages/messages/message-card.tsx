import { useState } from "react";
import { motion } from "motion/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Trash2, SmilePlus, Reply as ReplyIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Message } from "@/types";
import { ReplyForm } from "./reply-form";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

function groupReactions(reactions: Message["reactions"]) {
  const counts = new Map<string, number>();
  for (const { emoji } of reactions ?? []) {
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
  }
  return [...counts.entries()];
}

interface MessageCardProps {
  message: Message;
  onDelete?: (id: string) => void;
  deleting?: boolean;
  onReact?: (id: string, emoji: string) => void;
  reacting?: boolean;
  onReply?: (id: string, content: string) => void;
  replying?: boolean;
}

export function MessageCard({
  message,
  onDelete,
  deleting,
  onReact,
  reacting,
  onReply,
  replying,
}: MessageCardProps) {
  const [imageOpen, setImageOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
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

          {message.reply ? (
            <div className="mt-3 rounded-lg border-l-2 border-primary/50 bg-accent/30 px-3 py-2">
              <p className="text-xs font-medium text-primary">Your reply</p>
              <p className="mt-0.5 whitespace-pre-wrap wrap-break-word text-sm">{message.reply.content}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(message.reply.createdAt), { addSuffix: true })}
                </p>
                {onReply && !replyOpen && (
                  <button
                    type="button"
                    onClick={() => setReplyOpen(true)}
                    className="text-xs text-muted-foreground transition hover:text-primary"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ) : (
            onReply &&
            !replyOpen && (
              <button
                type="button"
                onClick={() => setReplyOpen(true)}
                className="mt-2 flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
              >
                <ReplyIcon className="size-3.5" />
                Reply
              </button>
            )
          )}

          {onReply && replyOpen && (
            <ReplyForm
              defaultContent={message.reply?.content}
              submitting={replying}
              onCancel={() => setReplyOpen(false)}
              onSubmit={(content) => {
                onReply(message._id, content);
                setReplyOpen(false);
              }}
            />
          )}
        </div>

        <div className="flex shrink-0 items-start gap-1">
          {onReact && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                disabled={reacting}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-50"
                aria-label="React to message"
              >
                <SmilePlus className="size-4" />
              </button>
              {pickerOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 flex gap-1 rounded-full border border-border/60 bg-popover p-1 shadow-lg">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onReact(message._id, emoji);
                        setPickerOpen(false);
                      }}
                      className="rounded-full p-1 text-base transition hover:scale-125 hover:bg-accent"
                      aria-label={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              aria-label="Delete message"
            >
              <Trash2 className="size-4" />
            </button>
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

      {onDelete && confirmOpen && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="size-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete this message?</DialogTitle>
                <DialogDescription>This can&apos;t be undone.</DialogDescription>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(message._id);
                  setConfirmOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.li>
  );
}
