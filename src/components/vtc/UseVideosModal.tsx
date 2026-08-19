import { useState } from "react";
import { BookOpen, Check, Download, FileText, GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const courses = [
  "Toán 4 – Học kỳ I",
  "Toán 4 – Ôn tập nâng cao",
  "Câu lạc bộ Toán tư duy",
];

export function UseVideosModal({
  open,
  count,
  onOpenChange,
  onRestart,
}: {
  open: boolean;
  count: number;
  onOpenChange: (o: boolean) => void;
  onRestart: () => void;
}) {
  const [stage, setStage] = useState<"choose" | "lms" | "done">("choose");
  const [course, setCourse] = useState(courses[0]);
  const [newCourse, setNewCourse] = useState("");
  const [creating, setCreating] = useState(false);

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(() => setStage("choose"), 200);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-lg">
        {stage === "choose" && (
          <>
            <DialogHeader>
              <DialogTitle>Sử dụng bài giảng</DialogTitle>
              <DialogDescription>
                {count} video bài giảng đã sẵn sàng để sử dụng.
              </DialogDescription>
            </DialogHeader>
            <Button size="lg" className="w-full justify-start" onClick={() => setStage("lms")}>
              <GraduationCap className="size-4" /> Đưa vào khóa học trên LMS
            </Button>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" className="justify-start">
                <Download className="size-4" /> Tải các video
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => close(false)}>
                <FileText className="size-4" /> Lưu bản nháp
              </Button>
            </div>
          </>
        )}

        {stage === "lms" && (
          <>
            <DialogHeader>
              <DialogTitle>Chọn khóa học</DialogTitle>
              <DialogDescription>
                Các video sẽ được thêm vào khóa học thầy cô chọn.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {courses.map((c) => (
                <label
                  key={c}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors",
                    !creating && course === c ? "border-primary/50 bg-accent/40" : "border-border",
                  )}
                  onClick={() => {
                    setCreating(false);
                    setCourse(c);
                  }}
                >
                  <BookOpen className="size-4 text-muted-foreground" />
                  {c}
                </label>
              ))}
              <button
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                  creating ? "border-primary/50 bg-accent/40" : "border-border",
                )}
                onClick={() => setCreating(true)}
              >
                <Plus className="size-4 text-muted-foreground" /> Tạo khóa học mới
              </button>
              {creating && (
                <Input
                  autoFocus
                  placeholder="Tên khóa học mới"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStage("choose")}>
                Quay lại
              </Button>
              <Button onClick={() => setStage("done")}>Thêm vào khóa học</Button>
            </div>
          </>
        )}

        {stage === "done" && (
          <div className="py-4 text-center">
            <DialogTitle className="sr-only">Hoàn tất</DialogTitle>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
              <Check className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">Hoàn tất</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {count} video bài giảng đã được thêm vào khóa học{" "}
              <span className="font-medium text-foreground">
                {creating ? newCourse || "Khóa học mới" : course}
              </span>
              .
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={() => close(false)}>
                Xem khóa học
              </Button>
              <Button
                onClick={() => {
                  close(false);
                  onRestart();
                }}
              >
                Tạo bài giảng khác
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
