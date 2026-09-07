import {
    PhoneCall,
  } from "lucide-react";
  
  interface Props {
    messages: any;
  }
  
  const Column = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => {
    return (
      <div>
        <h3 className="mb-5 text-[15px] font-bold text-neutral-900">
          {title}
        </h3>
  
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item}
              className="cursor-pointer text-[13px] text-neutral-500 transition hover:text-[#2161e8]"
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
      <div className="border-b border-neutral-100 bg-[#f8f9fa] shadow-sm">
        <div className="mx-auto grid max-w-[1280px] grid-cols-5 gap-14 px-10 py-8">
  
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
  
          {/* Quick order */}
          <div>
            <h3 className="mb-5 text-[15px] font-bold text-neutral-900">
              {messages.quickOrder}
            </h3>
  
            <div className="flex items-center gap-4">
              <PhoneCall
                size={55}
                strokeWidth={1.5}
                className="text-[#2161e8]"
              />
  
              <div>
                <div className="text-lg font-bold">
                  ۰۸۳۶-۱۳۴۴
                </div>
  
                <div className="text-lg font-bold">
                  ۸۴۵-۱۳۶۶
                </div>
              </div>
            </div>
  
            <h4 className="mt-5 mb-2 text-sm font-bold">
              {messages.contactInfo}
            </h4>
  
            <p className="text-xs leading-7 text-neutral-500">
              {messages.address}
            </p>
  
            <p className="text-xs text-neutral-500">
              {messages.email}
            </p>
  
            <p className="mt-4 text-xs leading-6 text-neutral-500">
              {messages.nearestStore}
            </p>
          </div>
        </div>
      </div>
    );
  }