import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function Thumb({
  hue = 258,
  label,
  className,
  showPlay = true,
}: {
  hue?: number;
  label?: string;
  className?: string;
  showPlay?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, oklch(0.72 0.12 ${hue}), oklch(0.5 0.16 ${hue + 30}))`,
      }}
    >
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_55%)]" />
      {showPlay && (
        <span className="relative flex size-8 items-center justify-center rounded-full bg-background/85 text-foreground">
          <Play className="size-3.5 fill-current" />
        </span>
      )}
      {label && (
        <span className="absolute bottom-1 right-1 rounded bg-foreground/70 px-1.5 py-0.5 text-[10px] font-medium text-background">
          {label}
        </span>
      )}
    </div>
  );
}
