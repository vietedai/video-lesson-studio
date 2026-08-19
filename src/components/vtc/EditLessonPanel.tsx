import { useEffect, useState } from "react";
import { Scissors, Merge, Trash2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Lesson } from "@/lib/course-data";

export function EditLessonPanel({
  lesson,
  canMerge,
  onClose,
  onRename,
  onSplit,
  onMerge,
  onDelete,
  onOpenEditor,
}: {
  lesson: Lesson | null;
  canMerge: boolean;
  onClose: () => void;
  onRename: (title: string) => void;
  onSplit: () => void;
  onMerge: () => void;
  onDelete: () => void;
  onOpenEditor: () => void;
}) {
  const [title, setTitle] = useState("");
  useEffect(() => setTitle(lesson?.title ?? ""), [lesson]);

  return (
    <Sheet open={!!lesson} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Chỉnh sửa bài học</SheetTitle>
        </SheetHeader>

        {lesson && (
          <div className="flex h-full flex-col gap-6 px-4 pb-6">
            <div>
              <Label htmlFor="lesson-title">Tên bài</Label>
              <Input
                id="lesson-title"
                className="mt-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => onRename(title.trim() || lesson.title)}
              />
            </div>

            <div className="rounded-xl bg-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">Thời lượng</span>
              <span className="ml-2 font-medium">{lesson.duration}</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Các thao tác nhanh</p>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onRename(title.trim() || lesson.title)}
              >
                Đổi tên
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={onSplit}>
                <Scissors className="size-4" /> Chia thành 2 bài
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!canMerge}
                onClick={onMerge}
              >
                <Merge className="size-4" /> Gộp với bài kế tiếp
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="size-4" /> Xóa bài
              </Button>
            </div>

            <div className="mt-auto">
              <Button className="w-full" size="lg" onClick={onOpenEditor}>
                <Film className="size-4" /> Chỉnh nội dung video
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
