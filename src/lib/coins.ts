import { useCallback, useEffect, useState } from "react";

/** Chi phí được tách rõ theo 2 công đoạn AI */
export const COIN_TRANSCRIBE_PER_MINUTE = 2; // bóc băng + phân tích nội dung
export const COIN_VIDEO_PER_MINUTE = 3; // dựng video bài giảng
export const COIN_PER_MINUTE = COIN_TRANSCRIBE_PER_MINUTE + COIN_VIDEO_PER_MINUTE;
/** Chi phí xuất bản video thành phẩm (render + lưu trữ) */
export const COIN_EXPORT_PER_MINUTE = 2;

export const INITIAL_BALANCE = 120;
const STORAGE_KEY = "vtc-coin-balance";

export const coinPackages = [
  { id: "p1", coins: 200, price: "99.000đ", note: "Dùng thử" },
  { id: "p2", coins: 600, price: "249.000đ", note: "Phổ biến", bonus: "+10% xu" },
  { id: "p3", coins: 1500, price: "549.000đ", note: "Tiết kiệm nhất", bonus: "+20% xu" },
];

/** "45:32" -> số phút làm tròn lên */
export function durationToMinutes(duration: string) {
  const [m = "0", s = "0"] = duration.split(":");
  return Math.max(1, Math.ceil(Number(m) + Number(s) / 60));
}

export function totalMinutes(durations: string[]) {
  return durations.reduce((sum, d) => sum + durationToMinutes(d), 0);
}

export function costFor(duration: string) {
  return durationToMinutes(duration) * COIN_PER_MINUTE;
}

/** Bảng chi phí biên tập tách theo công đoạn */
export function editCostBreakdown(durations: string[]) {
  const minutes = totalMinutes(durations);
  const transcribe = minutes * COIN_TRANSCRIBE_PER_MINUTE;
  const video = minutes * COIN_VIDEO_PER_MINUTE;
  return { minutes, transcribe, video, total: transcribe + video };
}

/** Chi phí xuất bản cho danh sách bài giảng được chọn */
export function exportCost(durations: string[]) {
  const minutes = totalMinutes(durations);
  return { minutes, total: minutes * COIN_EXPORT_PER_MINUTE };
}

export function formatCoins(n: number) {
  return n.toLocaleString("vi-VN");
}

export function useCoins() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null && !Number.isNaN(Number(saved))) setBalance(Number(saved));
  }, []);

  const update = useCallback((next: number) => {
    setBalance(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const spend = useCallback(
    (amount: number) => update(Math.max(0, balance - amount)),
    [balance, update],
  );
  const topUp = useCallback((amount: number) => update(balance + amount), [balance, update]);

  return { balance, spend, topUp };
}
