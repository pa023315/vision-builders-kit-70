import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, BarChart3, FileText, Award } from "lucide-react";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { NewsAdmin } from "@/components/admin/NewsAdmin";
import { StatsAdmin } from "@/components/admin/StatsAdmin";
import { CasesAdmin } from "@/components/admin/CasesAdmin";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              後台管理
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-2">
                系統
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                返回前台
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              專案管理
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              案例管理
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              新聞管理
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              數據統計
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsAdmin />
          </TabsContent>

          <TabsContent value="cases">
            <CasesAdmin />
          </TabsContent>

          <TabsContent value="news">
            <NewsAdmin />
          </TabsContent>

          <TabsContent value="stats">
            <StatsAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;