import { PackageOpen, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import AdminProductsTable from "@/features/admin/products/components/AdminProductsTable";
import { getAdminProducts } from "@/features/admin/products/actions/product.action";
import { Link } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth-gaurd";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductsPage({ params }: Props) {
  const { locale } = await params;
  await requireAdmin(locale);

  const [t, result] = await Promise.all([
    getTranslations("admin"),
    getAdminProducts(),
  ]);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  const products = result.data;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("productsTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("productsSubtitle")}
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className={buttonVariants({ size: "lg" })}
        >
          <Plus aria-hidden="true" />
          {t("createProduct")}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <PackageOpen
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
          <h2 className="text-lg font-semibold">{t("noProducts")}</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {t("noProductsHint")}
          </p>
        </div>
      ) : (
        <AdminProductsTable products={products} locale={locale as Locale} />
      )}
    </main>
  );
}
