import { useEffect, useState } from "react";
import { Check, Download, Film, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lesson } from "@/lib/course-data";
import { COIN_EXPORT_PER_MINUTE, exportCost, formatCoins } from "@/lib/coins";
import { cn } from "@/lib/utils";

export function ExportModal({
  open,
  lessons,
  initialLessonId,
  balance,
  onOpenChange,
  onConfirm,
  onTopUp,
}: {
  open: boolean;
  lessons: Lesson[];
  initialLessonId?: string | null;
  balance: number;
  onOpenChange: (o: boolean) => void;
  onConfirm: (cost: number) => void;
  onTopUp: () => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [quality, setQuality] = useState("1080p");
  const [stage, setStage] = useState<"choose" | "rendering" | "done">("choose");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStage("choose");
    setProgress(0);
    setPicked(initialLessonId ? [initialLessonId] : lessons.map((l) => l.id));
  }, [open, initialLessonId, lessons]);

  const chosen = lessons.filter((l) => picked.includes(l.id));
  const { minutes, total } = exportCost(chosen.map((l) => l.duration));
  const enough = balance >= total;

  const start = () => {
    if (!enough) return onTopUp();
    onConfirm(total);
    setStage("rendering");
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setStage("done");
          return 100;
        }
        return p + 8;
      });
    }, 140);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {stage === "choose" && (
          <>
            <DialogHeader>
              <DialogTitle>Xuất video thành phẩm</DialogTitle>
              <DialogDescription>
                Chọn từng video để xuất lẻ, hoặc chọn tất cả để xuất cả bộ bài giảng.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Đã chọn {chosen.length}/{lessons.length} video
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPicked(picked.length === lessons.length ? [] : lessons.map((l) => l.id))
                }
              >
                {picked.length === lessons.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </Button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {lessons.map((l) => (
                <label
                  key={l.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                    picked.includes(l.id) ? "border-primary/50 bg-accent/40" : "border-border",
                  )}
                >
                  <Checkbox
                    checked={picked.includes(l.id)}
                    onCheckedChange={(c) =>
                      setPicked((p) => (c ? [...p, l.id] : p.filter((x) => x !== l.id)))
                    }
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{l.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {l.duration}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Chất lượng</span>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Xuất bản video ({COIN_EXPORT_PER_MINUTE} xu/phút × {minutes} phút)
                </span>
                <span className="font-semibold tabular-nums">−{formatCoins(total)} xu</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Số dư sau khi xuất</span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    enough ? "text-success" : "text-destructive",
                  )}
                >
                  {formatCoins(Math.max(0, balance - total))} xu
                </span>
              </div>
              {!enough && (
                <button
                  onClick={onTopUp}
                  className="mt-2 cursor-pointer text-xs text-primary hover:underline"
                >
                  Không đủ xu – nạp thêm {formatCoins(total - balance)} xu
                </button>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button disabled={chosen.length === 0} onClick={start}>
                <Film className="size-4" /> Xuất {chosen.length} video · {formatCoins(total)} xu
              </Button>
            </DialogFooter>
          </>
        )}

        {stage === "rendering" && (
          <div className="py-6 text-center">
            <DialogTitle className="sr-only">Đang xuất video</DialogTitle>
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium">Đang xuất {chosen.length} video {quality}...</p>
            <Progress value={progress} className="mt-4 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">{progress}%</p>
          </div>
        )}

        {stage === "done" && (
          <div className="py-2">
            <DialogTitle className="sr-only">Đã xuất video</DialogTitle>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
              <Check className="size-7" />
            </span>
            <h2 className="mt-4 text-center text-xl font-semibold">Đã xuất xong</h2>
            <p className="mt-1.5 text-center text-sm text-muted-foreground">
              {chosen.length} video thành phẩm {quality} đã sẵn sàng tải về.
            </p>
            <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
              {chosen.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <span className="flex-1">
                    <span className="block truncate text-sm font-medium">{l.title}.mp4</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {l.duration} · {quality}
                    </span>
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="size-4" /> Tải về
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter className="mt-5">
              <Button variant="outline" onClick={() => setStage("choose")}>
                Xuất thêm video
              </Button>
              <Button onClick={() => onOpenChange(false)}>Xong</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
