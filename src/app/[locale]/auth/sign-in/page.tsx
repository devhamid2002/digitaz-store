import { Suspense } from "react";
import { SignInForm } from "@/features/auth/components/forms/SignInForm";

// Render per request so next-intl locale context is always present;
// a static prerender would fall back to untranslated content.
export const dynamic = "force-dynamic";

export default function SignInPage() {
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
