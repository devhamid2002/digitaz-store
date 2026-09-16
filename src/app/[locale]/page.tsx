import { setRequestLocale } from "next-intl/server";
import Slider from "./components/Slider";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      {/* Main page slider with banners */}
      <Slider />
    </main>
  );
}
