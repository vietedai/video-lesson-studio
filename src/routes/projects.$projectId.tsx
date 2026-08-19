import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StudioScreen } from "@/components/vtc/StudioScreen";
import { useProjects } from "@/lib/projects";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Tạo bài giảng từ video bằng AI" },
      {
        name: "description",
        content:
          "Chọn video của dự án, AI tự động biên tập thành các video bài giảng ngắn gọn sẵn sàng cho LMS.",
      },
      { property: "og:title", content: "Tạo bài giảng từ video bằng AI" },
      {
        property: "og:description",
        content: "Chọn video, AI biên tập, bài giảng sẵn sàng — không cần biết dựng video.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectStudio,
});

function ProjectStudio() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const { projects, loaded, updateProject } = useProjects();
  const project = projects.find((p) => p.id === projectId);

  if (!loaded) return <div className="min-h-screen bg-background" />;

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy dự án</h1>
        <p className="text-sm text-muted-foreground">Dự án có thể đã bị xoá.</p>
        <Button asChild className="mt-2">
          <Link to="/">Về danh sách dự án</Link>
        </Button>
      </div>
    );
  }

  return (
    <StudioScreen
      projectName={project.name}
      onLessonsReady={(count) =>
        updateProject(project.id, { lessonCount: count, status: "ready" })
      }
    />
  );
}
