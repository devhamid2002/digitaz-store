import { getTranslations } from "next-intl/server";
import ProductForm from "@/features/admin/products/components/ProductForm";

export default async function CreateProductPage() {
  const t = await getTranslations("admin");

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("createProductTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("createProductSubtitle")}
        </p>
      </div>

      <ProductForm />
    </main>
  );
}
