import { createFileRoute } from "@tanstack/react-router";
import { SHAPE_VIDEOS } from "@/lib/history";

function toEmbed(url: string): string {
  const m = url.match(/[?&]v=([^&]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}
import type { ShapeName } from "@/lib/shape-predict";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — AuraDraw" },
      { name: "description", content: "Curated learning videos about circles, squares, rectangles and triangles." },
    ],
  }),
  component: LearnPage,
});

const shapes: ShapeName[] = ["Circle", "Square", "Rectangle", "Triangle"];

function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Learn</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-black">Shape Learning Library</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fun educational videos for each shape.</p>
      <div className="mt-6 space-y-8">
        {shapes.map((s) => (
          <section key={s}>
            <h2 className="text-2xl font-black text-aura-gradient">{s}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SHAPE_VIDEOS[s].map((v) => (
                <div key={v.url} className="glass-card rounded-2xl p-3">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                    <iframe
                      src={toEmbed(v.url)}
                      title={v.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-2 truncate text-sm font-bold">{v.title}</p>
                  <a href={v.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary">Open on YouTube →</a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}