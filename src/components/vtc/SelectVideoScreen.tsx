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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  COIN_TRANSCRIBE_PER_MINUTE,
  COIN_VIDEO_PER_MINUTE,
  editCostBreakdown,
  formatCoins,
} from "@/lib/coins";
import { cn } from "@/lib/utils";

export type SelectedSource = {
  id: string;
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

const uploadBatch: SelectedSource[] = [
  {
    id: "u1",
    title: "Bai giang tuan 3.mp4",
    duration: "45:32",
    date: "19/08/2026",
    source: "Tải lên",
    hue: 200,
  },
  {
    id: "u2",
    title: "Bai giang tuan 3 - phan 2.mp4",
    duration: "22:10",
    date: "19/08/2026",
    source: "Tải lên",
    hue: 280,
  },
];

export function SelectVideoScreen({
  selected,
  onSelect,
  onStart,
  onPreview,
  balance,
  onTopUp,
}: {
  selected: SelectedSource[];
  onSelect: (s: SelectedSource[]) => void;
  onStart: () => void;
  onPreview: () => void;
  balance: number;
  onTopUp: () => void;
}) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [pick, setPick] = useState<string[]>(["z1"]);
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

  const addSources = (items: SelectedSource[]) => {
    const map = new Map(selected.map((s) => [s.id, s]));
    items.forEach((i) => map.set(i.id, i));
    onSelect([...map.values()]);
  };

  const startUpload = () => {
    if (uploading) return;
    setUploading(true);
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setUploading(false);
          addSources(uploadBatch);
          return 100;
        }
        return p + 10;
      });
    }, 130);
  };

  const has = selected.length > 0;
  const { minutes, transcribe, video, total } = editCostBreakdown(
    selected.map((s) => s.duration),
  );
  const enough = balance >= total;

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

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="surface flex flex-col p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Video className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Chọn từ Zoom</h2>
          <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
            Chọn một hoặc nhiều buổi học đã ghi hình trên Zoom.
          </p>
          <Button
            variant={has ? "outline" : "default"}
            className="mt-5 w-full"
            onClick={() => setZoomOpen(true)}
          >
            {has ? "Thêm video từ Zoom" : "Chọn video"}
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
            Chọn nhiều video cùng lúc từ máy tính. Kéo thả cả nhóm video vào đây cũng được.
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
                Hỗ trợ MP4, MOV, WebM · chọn nhiều tệp
              </p>
            </>
          )}
          <input ref={fileRef} type="file" hidden multiple accept="video/*" />
        </div>
      </div>

      {has && (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selected.length} video đã chọn · {minutes} phút
            </p>
            <Button variant="ghost" size="sm" onClick={() => onSelect([])}>
              Bỏ chọn tất cả
            </Button>
          </div>
          {selected.map((s) => (
            <div key={s.id} className="surface flex flex-wrap items-center gap-4 p-3">
              <Thumb hue={s.hue} className="h-14 w-24" showPlay={false} label={s.duration} />
              <div className="min-w-40 flex-1">
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.date} · {s.duration} · {s.source}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onPreview}>
                <Play className="size-4" /> Xem
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Bỏ video này"
                onClick={() => onSelect(selected.filter((x) => x.id !== s.id))}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center">
        <Button
          variant="ai"
          size="xl"
          className="w-full max-w-md"
          disabled={!has}
          onClick={onStart}
        >
          <Sparkles className="size-5" />
          {has ? `AI biên tập bài giảng · ${formatCoins(total)} xu` : "AI biên tập bài giảng"}
        </Button>

        <div className="mt-3 w-full max-w-md rounded-xl bg-muted/60 p-4 text-sm">
          <p className="font-medium">Chi phí biên tập được tính như sau</p>
          <div className="mt-2.5 space-y-1.5 text-muted-foreground">
            <div className="flex justify-between gap-4">
              <span>Bóc băng &amp; phân tích nội dung ({COIN_TRANSCRIBE_PER_MINUTE} xu/phút)</span>
              <span className="tabular-nums text-foreground">
                {has ? `${formatCoins(transcribe)} xu` : `${COIN_TRANSCRIBE_PER_MINUTE} xu/phút`}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Dựng video bài giảng ({COIN_VIDEO_PER_MINUTE} xu/phút)</span>
              <span className="tabular-nums text-foreground">
                {has ? `${formatCoins(video)} xu` : `${COIN_VIDEO_PER_MINUTE} xu/phút`}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-1.5 font-medium text-foreground">
              <span>Tổng {has ? `(${minutes} phút)` : ""}</span>
              <span className="tabular-nums">
                {has ? `${formatCoins(total)} xu` : "5 xu/phút"}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Chi phí xuất bản video thành phẩm được tính riêng khi thầy cô xuất video.
          </p>
          {has && !enough && (
            <button onClick={onTopUp} className="mt-2 cursor-pointer text-xs text-primary hover:underline">
              Không đủ xu – nạp thêm {formatCoins(total - balance)} xu
            </button>
          )}
        </div>

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
                  pick.includes(r.id) ? "border-primary/50 bg-accent/40" : "border-border",
                )}
              >
                <Checkbox
                  checked={pick.includes(r.id)}
                  onCheckedChange={(c) =>
                    setPick((p) => (c ? [...p, r.id] : p.filter((x) => x !== r.id)))
                  }
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

          <DialogFooter className="items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Đã chọn {pick.length} video</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setZoomOpen(false)}>
                Hủy
              </Button>
              <Button
                disabled={pick.length === 0}
                onClick={() => {
                  addSources(
                    zoomRecordings
                      .filter((x) => pick.includes(x.id))
                      .map((r) => ({
                        id: r.id,
                        title: r.title,
                        duration: r.id === "z1" ? sourceVideo.duration : r.duration,
                        date: r.date,
                        source: "Zoom",
                        hue: r.hue,
                      })),
                  );
                  setZoomOpen(false);
                }}
              >
                Chọn {pick.length > 1 ? `${pick.length} video` : "video này"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
