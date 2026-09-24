import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/features/products/services/productService";
import ProductGallery from "@/features/products/components/ProductGallery";
import ProductDetails from "@/features/products/components/ProductDetails";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // Reuse the catalog fetch so metadata matches the rendered product, falling back to slug
  const product = await getProductBySlug(slug);

  return {
    title: product?.name ?? slug,
    description: product?.description ?? "",
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);

  // Unknown slugs render the locale not-found boundary instead of an empty page
  if (!product) {
    notFound();
  }

  // Map the product namespace once so presentational components stay locale-agnostic
  const t = await getTranslations("product");
  const labels = {
    color: t("color"),
    size: t("size"),
    sizeGuide: t("sizeGuide"),
    addToCart: t("addToCart"),
    wishlist: t("wishlist"),
    reviews: t("reviews"),
    off: t("off"),
    freeDelivery: t("freeDelivery"),
    freeDeliveryHint: t("freeDeliveryHint"),
    returns: t("returns"),
    returnsHint: t("returnsHint"),
    securePayment: t("securePayment"),
    securePaymentHint: t("securePaymentHint"),
    details: t("details"),
    brand: t("brand"),
    productCode: t("productCode"),
    inStock: t("inStock"),
    outOfStock: t("outOfStock"),
    colorNames: [
      t("colors.charcoal"),
      t("colors.gray"),
      t("colors.beige"),
      t("colors.black"),
    ],
  };

  return (
    <main className="mx-auto my-4 w-full max-w-[1600px] rounded-2xl bg-white shadow dark:bg-neutral-900">
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery image={product.image} name={product.name} />
          <ProductDetails
            product={product}
            labels={labels}
            locale={locale as "fa" | "en"}
          />
        </div>
      </div>
    </main>
  );
}
