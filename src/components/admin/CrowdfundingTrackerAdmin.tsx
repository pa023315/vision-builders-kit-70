import { useMemo, useState } from "react";
import { Ban, ExternalLink, RotateCcw, ShieldCheck, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CrowdfundingClassification, CrowdfundingTrackedProject } from "@/lib/supabase";
import {
  useAdminCrowdfundingProjects,
  useCrowdfundingFetchRuns,
  useUpdateCrowdfundingReview,
} from "@/hooks/useCrowdfundingTracker";

const platformLabel = (platform: string) =>
  platform === "kickstarter" ? "Kickstarter" : "CAMPFIRE";

const classificationLabel = (classification: string, ignoreForever: boolean) => {
  if (ignoreForever) return "永久忽略";
  if (classification === "approved") return "已公開";
  if (classification === "rejected") return "已排除";
  return "待審";
};

const ProjectRow = ({ project }: { project: CrowdfundingTrackedProject }) => {
  const [note, setNote] = useState(project.admin_note ?? "");
  const updateReview = useUpdateCrowdfundingReview();

  const update = (
    manualClassification: CrowdfundingClassification | null,
    ignoreForever = false,
  ) => {
    updateReview.mutate({
      id: project.id,
      manualClassification,
      ignoreForever,
      adminNote: note,
    });
  };

  return (
    <div className="grid gap-4 border-b py-4 lg:grid-cols-[120px_1fr_260px]">
      <div className="aspect-video overflow-hidden rounded bg-muted">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          <Badge variant="outline">{platformLabel(project.platform)}</Badge>
          <Badge>{classificationLabel(project.effective_classification, project.ignore_forever)}</Badge>
          <Badge variant="secondary">{Math.round(project.confidence)} 分</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {project.description || "沒有描述"}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>
            {project.currency ?? ""} {project.pledged_amount.toLocaleString()} /{" "}
            {project.goal_amount.toLocaleString()}
          </span>
          <span>{project.percent_funded}%</span>
          <span>{project.backer_count.toLocaleString()} 人支持</span>
          <span>最後看見：{new Date(project.last_seen_at).toLocaleString("zh-TW")}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.classification_reasons.map((reason) => (
            <Badge key={reason} variant="secondary">
              {reason}
            </Badge>
          ))}
        </div>
        <a
          href={project.source_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary"
        >
          查看來源 <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-2">
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="管理者備註"
        />
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => update("approved")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            通過
          </Button>
          <Button size="sm" variant="outline" onClick={() => update("rejected")}>
            <ShieldX className="mr-2 h-4 w-4" />
            排除
          </Button>
          <Button size="sm" variant="destructive" onClick={() => update("rejected", true)}>
            <Ban className="mr-2 h-4 w-4" />
            永久忽略
          </Button>
          <Button size="sm" variant="ghost" onClick={() => update(null)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            清除
          </Button>
        </div>
      </div>
    </div>
  );
};

export function CrowdfundingTrackerAdmin() {
  const { data: projects = [], isLoading } = useAdminCrowdfundingProjects();
  const { data: runs = [] } = useCrowdfundingFetchRuns();

  const groups = useMemo(
    () => ({
      review: projects.filter(
        (project) => project.effective_classification === "review" && !project.ignore_forever,
      ),
      approved: projects.filter(
        (project) => project.effective_classification === "approved" && !project.ignore_forever,
      ),
      rejected: projects.filter(
        (project) => project.effective_classification === "rejected" || project.ignore_forever,
      ),
    }),
    [projects],
  );

  if (isLoading) return <div>載入中...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>群眾募資追蹤審核</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="review">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="review">待審 ({groups.review.length})</TabsTrigger>
            <TabsTrigger value="approved">已公開 ({groups.approved.length})</TabsTrigger>
            <TabsTrigger value="rejected">已排除 ({groups.rejected.length})</TabsTrigger>
            <TabsTrigger value="runs">抓取紀錄 ({runs.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="review">
            {groups.review.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </TabsContent>
          <TabsContent value="approved">
            {groups.approved.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </TabsContent>
          <TabsContent value="rejected">
            {groups.rejected.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </TabsContent>
          <TabsContent value="runs">
            <div className="divide-y">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_1fr_180px]"
                >
                  <span>
                    {run.source} / {run.status}
                  </span>
                  <span>
                    {run.candidates_found} 筆候選，{run.review_count} 待審
                  </span>
                  <span>{new Date(run.started_at).toLocaleString("zh-TW")}</span>
                  {run.error_message ? (
                    <span className="text-destructive md:col-span-3">{run.error_message}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
