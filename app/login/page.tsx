import { LoginForm } from "./login-form";
import { t, DEFAULT_LOCALE } from "@/lib/i18n/copy";

export const metadata = {
  title: "Sign in · zprompt-studio",
};

export default function LoginPage() {
  const locale = DEFAULT_LOCALE;
  return (
    <div className="dark min-h-screen bg-[oklch(0.12_0_0)] text-[oklch(0.985_0_0)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.22_0.04_85_/_0.25),transparent_60%)]" />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-xl border border-[oklch(0.25_0_0)] bg-[oklch(0.16_0_0)] p-8 shadow-[0_0_60px_oklch(0.78_0.14_85_/_0.08)]">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[oklch(0.78_0.14_85)]" aria-hidden />
            <span className="text-xs uppercase tracking-[0.2em] text-[oklch(0.78_0.14_85)]">
              zprompt
            </span>
          </div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight">
            {t("login.title", locale)}
          </h1>
          <p className="mb-8 text-sm text-[oklch(0.65_0_0)]">{t("login.subtitle", locale)}</p>
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
