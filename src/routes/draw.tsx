import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, XCircle, Trash2, Undo2, Save, Sparkles, Loader2, Hand } from "lucide-react";
import { toast } from "sonner";
import { saveEntry, youtubeSearchEmbed, youtubeSearchUrl } from "@/lib/history";
import { predictDrawing, type AiPrediction } from "@/lib/predict.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/draw")({
  head: () => ({
    meta: [
      { title: "Draw — AuraDraw" },
      { name: "description", content: "Draw shapes in the air using your webcam and AuraDraw's hand tracking." },
    ],
  }),
  component: DrawPage,
});

type Stroke = { x: number; y: number }[];
type CamStatus = "idle" | "requesting" | "connected" | "denied";

declare global {
  interface Window {
    Hands?: any;
    Camera?: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function DrawPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const drawingRef = useRef(false);
  const [camStatus, setCamStatus] = useState<CamStatus>("idle");
  const [handDetected, setHandDetected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [prediction, setPrediction] = useState<AiPrediction | null>(null);
  const predictFn = useServerFn(predictDrawing);

  // Enable camera + MediaPipe
  async function enableCamera() {
    setCamStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamStatus("connected");
      await initMediaPipe();
    } catch (e) {
      console.error(e);
      setCamStatus("denied");
      toast.error("Camera access denied. You can still draw with your mouse or finger below.");
    }
  }

  async function initMediaPipe() {
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
      if (!window.Hands || !videoRef.current) return;
      const hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
      hands.onResults(onResults);
      const cam = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480,
      });
      cam.start();
    } catch (e) {
      console.error("MediaPipe load failed", e);
      toast.error("Hand tracking failed to load. Mouse drawing still works.");
    }
  }

  function onResults(results: any) {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d")!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    const hasHand = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    setHandDetected(hasHand);
    if (!hasHand) {
      if (drawingRef.current) {
        drawingRef.current = false;
        currentRef.current = null;
      }
      return;
    }
    const lm = results.multiHandLandmarks[0];
    // draw landmarks
    ctx.fillStyle = "#a855f7";
    for (const p of lm) {
      ctx.beginPath();
      ctx.arc((1 - p.x) * overlay.width, p.y * overlay.height, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // index tip = 8, thumb tip = 4
    const tip = lm[8];
    const thumb = lm[4];
    const dist = Math.hypot(tip.x - thumb.x, tip.y - thumb.y);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc((1 - tip.x) * overlay.width, tip.y * overlay.height, 10, 0, Math.PI * 2);
    ctx.stroke();
    const canvas = canvasRef.current;
    if (!canvas) return;
    // map index tip to canvas coords (mirrored)
    const cx = (1 - tip.x) * canvas.width;
    const cy = tip.y * canvas.height;
    // pinch (thumb close to index) = pen up
    const penDown = dist > 0.06;
    if (penDown) {
      if (!drawingRef.current) {
        drawingRef.current = true;
        currentRef.current = [];
        strokesRef.current.push(currentRef.current);
      }
      currentRef.current!.push({ x: cx, y: cy });
      redrawCanvas();
    } else if (drawingRef.current) {
      drawingRef.current = false;
      currentRef.current = null;
    }
  }

  function redrawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#7c3aed");
    grad.addColorStop(1, "#06b6d4");
    ctx.strokeStyle = grad;
    for (const s of strokesRef.current) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
      ctx.stroke();
    }
  }

  // Mouse/touch fallback drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawCanvas();
    const getPos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * canvas.width, y: ((e.clientY - r.top) / r.height) * canvas.height };
    };
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      currentRef.current = [getPos(e)];
      strokesRef.current.push(currentRef.current);
      drawingRef.current = true;
    };
    const move = (e: PointerEvent) => {
      if (!drawingRef.current || !currentRef.current) return;
      currentRef.current.push(getPos(e));
      redrawCanvas();
    };
    const up = () => {
      drawingRef.current = false;
      currentRef.current = null;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, []);

  function clearCanvas() {
    strokesRef.current = [];
    setPrediction(null);
    redrawCanvas();
  }
  function undo() {
    strokesRef.current.pop();
    redrawCanvas();
  }
  function saveDrawing() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `auradraw-${Date.now()}.png`;
    a.click();
    toast.success("Drawing saved!");
  }

  async function runPrediction() {
    const allPoints = strokesRef.current.flat();
    if (allPoints.length < 10) {
      toast.error("Draw a shape first!");
      return;
    }
    setProcessing(true);
    setPrediction(null);
    setProcessStep(0);
    const canvas = canvasRef.current!;
    const image = canvas.toDataURL("image/png");
    // Kick off animation in parallel with the network request
    const steps = 6;
    const anim = (async () => {
      for (let i = 1; i <= steps; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setProcessStep(i);
      }
    })();
    try {
      const [pred] = await Promise.all([predictFn({ data: { image } }), anim]);
      setPrediction(pred);
      saveEntry({
        id: crypto.randomUUID(),
        shape: pred.shape,
        confidence: pred.confidence,
        probabilities: pred.probabilities,
        description: pred.description,
        image,
        createdAt: Date.now(),
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Prediction failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // stop tracks on unmount
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      const s = v?.srcObject as MediaStream | null;
      s?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Studio</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-black">Air Drawing Canvas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Point your index finger at the camera. Pinch to lift the pen.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full glass-card px-4 py-2 text-xs font-bold">
          {camStatus === "connected" ? (
            <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Camera Connected</>
          ) : camStatus === "denied" ? (
            <><XCircle className="h-4 w-4 text-rose-500" /> Camera Not Detected</>
          ) : (
            <><Camera className="h-4 w-4 text-primary" /> Camera Idle</>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Webcam */}
        <div className="glass-card rounded-3xl p-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
            <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover [transform:scaleX(-1)]" playsInline muted />
            <canvas ref={overlayRef} width={640} height={480} className="absolute inset-0 h-full w-full pointer-events-none" />
            {camStatus !== "connected" && (
              <div className="absolute inset-0 grid place-items-center bg-black/70 text-white">
                <div className="text-center">
                  <Camera className="mx-auto h-10 w-10" />
                  <p className="mt-3 text-sm">{camStatus === "denied" ? "Camera access blocked." : "Camera preview will appear here"}</p>
                  <button onClick={enableCamera} className="mt-4 rounded-full bg-aura-gradient px-5 py-2 text-sm font-bold">
                    {camStatus === "requesting" ? "Requesting..." : "Enable Camera"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Hand className={`h-4 w-4 ${handDetected ? "text-emerald-500" : "text-muted-foreground"}`} />
            <span className="font-semibold">
              {handDetected ? "Hand detected — move your index finger to draw" : "Move your index finger to start drawing."}
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div className="glass-card rounded-3xl p-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-white touch-none">
            <canvas ref={canvasRef} width={640} height={480} className="h-full w-full cursor-crosshair" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={clearCanvas} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold hover:bg-muted">
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
            <button onClick={undo} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold hover:bg-muted">
              <Undo2 className="h-3.5 w-3.5" /> Undo
            </button>
            <button onClick={saveDrawing} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold hover:bg-muted">
              <Save className="h-3.5 w-3.5" /> Save
            </button>
            <button onClick={runPrediction} disabled={processing} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-aura-gradient px-5 py-2 text-xs font-bold text-white shadow-md disabled:opacity-60">
              {processing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Predict Shape
            </button>
          </div>
        </div>
      </div>

      {/* Processing */}
      {processing && (
        <div className="mt-6 glass-card rounded-3xl p-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <h2 className="text-lg font-black">Processing your drawing…</h2>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {["Grayscale", "Gaussian Blur", "Thresholding", "Contour Detection", "Resize (224×224)", "Normalization"].map((s, i) => (
              <li key={s} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${i < processStep ? "bg-primary/10 text-foreground" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className={`h-4 w-4 ${i < processStep ? "text-emerald-500" : "text-muted-foreground/50"}`} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prediction */}
      {prediction && !processing && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 animate-fade-in">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">AI Prediction</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-black text-aura-gradient">{prediction.shape}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
            {prediction.description && (
              <p className="mt-2 text-sm">{prediction.description}</p>
            )}
            <div className="mt-6 space-y-3">
              {Object.entries(prediction.probabilities).map(([name, p]) => (
                <div key={name}>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{name}</span>
                    <span>{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-aura-gradient" style={{ width: `${p * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 animate-fade-in">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Learn More</p>
            <h3 className="mt-2 text-xl font-black">Videos about {prediction.shape}</h3>
            <div className="mt-4 space-y-4">
              {[
                { label: `${prediction.shape} for kids educational`, title: `Learn about ${prediction.shape}` },
                { label: `${prediction.shape} fun facts kids song`, title: `Fun facts about ${prediction.shape}` },
              ].map((v) => (
                <div key={v.label} className="rounded-2xl border border-border bg-card p-3">
                  <p className="mb-2 text-sm font-bold">{v.title}</p>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                    <iframe
                      src={youtubeSearchEmbed(v.label)}
                      title={v.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <a href={youtubeSearchUrl(v.label)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-primary hover:underline">
                    Open on YouTube →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}