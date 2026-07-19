import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, History as HistoryIcon } from "lucide-react";
import { deleteEntry, loadHistory, type HistoryEntry } from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — AuraDraw" },
      { name: "description", content: "Your past shape predictions saved on this device." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  useEffect(() => setEntries(loadHistory()), []);
  function remove(id: string) {
    deleteEntry(id);
    setEntries(loadHistory());
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Library</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-black">Prediction History</h1>
      <p className="mt-1 text-sm text-muted-foreground">All predictions from this device.</p>

      {entries.length === 0 ? (
        <div className="mt-10 glass-card rounded-3xl p-10 text-center">
          <HistoryIcon className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 font-bold">No drawings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Head to the Draw studio and predict your first shape.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => {
            const d = new Date(e.createdAt);
            return (
              <div key={e.id} className="glass-card rounded-3xl p-4">
                <img src={e.image} alt={e.shape} className="aspect-video w-full rounded-2xl border border-border bg-white object-contain" />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-aura-gradient">{e.shape}</p>
                    <p className="text-xs text-muted-foreground">{(e.confidence * 100).toFixed(1)}% confidence</p>
                  </div>
                  <button onClick={() => remove(e.id)} className="rounded-full border border-border p-2 hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{d.toLocaleDateString()}</span>
                  <span>{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}