import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { Project } from "@/lib/supabase";
import { ImageUpload } from "@/components/ImageUpload";

export const CampfireProjectsAdmin = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    target: "",
    backers: "",
    platform: "Campfire",
    category: "",
    country: "日本",
    launch_date: "",
    status: "active" as "active" | "completed" | "failed",
    image_url: "",
    project_url: "",
  });

  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      amount: "",
      target: "",
      backers: "",
      platform: "Campfire",
      category: "",
      country: "日本",
      launch_date: "",
      status: "active" as "active" | "completed" | "failed",
      image_url: "",
      project_url: "",
    });
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount) || 0;
    const target = parseFloat(formData.target) || 1;
    const projectData = {
      ...formData,
      amount: Math.round(amount),
      target: Math.round(target),
      backers: parseInt(formData.backers) || 0,
      success_rate: target > 0 ? Math.round((amount / target) * 100) : 0,
      platform: "Campfire",
      country: "日本",
    };

    if (editingProject) {
      updateProject.mutate({ id: editingProject.id, ...projectData });
    } else {
      createProject.mutate(projectData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      amount: project.amount.toString(),
      target: project.target.toString(),
      backers: project.backers.toString(),
      platform: project.platform,
      category: project.category,
      country: project.country,
      launch_date: project.launch_date,
      status: project.status,
      image_url: project.image_url || "",
      project_url: project.project_url || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("確定要刪除此專案嗎？")) {
      deleteProject.mutate(id);
    }
  };

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((row: any) => {
          const amount = parseInt(row['贊助金額'] || row['募資金額'] || row['amount'] || '0');
          const target = parseInt(row['目標金額'] || row['target'] || '1');
          const projectData = {
            name: row['名稱'] || row['專案名稱'] || row['name'] || '',
            description: row['描述'] || row['專案描述'] || row['description'] || row['名稱'] || '',
            amount: amount,
            target: target,
            backers: parseInt(row['人數'] || row['支持人數'] || row['backers'] || '0'),
            platform: "Campfire",
            category: row['類型'] || row['分類'] || row['category'] || '',
            country: "日本",
            launch_date: row['時程'] || row['上線日期'] || row['launch_date'] || '',
            status: (row['狀態'] === '成功' || row['狀態'] === '已完成' ? 'completed' : 
                    row['狀態'] === '失敗' ? 'failed' : 
                    row['status'] || 'active') as "active" | "completed" | "failed",
            image_url: row['圖片網址'] || row['image_url'] || '',
            project_url: row['專案網址'] || row['網址'] || row['project_url'] || '',
            success_rate: row['達成率'] ? parseInt(row['達成率'].toString().replace('%', '')) : 
                         (target > 0 ? Math.round((amount / target) * 100) : 0),
          };

          if (projectData.name && projectData.description) {
            createProject.mutate(projectData);
          }
        });

        alert('Excel 匯入完成！');
      } catch (error) {
        console.error('Excel 解析錯誤:', error);
        alert('Excel 格式錯誤，請檢查檔案格式');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  const campfireProjects = projects.filter(p => p.platform === 'Campfire' && p.country !== '台灣').sort((a, b) => b.amount - a.amount);

  // 計算 Campfire 專案統計：成功標準為贊助金額 >= 目標金額
  const successfulProjects = campfireProjects.filter(p => 
    p.amount && p.target && p.amount >= p.target
  );
  
  const campfireStats = {
    totalProjects: campfireProjects.length, // 所有 Campfire 專案數量
    totalAmount: successfulProjects.reduce((sum, p) => sum + (p.amount || 0), 0), // 成功專案累計金額
    totalBackers: successfulProjects.reduce((sum, p) => sum + (p.backers || 0), 0), // 成功專案支持人數
    successRate: campfireProjects.length > 0 ? Math.round((successfulProjects.length / campfireProjects.length) * 100) : 0,
    medianAmount: (() => {
      if (successfulProjects.length === 0) return 0;
      const amounts = successfulProjects.map(p => p.amount).filter(a => a > 0).sort((a, b) => a - b);
      if (amounts.length === 0) return 0;
      const mid = Math.floor(amounts.length / 2);
      return amounts.length % 2 === 0 
        ? Math.round((amounts[mid - 1] + amounts[mid]) / 2)
        : amounts[mid];
    })(),
    medianBackers: (() => {
      if (successfulProjects.length === 0) return 0;
      const backers = successfulProjects.map(p => p.backers).filter(b => b > 0).sort((a, b) => a - b);
      if (backers.length === 0) return 0;
      const mid = Math.floor(backers.length / 2);
      return backers.length % 2 === 0 
        ? Math.round((backers[mid - 1] + backers[mid]) / 2)
        : backers[mid];
    })(),
    averageOrderValue: (() => {
      const totalBackers = successfulProjects.reduce((sum, p) => sum + (p.backers || 0), 0);
      const totalAmount = successfulProjects.reduce((sum, p) => sum + (p.amount || 0), 0);
      return totalBackers > 0 ? Math.round(totalAmount / totalBackers) : 0;
    })(),
  };

  const handleBulkDelete = () => {
    if (confirm(`確定要刪除所有Campfire專案嗎？`)) {
      campfireProjects.forEach(project => {
        deleteProject.mutate(project.id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 統計數據顯示 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">專案總數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campfireStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">件活躍專案</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">累計金額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {(campfireStats.totalAmount / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">總募資金額</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">支持人數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campfireStats.totalBackers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">名支持者</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campfireStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">平均成功率</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">中位數金額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {(campfireStats.medianAmount / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">專案中位數</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">中位數人數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(campfireStats.medianBackers)}</div>
            <p className="text-xs text-muted-foreground">支持者中位數</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">平均客單價</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥ {Math.round(campfireStats.averageOrderValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">平均客單價</p>
          </CardContent>
        </Card>
      </div>

      {/* Campfire 專案管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Campfire 專案 ({campfireProjects.length})</CardTitle>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                style={{ display: 'none' }}
                id="excel-upload-campfire"
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('excel-upload-campfire')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Excel 匯入
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    新增專案
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? "編輯專案" : "新增專案"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">專案名稱</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">國家</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => setFormData({ ...formData, country: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇國家" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="日本">日本</SelectItem>
                            <SelectItem value="美國">美國</SelectItem>
                            <SelectItem value="英國">英國</SelectItem>
                            <SelectItem value="加拿大">加拿大</SelectItem>
                            <SelectItem value="其他">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">專案描述</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="target">目標金額</Label>
                        <Input
                          id="target"
                          type="number"
                          value={formData.target}
                          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">贊助金額</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="backers">支持人數</Label>
                        <Input
                          id="backers"
                          type="number"
                          value={formData.backers}
                          onChange={(e) => setFormData({ ...formData, backers: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">類型</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="launch_date">上線時程</Label>
                        <Input
                          id="launch_date"
                          value={formData.launch_date}
                          onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">狀態</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: "active" | "completed" | "failed") => 
                            setFormData({ ...formData, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">進行中</SelectItem>
                            <SelectItem value="completed">成功</SelectItem>
                            <SelectItem value="failed">失敗</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>


                     <div>
                       <Label htmlFor="project_url">專案網址</Label>
                       <Input
                         id="project_url"
                         type="url"
                         value={formData.project_url}
                         onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                         placeholder="https://..."
                       />
                     </div>

                     <div>
                       <Label>專案圖片</Label>
                       <ImageUpload
                         onChange={(url) => setFormData({ ...formData, image_url: url })}
                         value={formData.image_url}
                       />
                     </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button type="submit">
                        {editingProject ? "更新" : "新增"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              {campfireProjects.length > 0 && (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  刪除所有數據
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>狀態</TableHead>
                  <TableHead>國家</TableHead>
                  <TableHead>時程</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>名稱</TableHead>
                  <TableHead>目標金額</TableHead>
                  <TableHead>贊助金額</TableHead>
                  <TableHead>達成率</TableHead>
                  <TableHead>人數</TableHead>
                  <TableHead>網址</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campfireProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Badge variant={
                        project.status === "completed" ? "default" :
                        project.status === "active" ? "secondary" : "destructive"
                      }>
                        {project.status === "completed" ? "成功" :
                         project.status === "active" ? "成功" : "失敗"}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.country}</TableCell>
                    <TableCell>{project.launch_date}</TableCell>
                    <TableCell>{project.category}</TableCell>
                     <TableCell className="font-medium">
                       {project.project_url ? (
                         <a 
                           href={project.project_url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline"
                         >
                           {project.name}
                         </a>
                       ) : (
                         project.name
                       )}
                     </TableCell>
                    <TableCell>{project.target.toLocaleString()}</TableCell>
                    <TableCell>{project.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {project.target > 0 ? Math.round((project.amount / project.target) * 100) : 0}%
                    </TableCell>
                    <TableCell>{project.backers}</TableCell>
                     <TableCell>
                       {project.project_url ? (
                         <a 
                           href={project.project_url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline"
                         >
                           連結
                         </a>
                       ) : (
                         "無"
                       )}
                     </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};