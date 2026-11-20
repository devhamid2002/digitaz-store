import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  // Supported locales with Persian as the default for routing and navigation helpers
  locales,
  defaultLocale,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
