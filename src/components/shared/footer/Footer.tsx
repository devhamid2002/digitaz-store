"use client";

import { useState, type ReactNode } from "react";
import { ArrowUp, ChevronDown, CreditCard, PhoneCall } from "lucide-react";

import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaPinterest,
} from "react-icons/fa";

import faMessages from "@/messages/fa.json";
import enMessages from "@/messages/en.json";

// Reads message JSON directly since locale arrives as a prop rather than via next-intl hooks
export type FooterMessages = typeof faMessages.footer;
export type FooterHeaderMessages = typeof faMessages.header;

interface FooterProps {
  locale?: "fa" | "en";
}

// Collapsible link section on mobile, always expanded on desktop
function FooterSection({
  id,
  title,
  openId,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  openId: string | null;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  const open = openId === id;
  return (
    <div className="border-b border-neutral-100 pb-4 md:border-0 md:pb-0 dark:border-neutral-800">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between font-bold md:mb-5 md:pointer-events-none"
      >
        {title}
        <ChevronDown
          size={18}
          className={`text-neutral-400 transition-transform md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className={`${open ? "block" : "hidden"} mt-4 md:mt-0 md:block`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer({ locale = "fa" }: FooterProps) {
  const footerMessages: FooterMessages = (
    locale === "fa" ? faMessages : enMessages
  ).footer;
  const messages: FooterHeaderMessages = (
    locale === "fa" ? faMessages : enMessages
  ).header;

  // Single open accordion on mobile; desktop ignores this and shows everything
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleSection = (id: string) =>
    setOpenSection((prev) => (prev === id ? null : id));

  return (
    <footer
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="w-full border-t border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Sitemap columns with contact, account, and company links */}
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-5 md:gap-8 md:py-12 lg:gap-16">
        <div>
          <h3 className="mb-5 text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
            {messages.quickOrder}
          </h3>

          <div className="flex items-center gap-4">
            <PhoneCall
              size={55}
              strokeWidth={1.5}
              className="text-brand"
            />

            <div>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                ۰۸۳۶-۱۳۴۴
              </div>

              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                ۸۴۵-۱۳۶۶
              </div>
            </div>
          </div>

          <h4 className="mb-2 mt-5 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {messages.contactInfo}
          </h4>

          <p className="text-xs leading-7 text-neutral-500 dark:text-neutral-400">
            {messages.address}
          </p>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {messages.email}
          </p>

          <p className="mt-4 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
            {messages.nearestStore}
          </p>
        </div>

          <FooterSection
            id="useful-links"
            title={footerMessages.usefulLinks}
            openId={openSection}
            onToggle={toggleSection}
          >
            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.newProducts}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.bestSellers}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.giftCard}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.discount}</li>
            </ul>
          </FooterSection>

          <FooterSection
            id="store"
            title={footerMessages.store}
            openId={openSection}
            onToggle={toggleSection}
          >
            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.apple}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.photoVideo}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.mobile}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.computer}</li>
            </ul>
          </FooterSection>

          <FooterSection
            id="account"
            title={footerMessages.account}
            openId={openSection}
            onToggle={toggleSection}
          >
            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.profile}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.orders}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.wishlist}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.cart}</li>
            </ul>
          </FooterSection>

          <FooterSection
            id="company"
            title={footerMessages.company}
            openId={openSection}
            onToggle={toggleSection}
          >
            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.about}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.careers}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.blog}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.marketing}</li>
            </ul>
          </FooterSection>
        </div>

        {/* Payment badges, brand mark, and social proof */}
        <div className="flex flex-col items-center gap-4 border-t border-neutral-100 py-6 text-center md:min-h-[90px] md:flex-row md:justify-between md:gap-3 md:py-0 md:text-start dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="rounded border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800">
              <CreditCard size={25} />
            </div>

            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800">
              VISA
            </span>

            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800">
              PayPal
            </span>

            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800">
              AMEX
            </span>
          </div>

          <span className="text-2xl font-black italic">
            digitaz
          </span>

          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-5">
            <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
              <FaPinterest size={16} className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink" />
              <FaInstagram size={16} className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink" />
              <FaTwitter size={16} className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink" />
              <FaFacebook size={16} className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink" />
            </div>

            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {footerMessages.copyright}
            </span>
          </div>
        </div>
      </div>

      {/* Floating action returning the viewport to the top */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-brand-strong text-white shadow-lg transition-colors hover:bg-brand-strong-hover hover:cursor-pointer dark:hover:bg-brand-vivid"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}