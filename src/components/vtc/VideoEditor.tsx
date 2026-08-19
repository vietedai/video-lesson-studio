import { useState } from "react";
import { Pause, Play, RotateCcw, Scissors, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transcript as baseTranscript, type Lesson } from "@/lib/course-data";
import { cn } from "@/lib/utils";

const segments = [
  { keep: true, w: 14 },
  { keep: false, w: 6 },
  { keep: true, w: 20 },
  { keep: false, w: 5 },
  { keep: true, w: 18 },
  { keep: false, w: 8 },
  { keep: true, w: 29 },
];

export function VideoEditor({
  lesson,
  onCancel,
  onSave,
}: {
  lesson: Lesson;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(28);
  const [restored, setRestored] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">Chỉnh nội dung video · {lesson.duration}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={onSave}>Lưu thay đổi</Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main className="flex min-h-0 flex-1 flex-col gap-4 p-5">
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl"
            style={{
              backgroundImage: `linear-gradient(135deg, oklch(0.58 0.13 ${lesson.hue}), oklch(0.32 0.13 ${lesson.hue + 30}))`,
            }}
          >
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-background/90 transition hover:scale-105"
            >
              {playing ? <Pause className="size-6" /> : <Play className="size-6 fill-current" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause /> : <Play />}
            </Button>
            <span className="text-sm tabular-nums text-muted-foreground">
              0{Math.floor(pos / 10)}:{String(Math.floor(pos) % 60).padStart(2, "0")} /{" "}
              {lesson.duration}
            </span>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Scissors className="size-4" /> Cắt tại đây
            </Button>
          </div>

          <div>
            <div
              className="relative flex h-14 cursor-pointer overflow-hidden rounded-xl border border-border"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPos(((e.clientX - r.left) / r.width) * 100);
              }}
            >
              {segments.map((s, i) => (
                <div
                  key={i}
                  style={{ width: `${s.w}%` }}
                  className={cn(
                    "h-full border-r border-background/60",
                    s.keep
                      ? "bg-[image:linear-gradient(180deg,oklch(0.88_0.06_258),oklch(0.8_0.09_258))]"
                      : "bg-[repeating-linear-gradient(45deg,oklch(0.94_0.01_258),oklch(0.94_0.01_258)_6px,oklch(0.88_0.01_258)_6px,oklch(0.88_0.01_258)_12px)]",
                  )}
                />
              ))}
              <div
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-foreground"
                style={{ left: `${pos}%` }}
              />
            </div>
            <div className="mt-2 flex gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-sm bg-[oklch(0.8_0.09_258)]" /> Đoạn được giữ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-sm bg-[oklch(0.9_0.01_258)]" /> AI đã loại bỏ
              </span>
            </div>
          </div>
        </main>

        <aside className="flex w-full min-h-0 flex-col border-t border-border lg:w-[400px] lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Nội dung bài giảng</h2>
            <Info className="size-3.5 text-muted-foreground" />
            <span className="ml-auto text-xs text-muted-foreground">
              Di chuột vào đoạn để xóa
            </span>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
            {baseTranscript.map((t, i) => {
              const isRestored = restored.includes(t.time);
              const isDeleted = deleted.includes(t.time);
              if ((t.removed && !isRestored) || isDeleted) {
                return (
                  <div key={i} className="rounded-xl border border-dashed border-border bg-muted/60 p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-[oklch(0.5_0.13_70)]">
                        {isDeleted ? "Thầy cô đã xóa" : "AI đã loại bỏ"}
                      </span>
                      <span className="text-xs text-muted-foreground">{t.range ?? t.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-through">{t.text}</p>
                    {t.reason && !isDeleted && (
                      <p className="mt-1.5 text-xs text-muted-foreground">Lý do: {t.reason}</p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1.5 -ml-2 text-primary"
                      onClick={() => {
                        setDeleted((d) => d.filter((x) => x !== t.time));
                        setRestored((r) => (r.includes(t.time) ? r : [...r, t.time]));
                      }}
                    >
                      <RotateCcw className="size-3.5" /> Khôi phục đoạn này
                    </Button>
                  </div>
                );
              }
              return (
                <div key={i} className="group flex gap-3 rounded-xl p-3 hover:bg-muted/70">
                  <span className="pt-0.5 text-xs tabular-nums text-muted-foreground">{t.time}</span>
                  <p className="flex-1 text-sm">
                    {t.text}
                    {isRestored && t.removed && (
                      <span className="ml-2 rounded-full bg-success-soft px-2 py-0.5 text-[11px] text-success">
                        đã khôi phục
                      </span>
                    )}
                  </p>
                  <button
                    className="cursor-pointer text-muted-foreground opacity-0 transition group-hover:opacity-100"
                    title="Xóa đoạn này khỏi bài giảng"
                    onClick={() => {
                      setRestored((r) => r.filter((x) => x !== t.time));
                      if (!t.removed) setDeleted((d) => [...d, t.time]);
                    }}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
