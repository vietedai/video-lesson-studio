import { useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Check,
  Play,
  Search,
  Settings2,
  Sparkles,
  Upload,
  Video,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
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
import { Thumb } from "./Thumb";
import { CoinBadge } from "./CoinBadge";
import { zoomRecordings, sourceVideo } from "@/lib/course-data";
import { COIN_PER_MINUTE, costFor, durationToMinutes, formatCoins } from "@/lib/coins";
import { cn } from "@/lib/utils";

export type SelectedSource = {
  title: string;
  duration: string;
  date: string;
  source: string;
  hue: number;
};

const removalOptions = [
  "Khoảng lặng dài",
  "Trao đổi ngoài nội dung bài học",
  "Sự cố kỹ thuật",
  "Nội dung lặp lại",
  "Các đoạn không liên quan",
];

export function SelectVideoScreen({
  selected,
  onSelect,
  onStart,
  onPreview,
  balance,
  onTopUp,
}: {
  selected: SelectedSource | null;
  onSelect: (s: SelectedSource | null) => void;
  onStart: () => void;
  onPreview: () => void;
  balance: number;
  onTopUp: () => void;
}) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [pick, setPick] = useState("z1");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [advanced, setAdvanced] = useState(false);
  const [organize, setOrganize] = useState("auto");
  const [removals, setRemovals] = useState<string[]>(removalOptions);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [applied, setApplied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = zoomRecordings.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) &&
      (period === "all" || (period === "7" ? r.date >= "12/08/2026" : true)),
  );

  const startUpload = () => {
    if (uploading) return;
    setUploading(true);
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setUploading(false);
          onSelect({
            title: "Bai giang tuan 3.mp4",
            duration: "45:32",
            date: "19/08/2026",
            source: "Tải lên",
            hue: 200,
          });
          return 100;
        }
        return p + 10;
      });
    }, 130);
  };

  const cost = selected ? costFor(selected.duration) : 0;
  const minutes = selected ? durationToMinutes(selected.duration) : 0;
  const enough = balance >= cost;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14">
      <div className="flex justify-end">
        <CoinBadge balance={balance} onTopUp={onTopUp} />
      </div>
      <header className="mt-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkles className="size-3.5" /> Trợ lý AI cho giáo viên
        </span>
        <h1 className="mt-4 text-4xl font-bold">Tạo bài giảng từ video</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted-foreground">
          AI giúp thầy cô biến video lớp học thành các video bài giảng ngắn gọn, sẵn sàng sử dụng.
        </p>
      </header>

      <div className="mt-10">
        {!selected ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface flex flex-col p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Video className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Chọn từ Zoom</h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                Sử dụng video từ các buổi học đã ghi hình trên Zoom.
              </p>
              <Button className="mt-5 w-full" onClick={() => setZoomOpen(true)}>
                Chọn video
              </Button>
            </div>

            <div
              className={cn(
                "surface flex flex-col p-6 transition-colors",
                uploading && "border-primary/40",
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                startUpload();
              }}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Upload className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Tải video lên</h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                Chọn video bài giảng có sẵn trên máy tính. Kéo thả video vào đây cũng được.
              </p>
              {uploading ? (
                <div className="mt-5">
                  <Progress value={progress} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">Đang tải lên {progress}%</p>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="mt-5 w-full" onClick={startUpload}>
                    Chọn tệp video
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Hỗ trợ MP4, MOV, WebM
                  </p>
                </>
              )}
              <input ref={fileRef} type="file" hidden accept="video/*" />
            </div>
          </div>
        ) : (
          <div className="surface flex flex-wrap items-center gap-4 p-4">
            <Thumb hue={selected.hue} className="h-20 w-32" />
            <div className="min-w-52 flex-1">
              <h2 className="text-base font-semibold">{selected.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Video gốc · {selected.duration}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ngày ghi hình: {selected.date} · Nguồn: {selected.source}
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onPreview}>
                <Play className="size-4" /> Xem video
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
                <RefreshCw className="size-4" /> Đổi video
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Button
          variant="ai"
          size="xl"
          className="w-full max-w-md"
          disabled={!selected}
          onClick={onStart}
        >
          <Sparkles className="size-5" />
          {selected ? `AI biên tập bài giảng · ${formatCoins(cost)} xu` : "AI biên tập bài giảng"}
        </Button>
        {selected ? (
          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            {minutes} phút video × {COIN_PER_MINUTE} xu/phút.{" "}
            {enough ? (
              <>Số dư sau khi biên tập: {formatCoins(balance - cost)} xu.</>
            ) : (
              <button onClick={onTopUp} className="cursor-pointer text-primary hover:underline">
                Không đủ xu – nạp thêm {formatCoins(cost - balance)} xu
              </button>
            )}
          </p>
        ) : (
          <p className="mt-2.5 text-xs text-muted-foreground">
            Chi phí {COIN_PER_MINUTE} xu cho mỗi phút video gốc.
          </p>
        )}
        <button
          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setAdvanced((v) => !v)}
        >
          <Settings2 className="size-4" /> Tùy chọn nâng cao
          <ChevronDown className={cn("size-4 transition-transform", advanced && "rotate-180")} />
        </button>
      </div>

      {advanced && (
        <div className="surface mt-5 p-6">
          <h3 className="text-base font-semibold">Tùy chọn AI</h3>

          <p className="mt-5 text-sm font-medium">Cách tổ chức nội dung</p>
          <RadioGroup value={organize} onValueChange={setOrganize} className="mt-3 gap-3">
            {[
              {
                v: "auto",
                t: "AI tự đề xuất",
                tag: "Khuyến nghị",
                d: "AI tự xác định cách chia bài phù hợp nhất với nội dung.",
              },
              {
                v: "sequence",
                t: "Theo trình tự bài giảng",
                d: "Giữ nguyên thứ tự nội dung trong video gốc.",
              },
              {
                v: "topic",
                t: "Theo chủ đề",
                d: "AI gom các nội dung cùng chủ đề thành từng bài.",
              },
            ].map((o) => (
              <label
                key={o.v}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors",
                  organize === o.v ? "border-primary/50 bg-accent/50" : "border-border",
                )}
              >
                <RadioGroupItem value={o.v} id={o.v} className="mt-0.5" />
                <span>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {o.t}
                    {o.tag && (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
                        {o.tag}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{o.d}</span>
                </span>
              </label>
            ))}
          </RadioGroup>

          <p className="mt-6 text-sm font-medium">AI tự động loại bỏ</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {removalOptions.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={removals.includes(o)}
                  onCheckedChange={(c) =>
                    setRemovals((r) => (c ? [...r, o] : r.filter((x) => x !== o)))
                  }
                />
                <span>{o}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {applied && (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <Check className="size-4" /> Đã áp dụng
              </span>
            )}
            <Button
              variant="soft"
              onClick={() => {
                setApplied(true);
                setAdvanced(false);
              }}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video đã ghi hình trên Zoom</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm buổi học..."
                className="pl-9"
              />
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-44">
                <Calendar className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="7">7 ngày gần đây</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {filtered.map((r) => (
              <label
                key={r.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                  pick === r.id ? "border-primary/50 bg-accent/40" : "border-border",
                )}
              >
                <input
                  type="radio"
                  className="accent-[oklch(0.55_0.19_258)]"
                  checked={pick === r.id}
                  onChange={() => setPick(r.id)}
                />
                <Thumb hue={r.hue} className="h-14 w-24" showPlay={false} label={r.duration} />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{r.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {r.date} · {r.duration} · {r.host}
                  </span>
                </span>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Không tìm thấy buổi học nào.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setZoomOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                const r = zoomRecordings.find((x) => x.id === pick)!;
                onSelect({
                  title: r.title,
                  duration: r.id === "z1" ? sourceVideo.duration : r.duration,
                  date: r.date,
                  source: "Zoom",
                  hue: r.hue,
                });
                setZoomOpen(false);
              }}
            >
              Chọn video này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
