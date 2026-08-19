import { Coins, Plus } from "lucide-react";
import { formatCoins } from "@/lib/coins";
import { cn } from "@/lib/utils";

export function CoinBadge({
  balance,
  onTopUp,
  className,
}: {
  balance: number;
  onTopUp: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-3 pr-1 text-sm shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <Coins className="size-4 text-warning" />
      <span className="font-semibold tabular-nums">{formatCoins(balance)}</span>
      <span className="text-muted-foreground">xu</span>
      <button
        onClick={onTopUp}
        aria-label="Nạp thêm xu"
        className="ml-1 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/70"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
