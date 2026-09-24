import { setRequestLocale } from "next-intl/server";
import Slider from "../../components/Slider";
import FeaturesBar from "../../components/FeaturesBar";
import PromoBanners from "../../components/PromoBanners";
import ProductShowcase from "../../features/products/components/ProductShowcase";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  // Enable static rendering for next-intl server components on this page
  setRequestLocale(locale);

  return (
    <main>
      <Slider />
      <FeaturesBar />
      <PromoBanners />
      <ProductShowcase />
    </main>
  );
}
