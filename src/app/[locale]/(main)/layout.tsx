import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MainLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale as "en" | "fa"} />
      {children}
      <Footer locale={locale as "en" | "fa"} />
    </>
  );
}
