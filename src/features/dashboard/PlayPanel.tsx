import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { useStore } from "../../lib/store";
import { launchGame } from "../../lib/tauri";

const LOADERS = ["Vanilla", "Fabric", "Forge", "NeoForge", "Quilt"] as const;
type Loader = (typeof LOADERS)[number];
const VERSIONS = ["1.21.4", "1.21.1", "1.20.4", "1.20.1", "1.19.4", "1.18.2", "1.16.5", "1.12.2", "1.8.9"];

export default function PlayPanel() {
  const { activeId } = useStore();
  const [loader, setLoader] = useState<Loader>("Fabric");
  const [version, setVersion] = useState("1.21.1");
  const [ram, setRam] = useState(4096);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  const play = async () => {
    if (!activeId || progress !== null) return;
    // Mô phỏng tiến trình; module Engine sau sẽ nhận sự kiện thật từ Rust
    const steps = ["Kiểm tra Java…", "Tải thư viện…", "Tải assets…", "Áp dụng bộ mod FPS…", "Khởi động game…"];
    for (let i = 0; i < steps.length; i++) {
      setStatus(steps[i]);
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise((r) => setTimeout(r, 500));
    }
    await launchGame(activeId, `${loader}-${version}`, ram);
    setProgress(null);
    setStatus("");
  };

  return (
    <GlassCard
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="mx-auto w-full max-w-2xl p-6"
    >
      <h2 className="text-2xl font-semibold tracking-tight">Sẵn sàng chơi</h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {LOADERS.map((l) => (
          <button
            key={l}
            onClick={() => setLoader(l)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${loader === l ? "bg-sky-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <label className="mt-5 block text-xs" style={{ color: "var(--text-dim)" }}>Phiên bản Minecraft</label>
      <select
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        className="mt-1 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm outline-none"
      >
        {VERSIONS.map((v) => <option key={v} value={v} className="text-black">{v}</option>)}
      </select>

      <div className="mt-5">
        <div className="flex justify-between text-xs" style={{ color: "var(--text-dim)" }}>
          <span>RAM cấp phát</span><span>{(ram / 1024).toFixed(1)} GB</span>
        </div>
        <input
          type="range" min={1024} max={16384} step={512} value={ram}
          onChange={(e) => setRam(+e.target.value)}
          className="mt-2 w-full accent-sky-500"
        />
      </div>

      <motion.button
        onClick={play}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className="relative mt-7 flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-[26px] bg-gradient-to-r from-sky-500 to-indigo-500 text-xl font-semibold text-white shadow-lg"
      >
        {progress !== null && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-white/25"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {progress === null ? (<><Play fill="white" size={22} /> PLAY</>) : status}
        </span>
      </motion.button>
    </GlassCard>
  );
}
