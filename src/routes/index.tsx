import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FolderPlus, Plus, Sparkles, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CoinBadge } from "@/components/vtc/CoinBadge";
import { TopUpModal } from "@/components/vtc/CoinModals";
import { useCoins } from "@/lib/coins";
import { formatDate, useProjects } from "@/lib/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dự án bài giảng AI — Bảng điều khiển" },
      {
        name: "description",
        content:
          "Tạo và quản lý các dự án bài giảng: mỗi dự án là một bộ video được AI biên tập thành bài giảng ngắn gọn.",
      },
      { property: "og:title", content: "Dự án bài giảng AI — Bảng điều khiển" },
      {
        property: "og:description",
        content: "Đặt tên dự án, chọn video, để AI biên tập thành bài giảng sẵn sàng cho LMS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { projects, createProject, deleteProject } = useProjects();
  const { balance, topUp } = useCoins();
  const [open, setOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const project = createProject(trimmed, description.trim());
    setOpen(false);
    setName("");
    setDescription("");
    navigate({ to: "/projects/$projectId", params: { projectId: project.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <span className="font-semibold">Bài giảng AI</span>
          </div>
          <CoinBadge balance={balance} onTopUp={() => setTopUpOpen(true)} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dự án của tôi</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Mỗi dự án chứa các video bài giảng do AI biên tập từ video lớp học hoặc Zoom.
            </p>
          </div>
          <Button size="lg" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Tạo dự án mới
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="surface mt-8 flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-muted-foreground">
              <FolderPlus className="size-6" />
            </span>
            <p className="font-medium">Chưa có dự án nào</p>
            <p className="text-sm text-muted-foreground">
              Tạo dự án đầu tiên để bắt đầu biến video thành bài giảng.
            </p>
            <Button className="mt-2" onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Tạo dự án
            </Button>
          </div>
        ) : (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <article key={p.id} className="surface group flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[17px] font-semibold">{p.name}</h2>
                  <span
                    className={
                      p.status === "ready"
                        ? "rounded-full bg-success-soft px-2 py-0.5 text-xs text-success"
                        : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    }
                  >
                    {p.status === "ready" ? "Đã có bài giảng" : "Bản nháp"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {p.description || "Chưa có mô tả."}
                </p>
                <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Video className="size-3.5" /> {p.lessonCount} bài giảng
                  </span>
                  <span>Tạo ngày {formatDate(p.createdAt)}</span>
                </p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({ to: "/projects/$projectId", params: { projectId: p.id } })
                    }
                  >
                    Mở dự án
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Xoá dự án ${p.name}`}
                    onClick={() => deleteProject(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo dự án mới</DialogTitle>
            <DialogDescription>
              Đặt tên dự án, sau đó chọn video để AI biên tập thành bài giảng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              placeholder="Ví dụ: Toán 4 – Chương 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <Textarea
              rows={3}
              placeholder="Mô tả ngắn (không bắt buộc)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button disabled={!name.trim()} onClick={submit}>
              Tạo và chọn video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TopUpModal open={topUpOpen} onOpenChange={setTopUpOpen} balance={balance} onTopUp={topUp} />
    </div>
  );
}
