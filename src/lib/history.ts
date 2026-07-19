export interface HistoryEntry {
  id: string;
  shape: string;
  confidence: number;
  probabilities: Record<string, number>;
  image: string; // data URL
  createdAt: number;
  description?: string;
}

const KEY = "auradraw:history";

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveEntry(entry: HistoryEntry) {
  const list = loadHistory();
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
}

export function deleteEntry(id: string) {
  const list = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export type VideoRec = { title: string; url: string; thumb: string };

// YouTube "search" embed: auto-plays the top result for the given query.
// Works for any label (Flower, Cat, Circle, letter A, ...) — no API key needed.
export function youtubeSearchEmbed(query: string): string {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export const SHAPE_VIDEOS: Record<string, VideoRec[]> = {
  Circle: [
    { title: "The Shape Song #1 | Super Simple Songs", url: "https://www.youtube.com/watch?v=TJhfl5vdxp4", thumb: "https://img.youtube.com/vi/TJhfl5vdxp4/hqdefault.jpg" },
    { title: "Shapes Song | The Kiboomers", url: "https://www.youtube.com/watch?v=AnoNb2OMQ6s", thumb: "https://img.youtube.com/vi/AnoNb2OMQ6s/hqdefault.jpg" },
  ],
  Square: [
    { title: "Shapes song for kids | The Singing Walrus", url: "https://www.youtube.com/watch?v=OEbRDtCAFdU", thumb: "https://img.youtube.com/vi/OEbRDtCAFdU/hqdefault.jpg" },
    { title: "The Shapes Song | KidsTV123", url: "https://www.youtube.com/watch?v=pfRuLS-Vnjs", thumb: "https://img.youtube.com/vi/pfRuLS-Vnjs/hqdefault.jpg" },
  ],
  Rectangle: [
    { title: "Shapes | Shapes learning for kids", url: "https://www.youtube.com/watch?v=o-6OKWU99Co", thumb: "https://img.youtube.com/vi/o-6OKWU99Co/hqdefault.jpg" },
    { title: "Shapes Song | The Kiboomers", url: "https://www.youtube.com/watch?v=AnoNb2OMQ6s", thumb: "https://img.youtube.com/vi/AnoNb2OMQ6s/hqdefault.jpg" },
  ],
  Triangle: [
    { title: "Shapes Like Me! Fun Shapes Song | ABCmouse", url: "https://www.youtube.com/watch?v=GwenML6iOEw", thumb: "https://img.youtube.com/vi/GwenML6iOEw/hqdefault.jpg" },
    { title: "Shapes for Toddlers Song", url: "https://www.youtube.com/watch?v=zHSj1jXZx0w", thumb: "https://img.youtube.com/vi/zHSj1jXZx0w/hqdefault.jpg" },
  ],
};

export function getVideosForShape(shape: string): VideoRec[] {
  const key = Object.keys(SHAPE_VIDEOS).find((k) => k.toLowerCase() === shape.toLowerCase());
  if (key) return SHAPE_VIDEOS[key];
  return [
    {
      title: `Learn about ${shape} for kids`,
      url: youtubeSearchUrl(`${shape} for kids educational`),
      thumb: `https://placehold.co/320x180/7c3aed/ffffff?text=${encodeURIComponent(shape)}`,
    },
    {
      title: `Fun facts about ${shape}`,
      url: youtubeSearchUrl(`${shape} fun facts kids`),
      thumb: `https://placehold.co/320x180/06b6d4/ffffff?text=${encodeURIComponent(shape)}`,
    },
  ];
}