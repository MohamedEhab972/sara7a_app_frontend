import { Check, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme.context"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./dropdown-menu"

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      {options.map(({ value, label, icon: Icon }) => (
        <DropdownMenuItem
          key={value}
          onSelect={(e) => {
            e.preventDefault()
            setTheme(value)
          }}
        >
          <Icon className="size-4" />
          <span className="flex-1">{label}</span>
          {theme === value && <Check className="size-4 text-primary" />}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
    </>
  )
}

export { ThemeToggle }
