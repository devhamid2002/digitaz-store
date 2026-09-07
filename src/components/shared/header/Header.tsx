"use client";

import { useState } from "react";

import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import Navigation from "./Navigation";
import MegaMenu from "./MegaMenu";

import faMessages from "@/messages/fa.json";
import enMessages from "@/messages/en.json";

// Header message type is generated from the Persian messages structure.
export type HeaderMessages = typeof faMessages.header;

type Locale = "fa" | "en";

interface HeaderProps {
  locale?: Locale;
}

export default function Header({ locale = "fa" }: HeaderProps) {
  // Controls whether the mega menu is currently open.
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // Select the appropriate language messages based on the current locale.
  const messages: HeaderMessages = (
    locale === "fa" ? faMessages : enMessages
  ).header;

  // Persian uses RTL direction, while English uses LTR.
  const isRTL = locale === "fa";

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
    >
      {/* Top information bar */}
      <TopBar messages={messages} />

      {/* Main header containing logo, search, actions, etc. */}
      <MainHeader messages={messages} isRTL={isRTL} />

      {/* Main navigation and mega menu trigger */}
      <Navigation
        messages={messages}
        open={megaMenuOpen}
        onToggle={() => setMegaMenuOpen((prev) => !prev)}
      />

      {/* Render the mega menu only when it is open */}
      {megaMenuOpen && <MegaMenu messages={messages} />}
    </header>
  );
}