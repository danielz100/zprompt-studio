// Interim i18n copy map. Replaced by next-intl in T15.
// V6 — every user-facing string lives here, both ES + EN.

export type Locale = "es" | "en";

export const DEFAULT_LOCALE: Locale = "es";

const COPY = {
  "common.brand": { es: "zprompt-studio", en: "zprompt-studio" },
  "common.tagline": {
    es: "Estudio visual de ingeniería de prompts.",
    en: "Visual prompt-engineering studio.",
  },

  "login.title": { es: "Acceder", en: "Sign in" },
  "login.subtitle": {
    es: "Te enviaremos un enlace mágico al correo. Sin contraseñas.",
    en: "We'll email you a magic link. No passwords.",
  },
  "login.email_label": { es: "Correo electrónico", en: "Email" },
  "login.email_placeholder": { es: "tu@correo.com", en: "you@example.com" },
  "login.submit": { es: "Enviar enlace mágico", en: "Send magic link" },
  "login.submitting": { es: "Enviando…", en: "Sending…" },
  "login.success": {
    es: "Revisa tu correo. El enlace expira en 1 hora.",
    en: "Check your email. The link expires in 1 hour.",
  },
  "login.error_generic": {
    es: "No se pudo enviar el enlace. Inténtalo de nuevo.",
    en: "Couldn't send the link. Try again.",
  },
  "login.error_invalid_email": {
    es: "Introduce un correo válido.",
    en: "Enter a valid email.",
  },

  "callback.exchanging": { es: "Iniciando sesión…", en: "Signing you in…" },
  "callback.error": {
    es: "El enlace no es válido o expiró. Solicita uno nuevo.",
    en: "Link invalid or expired. Request a new one.",
  },

  "auth.skip_to_content": {
    es: "Saltar al contenido",
    en: "Skip to content",
  },
} as const;

export type CopyKey = keyof typeof COPY;

export function t(key: CopyKey, locale: Locale = DEFAULT_LOCALE): string {
  return COPY[key][locale];
}
