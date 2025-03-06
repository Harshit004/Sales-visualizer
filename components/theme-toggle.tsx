"use client"

import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md relative"
          aria-label="Select theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-200 dark:rotate-90 dark:scale-0 text-orange-500" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100 text-blue-500 top-2.5 left-2.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-[150px] bg-white dark:bg-gray-800 rounded-xl shadow-xl p-2 mt-2 border border-gray-100 dark:border-gray-700"
          sideOffset={5}
          align="end"
          alignOffset={-5}
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700/70 rounded-lg cursor-pointer transition-colors"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4 text-orange-500" />
            Light
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700/70 rounded-lg cursor-pointer transition-colors"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4 text-blue-500" />
            Dark
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 rounded-lg cursor-pointer transition-colors"
            onClick={() => setTheme("system")}
          >
            <Laptop className="h-4 w-4 text-gray-500" />
            System
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
} 