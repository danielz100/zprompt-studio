"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { t, type Locale } from "@/lib/i18n/copy";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "sent" | "error";

export function LoginForm({ locale }: { locale: Locale }) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setErrorMsg(t("login.error_invalid_email", locale));
      return;
    }

    setStatus("submitting");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(t("login.error_generic", locale));
      return;
    }
    setStatus("sent");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[oklch(0.85_0_0)]">
          {t("login.email_label", locale)}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={status === "error" ? true : undefined}
          aria-describedby={errorMsg ? "email-error" : undefined}
          placeholder={t("login.email_placeholder", locale)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting" || status === "sent"}
          className="bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.5_0_0)]"
        />
      </div>

      <Button
        type="submit"
        variant="gold"
        className="w-full"
        disabled={status === "submitting" || status === "sent"}
      >
        {status === "submitting" ? t("login.submitting", locale) : t("login.submit", locale)}
      </Button>

      <div role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {status === "sent" && (
          <p className="text-[oklch(0.78_0.14_85)]">{t("login.success", locale)}</p>
        )}
        {status === "error" && errorMsg && (
          <p id="email-error" className="text-[oklch(0.7_0.18_25)]">
            {errorMsg}
          </p>
        )}
      </div>
    </form>
  );
}
