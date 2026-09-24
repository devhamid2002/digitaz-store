import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Supported locales with Persian as the default for routing and navigation helpers
  locales: ["en", "fa"],
  defaultLocale: "fa",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);