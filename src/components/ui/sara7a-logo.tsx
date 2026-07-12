import { cn } from "@/lib/utils";

interface Sara7aLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Sara7aLogo({ className, showText = true, size = "md" }: Sara7aLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-primary shadow-sm",
          size === "sm" && "size-7 rounded-lg",
          size === "md" && "size-9 rounded-xl",
          size === "lg" && "size-12 rounded-2xl",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "text-primary-foreground",
            size === "sm" && "size-4",
            size === "md" && "size-5",
            size === "lg" && "size-7",
          )}
        >
          {/* Speech bubble */}
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            fill="rgba(255,255,255,0.15)"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bold "7" glyph — horizontal bar + diagonal */}
          <line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            size === "sm" && "text-base",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl",
          )}
        >
          Sara<span className="text-primary">7</span>a
        </span>
      )}
    </div>
  );
}
