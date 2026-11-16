import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { getUserById } from "@/features/user/actions/user.action";
import ProfileForm from "@/features/user/components/ProfileForm";
import { auth } from "@/lib/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const [{ locale }, t, session] = await Promise.all([
    params,
    getTranslations("profile"),
    auth(),
  ]);

  if (!session?.user?.id) redirect(`/${locale}/auth/sign-in`);

  const user = await getUserById(session.user.id);

  return (
    <main className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      {"error" in user ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-sm text-destructive">
          {user.error.message}
        </div>
      ) : (
        <ProfileForm
          user={{
            name: user.name,
            email: user.email,
            phone: user.phone,
          }}
        />
      )}
    </main>
  );
}
