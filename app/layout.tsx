import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "zprompt-studio",
  description:
    "Visual prompt-engineering studio for Gemini 3.1 Flash Image — deterministic 6-pillar method.",
  applicationName: "zprompt-studio",
  authors: [{ name: "danielz100" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:px-3 focus:py-2 focus:bg-primary focus:text-primary-foreground rounded-md"
        >
          Saltar al contenido
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
