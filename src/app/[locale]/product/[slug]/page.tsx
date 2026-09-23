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
  if (!product) {
    notFound();
  }

  const t = await getTranslations("product");
  const labels = {
    color: t("color"),
    size: t("size"),
    addToCart: t("addToCart"),
    wishlist: t("wishlist"),
    reviews: t("reviews"),
    off: t("off"),
    freeDelivery: t("freeDelivery"),
    freeDeliveryHint: t("freeDeliveryHint"),
    returns: t("returns"),
    returnsHint: t("returnsHint"),
    details: t("details"),
  };

  return (
    <main className="w-full bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
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
