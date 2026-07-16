import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, MessageSquare, Send, User } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { useAuth } from "@/contexts/auth.context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sara7aLogo } from "@/components/ui/sara7a-logo"

const navLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/sent-messages", label: "Sent", icon: Send },
]

export function Header() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/">
            <Sara7aLogo size="sm" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === to
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link
                    to={to}
                    className={cn(pathname === to && "bg-accent text-accent-foreground")}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar>
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ThemeToggle />
              <DropdownMenuItem variant="destructive" onSelect={() => logout()}>
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
