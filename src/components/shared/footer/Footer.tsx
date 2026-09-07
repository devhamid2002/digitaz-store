"use client";

import { ArrowUp, CreditCard } from "lucide-react";

import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaPinterest,
} from "react-icons/fa";

import faMessages from "@/messages/fa.json";
import enMessages from "@/messages/en.json";

export type FooterMessages = typeof faMessages.footer;

interface FooterProps {
  locale?: "fa" | "en";
}

export default function Footer({ locale = "fa" }: FooterProps) {
  // Select messages based on the current locale.
  const messages: FooterMessages = (
    locale === "fa" ? faMessages : enMessages
  ).footer;

  return (
    <footer
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="w-full border-t border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Footer links */}
        <div className="grid grid-cols-4 gap-16 py-12">
          {/* Useful Links */}
          <div>
            <h3 className="mb-5 font-bold">
              {messages.usefulLinks}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li>{messages.newProducts}</li>
              <li>{messages.bestSellers}</li>
              <li>{messages.giftCard}</li>
              <li>{messages.discount}</li>
            </ul>
          </div>

          {/* Store */}
          <div>
            <h3 className="mb-5 font-bold">
              {messages.store}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li>Apple</li>
              <li>Photo & Video</li>
              <li>Mobile</li>
              <li>Computer</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 font-bold">
              {messages.account}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li>{messages.profile}</li>
              <li>{messages.orders}</li>
              <li>{messages.wishlist}</li>
              <li>{messages.cart}</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 font-bold">
              {messages.company}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li>{messages.about}</li>
              <li>{messages.careers}</li>
              <li>{messages.blog}</li>
              <li>{messages.marketing}</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex min-h-[90px] items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
          {/* Payment methods */}
          <div className="flex items-center gap-3">
            {/* Credit card icon */}
            <div className="rounded border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800">
              <CreditCard size={25} />
            </div>

            {/* VISA */}
            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800">
              VISA
            </span>

            {/* PayPal */}
            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800">
              PayPal
            </span>

            {/* AMEX */}
            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800">
              AMEX
            </span>
          </div>

          {/* Digitaz logo */}
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute right-0 top-1 h-2.5 w-7 -rotate-45 rounded-full bg-[#4545d8]" />
              <div className="absolute right-0 top-3 h-2.5 w-7 -rotate-45 rounded-full bg-[#ef426f]" />
              <div className="absolute right-0 top-5 h-2.5 w-7 -rotate-45 rounded-full bg-[#315fdc]" />
            </div>

            <span className="text-2xl font-black italic">
              digitaz
            </span>
          </div>

          {/* Social media + copyright */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
              <FaPinterest size={16} />
              <FaInstagram size={16} />
              <FaTwitter size={16} />
              <FaFacebook size={16} />
            </div>

            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {messages.copyright}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-800 hover:cursor-pointer dark:hover:bg-blue-500"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}