import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { getInitials } from "@/lib/utils";
import { UpdateProfileForm } from "./update-profile-form";

export function ProfilePage() {
  const { user, fetchLoading, updateLoading, update } = useProfile();
  const { copy, copied } = useCopyToClipboard();

  if (fetchLoading || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  const publicLink = `${window.location.origin}/u/${user.uniqueAccName}`;

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.uniqueAccName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Card className="mb-6 border-border/60 bg-card/70 p-5 shadow-glass backdrop-blur-xl">
          <p className="text-sm font-medium">Your anonymous link</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 truncate rounded-lg border border-border/60 bg-muted/50 px-3 py-2 font-mono text-sm">
              {publicLink}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => copy(publicLink)} aria-label="Copy link">
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

        <Card className="border-border/60 bg-card/70 p-6 shadow-glass backdrop-blur-xl">
          <h2 className="mb-5 font-display text-base font-semibold">Edit profile</h2>
          <UpdateProfileForm currentUser={user} onSubmit={update} loading={updateLoading} />
        </Card>
      </div>
    </PageTransition>
  );
}
