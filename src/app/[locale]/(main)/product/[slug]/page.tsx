import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/features/products/actions/product.action";
import ProductGallery from "@/features/products/components/ProductGallery";
import ProductDetails from "@/features/products/components/ProductDetails";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // Reuse the catalog fetch so metadata matches the rendered product, falling back to slug
  const result = await getProductBySlug(slug);
  const product = "data" in result ? result.data : null;

  return {
    title: product?.name ?? slug,
    description: product?.description ?? "",
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await getProductBySlug(slug);

  // Unknown slugs render the locale not-found boundary instead of an empty page
  if ("error" in result) {
    notFound();
  }

  const product = result.data;

  return (
    <main className="mx-auto my-4 w-full max-w-[1440px]">
      <div className="mx-auto px-4 py-8 rounded-2xl shadow dark:bg-neutral-900">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery image={product.image} name={product.name} />
          <ProductDetails
            product={product}
            locale={locale as "fa" | "en"}
          />
        </div>
      </div>
    </main>
  );
}
