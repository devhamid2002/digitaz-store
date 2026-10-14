import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignInForm } from "@/features/auth/components/forms/SignInForm";
import { getServerAuthSession } from "@/lib/auth";

// Render per request so next-intl locale context is always present;
// a static prerender would fall back to untranslated content.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;

  // Logged-in users have no business on the sign-in page: send them home.
  const session = await getServerAuthSession();
  if (session?.user) {
    redirect(`/${locale}`);
  }

  // Suspense boundary is required for useSearchParams() during prerendering
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
