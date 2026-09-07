import { PhoneCall } from "lucide-react";

interface Props {
  messages: {
    usefulLinks: string;
    newProducts: string;
    bestSellers: string;
    specialPackages: string;
    giftCard: string;
    discount: string;

    shop: string;
    apple: string;
    photoVideo: string;
    mobile: string;
    computer: string;
    headphones: string;

    account: string;
    profile: string;
    orders: string;
    wishlist: string;
    tracking: string;
    cart: string;

    company: string;
    about: string;
    careers: string;
    blog: string;
    marketing: string;
    contactUs: string;

    quickOrder: string;
    contactInfo: string;
    address: string;
    email: string;
    nearestStore: string;
  };
}

interface ColumnProps {
  title: string;
  items: string[];
}

const Column = ({ title, items }: ColumnProps) => {
  return (
    <div>
      <h3 className="mb-5 text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="cursor-pointer text-[13px] text-neutral-500 transition-colors hover:text-[#2161e8] dark:text-neutral-400"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function MegaMenu({ messages }: Props) {
  return (
    <div className="border-b border-neutral-100 bg-[#f8f9fa] shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto grid max-w-[1280px] grid-cols-5 gap-14 px-10 py-8">
        {/* Useful Links */}
        <Column
          title={messages.usefulLinks}
          items={[
            messages.newProducts,
            messages.bestSellers,
            messages.specialPackages,
            messages.giftCard,
            messages.discount,
          ]}
        />

        {/* Shop */}
        <Column
          title={messages.shop}
          items={[
            messages.apple,
            messages.photoVideo,
            messages.mobile,
            messages.computer,
            messages.headphones,
          ]}
        />

        {/* Account */}
        <Column
          title={messages.account}
          items={[
            messages.profile,
            messages.orders,
            messages.wishlist,
            messages.tracking,
            messages.cart,
          ]}
        />

        {/* Company */}
        <Column
          title={messages.company}
          items={[
            messages.about,
            messages.careers,
            messages.blog,
            messages.marketing,
            messages.contactUs,
          ]}
        />

        {/* Quick Order */}
        <div>
          <h3 className="mb-5 text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
            {messages.quickOrder}
          </h3>

          <div className="flex items-center gap-4">
            <PhoneCall
              size={55}
              strokeWidth={1.5}
              className="text-[#2161e8]"
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

          {/* Contact Information */}
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
      </div>
    </div>
  );
}