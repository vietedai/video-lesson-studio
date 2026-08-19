import { useState } from "react";
import {
  ArrowDown,
  Check,
  ChevronDown,
  GripVertical,
  Info,
  Pencil,
  Play,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Thumb } from "./Thumb";
import { removedBreakdown, type Lesson } from "@/lib/course-data";
import { cn } from "@/lib/utils";

export function ReadyScreen({
  lessons,
  course,
  onCourseChange,
  onReorder,
  onPreview,
  onEdit,
  onUse,
  onShowDetails,
  onExport,
  sourceDuration,
}: {
  lessons: Lesson[];
  course: { title: string; description: string };
  onCourseChange: (c: { title: string; description: string }) => void;
  onReorder: (from: number, to: number) => void;
  onPreview: (i: number) => void;
  onEdit: (l: Lesson) => void;
  onUse: () => void;
  onShowDetails: () => void;
  onExport: (lessonId?: string) => void;
  sourceDuration: string;
}) {
  const [editing, setEditing] = useState(false);
  const [explain, setExplain] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-32 pt-12">
      <header className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
          <Check className="size-6" />
        </span>
        <h1 className="mt-4 text-3xl font-bold">Bài giảng đã sẵn sàng</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          AI đã biên tập video và tạo các bài học bên dưới.
        </p>
      </header>

      <section className="surface mt-8 p-6">
        {editing ? (
          <div className="space-y-3">
            <Input
              value={course.title}
              onChange={(e) => onCourseChange({ ...course, title: e.target.value })}
              className="text-base font-semibold"
            />
            <Textarea
              value={course.description}
              rows={3}
              onChange={(e) => onCourseChange({ ...course, description: e.target.value })}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setEditing(false)}>
                Xong
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <button
                className="mt-1 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => setEditing(true)}
                aria-label="Sửa tên bài giảng"
              >
                <Pencil className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
          </>
        )}

        <button
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm text-primary hover:underline"
          onClick={() => setExplain((v) => !v)}
        >
          <Info className="size-4" /> AI đã biên tập những gì?
          <ChevronDown className={cn("size-4 transition-transform", explain && "rotate-180")} />
        </button>

        {explain && (
          <div className="ai-surface mt-3 p-4">
            <p className="text-sm font-medium">AI đã loại bỏ 17:16</p>
            <ul className="mt-2.5 space-y-1.5">
              {removedBreakdown.map((r) => (
                <li key={r.label} className="flex justify-between text-sm text-muted-foreground">
                  <span>{r.label}</span>
                  <span className="tabular-nums">{r.value}</span>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={onShowDetails}>
              Xem chi tiết
            </Button>
          </div>
        )}
      </section>

      <section className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-xl bg-muted/60 px-6 py-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Video gốc</p>
          <p className="text-lg font-semibold tabular-nums">{sourceDuration}</p>
        </div>
        <ArrowDown className="size-4 rotate-[-90deg] text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Sau biên tập</p>
          <p className="text-lg font-semibold tabular-nums text-success">28:16</p>
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div>
          <p className="text-xs text-muted-foreground">AI đã tạo</p>
          <p className="text-lg font-semibold">{lessons.length} bài</p>
        </div>
        <p className="w-full text-xs text-muted-foreground">
          Tiết kiệm 17:16 nội dung không cần thiết
        </p>
      </section>

      <section className="mt-6 space-y-3">
        {lessons.map((l, i) => (
          <div
            key={l.id}
            draggable
            onDragStart={() => setDrag(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (drag !== null && drag !== i) onReorder(drag, i);
              setDrag(null);
            }}
            className={cn(
              "surface flex items-center gap-4 p-4 transition-shadow",
              drag === i && "opacity-60",
            )}
          >
            <Thumb hue={l.hue} className="h-16 w-28" showPlay={false} label={l.duration} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">
                {String(i + 1).padStart(2, "0")}. {l.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{l.duration}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="size-3" /> AI đã biên tập từ video gốc.
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => onPreview(i)}>
                <Play className="size-4" /> Xem
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(l)}>
                <Pencil className="size-4" /> Chỉnh sửa
              </Button>
              <Button
                variant="ghost"
                size="sm"
                title="Xuất riêng video này"
                onClick={() => onExport(l.id)}
              >
                <Download className="size-4" /> Xuất
              </Button>
              <span className="cursor-grab text-muted-foreground" title="Kéo để đổi thứ tự">
                <GripVertical className="size-4" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <p className="hidden text-sm text-muted-foreground sm:block">
            {lessons.length} bài giảng sẽ được sử dụng
          </p>
          <div className="flex flex-1 justify-end gap-2 sm:flex-none">
            <Button variant="outline" size="lg" onClick={() => onExport()}>
              <Download className="size-4" /> Xuất video
            </Button>
            <Button variant="success" size="lg" onClick={onUse}>
              <Check className="size-4" /> Sử dụng các video này
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
