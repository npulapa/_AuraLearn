import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Camera, Info, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AuraDraw" },
      { name: "description", content: "Adjust AuraDraw preferences: theme, camera, help and about." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("auradraw:theme");
    const d = saved === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("auradraw:theme", next ? "dark" : "light");
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Preferences</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-black">Settings</h1>
      <div className="mt-6 space-y-4">
        <div className="glass-card flex items-center justify-between rounded-3xl p-5">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <p className="font-bold">Appearance</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark mode.</p>
            </div>
          </div>
          <button onClick={toggle} className={`h-7 w-12 rounded-full transition-colors ${dark ? "bg-aura-gradient" : "bg-muted"}`}>
            <span className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${dark ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-primary" />
            <div>
              <p className="font-bold">Camera</p>
              <p className="text-xs text-muted-foreground">AuraDraw needs webcam access to detect your hand. Manage permissions in your browser settings.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <p className="font-bold">About</p>
              <p className="text-xs text-muted-foreground">AuraDraw v1.0 — An AI-powered hand gesture drawing and shape recognition app built for curious learners.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="font-bold">Help</p>
              <p className="text-xs text-muted-foreground">
                1. Open Draw and enable your camera. 2. Show one hand to the camera. 3. Move your index finger to draw. 4. Pinch (thumb + index) to lift the pen. 5. Tap Predict Shape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}