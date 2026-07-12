import { useState } from "react";
import { motion } from "motion/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Trash2 } from "lucide-react";
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

interface MessageCardProps {
  message: Message;
  onDelete?: (id: string) => void;
  deleting?: boolean;
}

export function MessageCard({ message, onDelete, deleting }: MessageCardProps) {
  const [imageOpen, setImageOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            aria-label="Delete message"
          >
            <Trash2 className="size-4" />
          </button>
        )}
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
