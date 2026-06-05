import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApprovedCrowdfundingProjects } from "@/hooks/useCrowdfundingTracker";

const platformLabel = (platform: string) =>
  platform === "kickstarter" ? "Kickstarter" : "CAMPFIRE";

const isLowResolutionKickstarterImage = (platform: string, imageUrl?: string | null) =>
  platform === "kickstarter" &&
  Boolean(imageUrl?.includes("width=160") && imageUrl?.includes("height=90"));

export function CrowdfundingTrackerSection() {
  const { data: projectsData, isLoading } = useApprovedCrowdfundingProjects();
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState("last_seen");
  const projects = projectsData ?? [];

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects
      .filter((project) => platform === "all" || project.platform === platform)
      .filter((project) => {
        if (!normalizedQuery) return true;
        return `${project.title} ${project.description ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sort === "ending") {
          return (
            new Date(a.end_at ?? "2999-12-31").getTime() -
            new Date(b.end_at ?? "2999-12-31").getTime()
          );
        }
        if (sort === "funded") return b.percent_funded - a.percent_funded;
        if (sort === "pledged") return b.pledged_amount - a.pledged_amount;
        if (sort === "backers") return b.backer_count - a.backer_count;
        return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime();
      });
  }, [platform, projects, query, sort]);

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>即時電子遊戲群眾募資追蹤</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="搜尋專案"
            />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部平台</SelectItem>
              <SelectItem value="kickstarter">Kickstarter</SelectItem>
              <SelectItem value="campfire">CAMPFIRE</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_seen">最新發現</SelectItem>
              <SelectItem value="ending">即將結束</SelectItem>
              <SelectItem value="funded">達成率</SelectItem>
              <SelectItem value="pledged">募資金額</SelectItem>
              <SelectItem value="backers">支持人數</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && !projectsData ? (
          <div className="text-muted-foreground">正在讀取追蹤專案...</div>
        ) : null}
        {!isLoading && visibleProjects.length === 0 ? (
          <div className="text-muted-foreground">目前沒有已公開的追蹤專案。</div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {project.image_url ? (
                  isLowResolutionKickstarterImage(project.platform, project.image_url) ? (
                    <>
                      <img
                        src={project.image_url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-lg"
                      />
                      <div className="absolute inset-0 bg-background/30" />
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="relative mx-auto h-full w-auto max-w-[260px] object-contain"
                      />
                    </>
                  ) : (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  )
                ) : null}
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{platformLabel(project.platform)}</Badge>
                  <Badge variant="secondary">{project.project_status}</Badge>
                </div>
                <h3 className="line-clamp-2 font-semibold">{project.title}</h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="space-y-2">
                  <Progress value={Math.min(project.percent_funded, 100)} />
                  <div className="flex justify-between text-sm">
                    <span>
                      {project.currency ?? ""} {project.pledged_amount.toLocaleString()}
                    </span>
                    <span>{project.percent_funded}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project.backer_count.toLocaleString()} 人支持</span>
                  <span>{new Date(project.last_seen_at).toLocaleDateString("zh-TW")}</span>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href={project.source_url} target="_blank" rel="noreferrer">
                    查看來源 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
