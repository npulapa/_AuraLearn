import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Pencil, GraduationCap, History, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/draw", label: "Draw", icon: Pencil },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 border-r border-sidebar-border bg-sidebar p-4">
      <Link to="/" className="flex items-center gap-2 px-2 py-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-aura-gradient shadow-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold tracking-tight text-aura-gradient">AuraDraw</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Air Drawing</span>
        </div>
      </Link>
      <nav className="mt-4 flex flex-col gap-1">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-aura-gradient text-white shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl glass-card p-4">
        <p className="text-xs font-semibold">Tip</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use your index finger in the air to draw shapes and let AuraDraw predict them!
        </p>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 flex justify-around rounded-2xl glass-card p-2">
      {items.map((it) => {
        const active = pathname === it.to;
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold",
              active ? "bg-aura-gradient text-white" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}