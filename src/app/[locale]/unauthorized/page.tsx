import { ShieldX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export default async function UnauthorizedPage() {
  const t = await getTranslations("unauthorized");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldX aria-hidden="true" className="size-7" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {t("description")}
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
        {t("backHome")}
      </Link>
    </main>
  );
}
