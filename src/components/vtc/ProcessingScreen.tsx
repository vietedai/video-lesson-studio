import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { processingSteps, statusMessages } from "@/lib/course-data";
import { cn } from "@/lib/utils";

export function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(onDone, 500);
          return 100;
        }
        return p + 2;
      });
    }, 90);
    return () => clearInterval(t);
  }, [onDone]);

  const active = Math.min(processingSteps.length - 1, Math.floor((progress / 100) * 6));
  const message = statusMessages[Math.min(statusMessages.length - 1, Math.floor(progress / 21))];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-ai)] text-primary-foreground shadow-[var(--shadow-ai)]">
          <Sparkles className="size-6 animate-pulse" />
        </span>
        <h1 className="mt-5 text-3xl font-bold">AI đang biên tập bài giảng</h1>
        <p className="mt-2.5 text-[15px] text-muted-foreground">
          Thầy cô không cần làm gì thêm. AI đang tạo các video bài giảng từ video gốc.
        </p>
      </div>

      <div className="mt-9">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm text-muted-foreground">{message}</span>
          <span className="text-2xl font-semibold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="ai-surface mt-8 space-y-3.5 p-6">
        {processingSteps.map((s, i) => {
          const done = i < active || progress === 100;
          const running = i === active && progress < 100;
          return (
            <div key={s} className="flex items-center gap-3 text-sm">
              {done ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3" />
                </span>
              ) : running ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : (
                <span className="size-5 rounded-full border border-border bg-background" />
              )}
              <span
                className={cn(
                  done && "text-foreground",
                  running && "font-medium text-foreground",
                  !done && !running && "text-muted-foreground",
                )}
              >
                {done ? `Đã ${s.replace(/^(Đã |Đang |Chuẩn bị )/, (m) => (m === "Đã " ? "" : ""))}`.replace("Đã Đã ", "Đã ") : s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
