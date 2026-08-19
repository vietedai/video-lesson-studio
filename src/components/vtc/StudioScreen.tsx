import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SelectVideoScreen, type SelectedSource } from "@/components/vtc/SelectVideoScreen";
import { ProcessingScreen } from "@/components/vtc/ProcessingScreen";
import { ReadyScreen } from "@/components/vtc/ReadyScreen";
import { PreviewModal } from "@/components/vtc/PreviewModal";
import { EditLessonPanel } from "@/components/vtc/EditLessonPanel";
import { VideoEditor } from "@/components/vtc/VideoEditor";
import { UseVideosModal } from "@/components/vtc/UseVideosModal";
import { ConfirmCostModal, CoinToast, TopUpModal } from "@/components/vtc/CoinModals";
import { ExportModal } from "@/components/vtc/ExportModal";
import { CoinBadge } from "@/components/vtc/CoinBadge";
import { initialLessons, sourceVideo, type Lesson } from "@/lib/course-data";
import { editCostBreakdown, useCoins } from "@/lib/coins";

export function StudioScreen({
  projectName,
  onLessonsReady,
}: {
  projectName: string;
  onLessonsReady?: (count: number) => void;
}) {
  const [step, setStep] = useState<"select" | "processing" | "ready">("select");
  const [sources, setSources] = useState<SelectedSource[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [course, setCourse] = useState({
    title: projectName,
    description:
      "Bài giảng hướng dẫn học sinh phương pháp tính thuận tiện thông qua các ví dụ và bài tập thực hành.",
  });
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [panelLesson, setPanelLesson] = useState<Lesson | null>(null);
  const [editorLesson, setEditorLesson] = useState<Lesson | null>(null);
  const [useOpen, setUseOpen] = useState(false);
  const [rendering, setRendering] = useState(false);
  const { balance, spend, topUp } = useCoins();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [charged, setCharged] = useState<number | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportLessonId, setExportLessonId] = useState<string | null>(null);

  const durations = sources.length ? sources.map((s) => s.duration) : [sourceVideo.duration];
  const { minutes, transcribe, video, total: cost } = editCostBreakdown(durations);

  const updateLesson = (id: string, patch: Partial<Lesson>) =>
    setLessons((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const panelIndex = panelLesson ? lessons.findIndex((l) => l.id === panelLesson.id) : -1;

  const requestStart = () => {
    if (balance < cost) setTopUpOpen(true);
    else setConfirmOpen(true);
  };

  const confirmStart = () => {
    spend(cost);
    setCharged(cost);
    setConfirmOpen(false);
    setStep("processing");
    setTimeout(() => setCharged(null), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-auto fixed left-6 top-6 z-40">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm shadow-[var(--shadow-card)] hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
          <span className="max-w-[220px] truncate">{projectName}</span>
        </Link>
      </div>

      <div className="pointer-events-auto fixed right-6 top-6 z-40">
        <CoinBadge balance={balance} onTopUp={() => setTopUpOpen(true)} />
      </div>

      {step === "select" && (
        <SelectVideoScreen
          selected={sources}
          onSelect={setSources}
          onStart={requestStart}
          onPreview={() => setPreviewIndex(0)}
          balance={balance}
          onTopUp={() => setTopUpOpen(true)}
        />
      )}

      {step === "processing" && (
        <ProcessingScreen
          onDone={() => {
            setStep("ready");
            onLessonsReady?.(lessons.length);
          }}
        />
      )}

      {step === "ready" && (
        <ReadyScreen
          lessons={lessons}
          course={course}
          sourceDuration={sources[0]?.duration ?? sourceVideo.duration}
          onCourseChange={setCourse}
          onReorder={(from, to) =>
            setLessons((ls) => {
              const next = [...ls];
              const [m] = next.splice(from, 1);
              if (m) next.splice(to, 0, m);
              return next;
            })
          }
          onPreview={setPreviewIndex}
          onEdit={setPanelLesson}
          onUse={() => setUseOpen(true)}
          onShowDetails={() => setEditorLesson(lessons[0] ?? null)}
          onExport={(id) => {
            setExportLessonId(id ?? null);
            setExportOpen(true);
          }}
        />
      )}

      <PreviewModal
        lessons={lessons}
        index={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
        onEdit={(l) => {
          setPreviewIndex(null);
          setPanelLesson(l);
        }}
      />

      <EditLessonPanel
        lesson={panelLesson}
        canMerge={panelIndex >= 0 && panelIndex < lessons.length - 1}
        onClose={() => setPanelLesson(null)}
        onRename={(title) => {
          if (!panelLesson) return;
          updateLesson(panelLesson.id, { title });
          setPanelLesson({ ...panelLesson, title });
        }}
        onSplit={() => {
          if (!panelLesson) return;
          setLessons((ls) => {
            const i = ls.findIndex((l) => l.id === panelLesson.id);
            const next = [...ls];
            next.splice(i, 1,
              { ...panelLesson, id: panelLesson.id + "a", title: panelLesson.title + " (phần 1)", duration: "05:12" },
              { ...panelLesson, id: panelLesson.id + "b", title: panelLesson.title + " (phần 2)", duration: "05:12" },
            );
            return next.map((l, idx) => ({ ...l, index: idx + 1 }));
          });
          setPanelLesson(null);
        }}
        onMerge={() => {
          if (!panelLesson) return;
          setLessons((ls) => {
            const i = ls.findIndex((l) => l.id === panelLesson.id);
            if (i < 0 || i >= ls.length - 1) return ls;
            const next = [...ls];
            next.splice(i, 2, { ...panelLesson, duration: "19:36" });
            return next.map((l, idx) => ({ ...l, index: idx + 1 }));
          });
          setPanelLesson(null);
        }}
        onDelete={() => {
          if (!panelLesson) return;
          setLessons((ls) =>
            ls.filter((l) => l.id !== panelLesson.id).map((l, idx) => ({ ...l, index: idx + 1 })),
          );
          setPanelLesson(null);
        }}
        onOpenEditor={() => {
          setEditorLesson(panelLesson);
          setPanelLesson(null);
        }}
      />

      {editorLesson && (
        <VideoEditor
          lesson={editorLesson}
          onCancel={() => setEditorLesson(null)}
          onSave={() => {
            setEditorLesson(null);
            setRendering(true);
            setTimeout(() => setRendering(false), 1800);
          }}
        />
      )}

      <UseVideosModal
        open={useOpen}
        count={lessons.length}
        onOpenChange={setUseOpen}
        onRestart={() => {
          setStep("select");
          setSources([]);
          setLessons(initialLessons);
        }}
      />

      <ConfirmCostModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        cost={cost}
        minutes={minutes}
        videos={sources.length || 1}
        transcribe={transcribe}
        video={video}
        balance={balance}
        onConfirm={confirmStart}
      />

      <ExportModal
        open={exportOpen}
        lessons={lessons}
        initialLessonId={exportLessonId}
        balance={balance}
        onOpenChange={setExportOpen}
        onConfirm={(c) => {
          spend(c);
          setCharged(c);
          setTimeout(() => setCharged(null), 4000);
        }}
        onTopUp={() => setTopUpOpen(true)}
      />

      <TopUpModal
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        balance={balance}
        needed={balance < cost ? cost - balance : undefined}
        onTopUp={topUp}
      />

      {charged !== null && step !== "select" && <CoinToast amount={charged} balance={balance} />}

      {rendering && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-[var(--shadow-card)]">
          <Loader2 className="size-4 animate-spin text-primary" /> Đang cập nhật video...
        </div>
      )}
    </div>
  );
}
