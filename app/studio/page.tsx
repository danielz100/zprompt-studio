import { getSupabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "Studio · zprompt-studio" };

export default async function StudioPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="dark min-h-screen bg-[oklch(0.12_0_0)] text-[oklch(0.985_0_0)]">
      <div className="container mx-auto px-6 py-12">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[oklch(0.78_0.14_85)]" aria-hidden />
            <span className="text-xs uppercase tracking-[0.2em] text-[oklch(0.78_0.14_85)]">
              zprompt · studio
            </span>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-xs text-[oklch(0.65_0_0)] hover:text-[oklch(0.985_0_0)] underline-offset-4 hover:underline"
            >
              Sign out
            </button>
          </form>
        </header>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome{user?.email ? `, ${user.email}` : ""}.</h1>
        <p className="mt-3 max-w-xl text-sm text-[oklch(0.65_0_0)]">
          Studio scaffolding (T5). Semantic Sliders + 6-pillar editor land in T7–T10.
          Lovable UI reference frozen on branch{" "}
          <code className="text-[oklch(0.78_0.14_85)]">lovable/ui-ref</code>.
        </p>
      </div>
    </div>
  );
}
