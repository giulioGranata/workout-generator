"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / brand */}
        <Link href="/" className="text-lg font-semibold">
          Workout Generator
        </Link>

        {/* Theme switcher */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}