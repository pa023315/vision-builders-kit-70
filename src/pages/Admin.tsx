import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, BarChart3, FileText, Award, Globe, Flame, BookOpen, LogOut, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TaiwanProjectsAdmin } from "@/components/admin/TaiwanProjectsAdmin";
import { CampfireProjectsAdmin } from "@/components/admin/CampfireProjectsAdmin";
import { KickstarterProjectsAdmin } from "@/components/admin/KickstarterProjectsAdmin";
import { NewsAdmin } from "@/components/admin/NewsAdmin";
import { StatsAdmin } from "@/components/admin/StatsAdmin";
import { CasesAdmin } from "@/components/admin/CasesAdmin";
import BeginnerGuidesAdmin from "@/components/admin/BeginnerGuidesAdmin";
import ChangelogAdmin from "@/components/admin/ChangelogAdmin";

const Admin = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "登出成功",
        description: "已安全登出管理系統",
      });
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "登出失敗",
        description: "發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              後台管理
              <span className="text-primary ml-2">
                系統
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-4">
                歡迎，{user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                返回前台
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="taiwan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-[1050px]">
            <TabsTrigger value="taiwan" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              台灣專案
            </TabsTrigger>
            <TabsTrigger value="campfire" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Campfire
            </TabsTrigger>
            <TabsTrigger value="kickstarter" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Kickstarter
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              案例管理
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              新聞管理
            </TabsTrigger>
            <TabsTrigger value="beginner-guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              新手指南
            </TabsTrigger>
            <TabsTrigger value="changelog" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              更新紀錄
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              數據統計
            </TabsTrigger>
          </TabsList>

          <TabsContent value="taiwan">
            <TaiwanProjectsAdmin />
          </TabsContent>

          <TabsContent value="campfire">
            <CampfireProjectsAdmin />
          </TabsContent>

          <TabsContent value="kickstarter">
            <KickstarterProjectsAdmin />
          </TabsContent>

          <TabsContent value="cases">
            <CasesAdmin />
          </TabsContent>

          <TabsContent value="news">
            <NewsAdmin />
          </TabsContent>

          <TabsContent value="beginner-guides">
            <BeginnerGuidesAdmin />
          </TabsContent>

          <TabsContent value="changelog">
            <ChangelogAdmin />
          </TabsContent>

          <TabsContent value="stats">
            <StatsAdmin />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;