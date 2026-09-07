"use client";

import {
  ArrowUp,
  CreditCard,
} from "lucide-react";
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

export default function Footer({
  locale = "fa",
}: FooterProps) {
  const messages: FooterMessages = (locale === "fa" ? faMessages : enMessages).footer;

  return (
    <footer
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="border-t border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-5">

        {/* Footer links */}
        <div className="grid grid-cols-4 gap-16 py-12">

          <div>
            <h3 className="mb-5 font-bold">
              {messages.usefulLinks}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500">
              <li>{messages.newProducts}</li>
              <li>{messages.bestSellers}</li>
              <li>{messages.giftCard}</li>
              <li>{messages.discount}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              {messages.store}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500">
              <li>Apple</li>
              <li>Photo & Video</li>
              <li>Mobile</li>
              <li>Computer</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              {messages.account}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500">
              <li>{messages.profile}</li>
              <li>{messages.orders}</li>
              <li>{messages.wishlist}</li>
              <li>{messages.cart}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              {messages.company}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500">
              <li>{messages.about}</li>
              <li>{messages.careers}</li>
              <li>{messages.blog}</li>
              <li>{messages.marketing}</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex min-h-[90px] items-center justify-between border-t border-neutral-100">

          {/* Payment */}
          <div className="flex items-center gap-3">
            <div className="rounded border border-neutral-200 p-2">
              <CreditCard size={25} />
            </div>

            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold">
              VISA
            </span>

            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold">
              PayPal
            </span>

            <span className="rounded border border-neutral-200 px-3 py-2 text-xs font-bold">
              AMEX
            </span>
          </div>

          {/* Logo */}
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

          {/* Social + copyright */}
          <div className="flex items-center gap-5">

            <div className="flex items-center gap-4">
              <FaPinterest size={16} />

              <FaInstagram size={16} />

              <FaTwitter size={16} />

              <FaFacebook size={16} />
            </div>

            <span className="text-xs text-neutral-500">
              {messages.copyright}
            </span>

          </div>
        </div>
      </div>

      {/* Scroll top */}
      <button
        aria-label="Scroll to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}