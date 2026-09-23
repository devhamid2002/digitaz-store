"use client";

import { ArrowUp, CreditCard, PhoneCall } from "lucide-react";

import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaPinterest,
} from "react-icons/fa";

import faMessages from "@/messages/fa.json";
import enMessages from "@/messages/en.json";

export type FooterMessages = typeof faMessages.footer;
export type FooterHeaderMessages = typeof faMessages.header;

interface FooterProps {
  locale?: "fa" | "en";
}

export default function Footer({ locale = "fa" }: FooterProps) {
  const footerMessages: FooterMessages = (
    locale === "fa" ? faMessages : enMessages
  ).footer;
  const messages: FooterHeaderMessages = (
    locale === "fa" ? faMessages : enMessages
  ).header;

  return (
    <footer
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="w-full border-t border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-5 md:gap-8 lg:gap-16">
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

          <div>
            <h3 className="mb-5 font-bold">
              {footerMessages.usefulLinks}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.newProducts}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.bestSellers}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.giftCard}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.discount}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              {footerMessages.store}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.apple}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.photoVideo}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.mobile}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{messages.computer}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              {footerMessages.account}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.profile}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.orders}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.wishlist}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.cart}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              {footerMessages.company}
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.about}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.careers}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.blog}</li>
              <li className="cursor-pointer transition-colors hover:text-brand dark:hover:text-brand-ink">{footerMessages.marketing}</li>
            </ul>
          </div>
        </div>

        <div className="flex min-h-[90px] items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-5">
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