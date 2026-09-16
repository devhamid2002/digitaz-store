"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Theme dropdown toggle for the header.
 * Displays sun/moon icon and allows switching between light/dark/system.
 */
export function ThemeDropdownToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Toggle theme"
            className="relative flex h-[23px] w-[23px] items-center justify-center text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          />
        }
      >
        <Sun className="h-[23px] w-[23px] shrink-0 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" strokeWidth={1.8} />
        <Moon className="absolute h-[23px] w-[23px] shrink-0 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" strokeWidth={1.8} />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
