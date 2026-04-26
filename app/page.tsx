export default function Home() {
  return (
    <section className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight">zprompt-studio</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        Visual prompt-engineering studio for Gemini 3.1 Flash Image. Deterministic 6-pillar method. BYOK. MIT.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        Scaffolding stage (T1). See <code>SPEC.md</code> for the full architecture.
      </p>
    </section>
  );
}
