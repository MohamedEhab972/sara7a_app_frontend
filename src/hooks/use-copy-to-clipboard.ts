import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't copy to clipboard"));
    }
  }

  return { copy, copied };
}
