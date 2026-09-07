"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import Navigation from "./Navigation";
import MegaMenu from "./MegaMenu";

import faMessages from "@/messages/fa.json";
import enMessages from "@/messages/en.json";

export type HeaderMessages = typeof faMessages.header;

type Locale = "fa" | "en";

interface HeaderProps {
  locale?: Locale;
}

export default function Header({ locale = "fa" }: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const messages: HeaderMessages = (locale === "fa" ? faMessages : enMessages).header;
  const isRTL = locale === "fa";

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white text-neutral-900"
    >
      <TopBar messages={messages} />

      <MainHeader messages={messages} isRTL={isRTL} />

      <Navigation
        messages={messages}
        open={megaMenuOpen}
        onToggle={() => setMegaMenuOpen((prev) => !prev)}
      />

      {megaMenuOpen && <MegaMenu messages={messages} />}
    </header>
  );
}