import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MessageReaction } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupReactions(reactions?: MessageReaction[]) {
  const counts = new Map<string, number>()
  for (const { emoji } of reactions ?? []) {
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1)
  }
  return [...counts.entries()]
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
