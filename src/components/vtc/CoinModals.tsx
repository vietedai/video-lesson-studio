import { useState } from "react";
import { Check, Coins, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { coinPackages, formatCoins } from "@/lib/coins";
import { cn } from "@/lib/utils";

export function ConfirmCostModal({
  open,
  onOpenChange,
  cost,
  minutes,
  balance,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cost: number;
  minutes: number;
  balance: number;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận sử dụng xu</DialogTitle>
          <DialogDescription>
            Mỗi lần AI biên tập sẽ trừ xu theo thời lượng video gốc.
          </DialogDescription>
        </DialogHeader>

        <div className="ai-surface space-y-2.5 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời lượng video</span>
            <span className="tabular-nums">{minutes} phút</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chi phí biên tập</span>
            <span className="font-semibold tabular-nums">−{formatCoins(cost)} xu</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2.5">
            <span className="text-muted-foreground">Số dư sau khi trừ</span>
            <span className="font-semibold tabular-nums text-success">
              {formatCoins(balance - cost)} xu
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Chỉnh sửa lại bài giảng sau khi AI hoàn thành là miễn phí.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="ai" onClick={onConfirm}>
            <Sparkles className="size-4" /> Dùng {formatCoins(cost)} xu & bắt đầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TopUpModal({
  open,
  onOpenChange,
  balance,
  needed,
  onTopUp,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  balance: number;
  needed?: number | undefined;
  onTopUp: (coins: number) => void;
}) {
  const [pick, setPick] = useState(coinPackages[1]!.id);
  const [paying, setPaying] = useState(false);

  const buy = () => {
    const pkg = coinPackages.find((p) => p.id === pick)!;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      onTopUp(pkg.coins);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nạp xu</DialogTitle>
          <DialogDescription>
            {needed
              ? `Thầy cô cần thêm ${formatCoins(needed)} xu để AI biên tập video này.`
              : `Số dư hiện tại: ${formatCoins(balance)} xu.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {coinPackages.map((p) => (
            <button
              key={p.id}
              onClick={() => setPick(p.id)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                pick === p.id ? "border-primary/50 bg-accent/40" : "border-border",
              )}
            >
              <Coins className="size-5 text-warning" />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {formatCoins(p.coins)} xu
                  {p.bonus && (
                    <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
                      {p.bonus}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{p.note}</span>
              </span>
              <span className="text-sm font-semibold tabular-nums">{p.price}</span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Để sau
          </Button>
          <Button onClick={buy} disabled={paying}>
            {paying ? (
              "Đang xử lý thanh toán..."
            ) : (
              <>
                <Wallet className="size-4" /> Thanh toán
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CoinToast({ amount, balance }: { amount: number; balance: number }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-[var(--shadow-card)]">
      <Check className="size-4 text-success" /> Đã trừ {formatCoins(amount)} xu · Còn{" "}
      {formatCoins(balance)} xu
    </div>
  );
}
