import { Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import AdminUsersTable from "@/features/admin/users/components/AdminUsersTable";
import { getAllUsers } from "@/features/admin/users/actions/user.action";
import { requireAdmin } from "@/lib/auth-gaurd";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminUsersPage({ params }: Props) {
  const { locale } = await params;
  await requireAdmin(locale);

  const [t, result] = await Promise.all([
    getTranslations("admin"),
    getAllUsers(),
  ]);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  const users = result.data;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("usersTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("usersSubtitle")}
        </p>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <Users aria-hidden="true" className="size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t("noUsers")}</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {t("noUsersHint")}
          </p>
        </div>
      ) : (
        <AdminUsersTable users={users} locale={locale as Locale} />
      )}
    </main>
  );
}
