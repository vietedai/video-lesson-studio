import { ChevronLeft, ChevronRight, Pause, Play, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import type { Lesson } from "@/lib/course-data";

export function PreviewModal({
  lessons,
  index,
  onIndexChange,
  onClose,
  onEdit,
}: {
  lessons: Lesson[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  onEdit: (l: Lesson) => void;
}) {
  const [playing, setPlaying] = useState(true);
  const lesson = index !== null ? lessons[index] : undefined;

  return (
    <Dialog open={index !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        {lesson && (
          <>
            <DialogTitle className="sr-only">{lesson.title}</DialogTitle>
            <div
              className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl"
              style={{
                backgroundImage: `linear-gradient(135deg, oklch(0.6 0.13 ${lesson.hue}), oklch(0.35 0.14 ${lesson.hue + 30}))`,
              }}
            >
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground transition hover:scale-105"
              >
                {playing ? <Pause className="size-6" /> : <Play className="size-6 fill-current" />}
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="h-1.5 w-full rounded-full bg-background/30">
                  <div className="h-full w-1/3 rounded-full bg-background" />
                </div>
                <div className="mt-2 flex justify-between text-xs text-background">
                  <span>03:24</span>
                  <span>{lesson.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">
                  {String(lesson.index).padStart(2, "0")}. {lesson.title}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Thời lượng {lesson.duration}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => onIndexChange((index ?? 0) - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={index === lessons.length - 1}
                  onClick={() => onIndexChange((index ?? 0) + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button onClick={() => onEdit(lesson)}>
                <Pencil className="size-4" /> Chỉnh sửa
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
