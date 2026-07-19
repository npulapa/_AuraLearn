import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles, Hand, Brain, Play, GraduationCap, Palette, Camera } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Learning
        </div>
        <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
          Draw shapes in the <span className="text-aura-gradient">air</span>,<br />
          let <span className="text-aura-gradient">AuraDraw</span> guess them.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A playful, kid-friendly web app that watches your finger through the webcam,
          turns your gestures into drawings, and uses AI to recognize the shape and
          teach you about it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/draw"
            className="inline-flex items-center gap-2 rounded-full bg-aura-gradient px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" /> Start Drawing
          </Link>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground hover:bg-muted"
          >
            <GraduationCap className="h-4 w-4" /> Explore Learning
          </Link>
        </div>

        {/* Preview card */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { icon: Camera, title: "Webcam Powered", desc: "Uses your camera + MediaPipe to detect your hand." },
            { icon: Hand, title: "Air Drawing", desc: "Your index finger becomes a virtual pen." },
            { icon: Brain, title: "AI Recognition", desc: "Predicts if you drew a circle, square, rectangle or triangle." },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-3xl p-6 animate-fade-in">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-aura-gradient">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">About AuraDraw</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black">Learn shapes by drawing them with your hand.</h2>
            <p className="mt-4 text-muted-foreground">
              AuraDraw is an educational playground that combines computer vision and AI.
              Kids move their index finger in front of the webcam to sketch shapes, and
              our model recognizes the drawing and suggests videos to keep the curiosity going.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-4">
              {["Circle", "Square", "Rectangle", "Triangle"].map((s) => (
                <div key={s} className="rounded-2xl bg-aura-gradient/10 border border-border p-4 text-center">
                  <Palette className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-bold">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Features</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-black">Everything you need to draw & learn</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Hand Tracking", "MediaPipe Hands detects 21 landmarks on your hand in real time."],
            ["Air Canvas", "Move your index finger — pinch to lift the pen."],
            ["Undo / Clear / Save", "Full canvas controls for messy little artists."],
            ["Shape AI", "Classifies your drawing into Circle, Square, Rectangle or Triangle."],
            ["Learning Videos", "Curated YouTube videos for every recognized shape."],
            ["History", "Every prediction is saved locally so you can revisit it."],
          ].map(([title, desc]) => (
            <div key={title} className="glass-card rounded-3xl p-6">
              <h3 className="text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
