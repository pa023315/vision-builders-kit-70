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
import { Plus, Edit, Trash2, Eye, Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { Project } from "@/lib/supabase";
import { ImageUpload } from "@/components/ImageUpload";

export const ProjectsAdmin = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    target: "",
    backers: "",
    platform: "",
    category: "",
    country: "",
    launch_date: "",
    status: "active" as "active" | "completed" | "failed",
    image_url: "",
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
      platform: "",
      category: "",
      country: "",
      launch_date: "",
      status: "active" as "active" | "completed" | "failed",
      image_url: "",
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

         // 批量創建專案 - 支援新格式：狀態|平台|時程|類型|名稱|目標金額|贊助金額|達成率|人數|網址
         jsonData.forEach((row: any) => {
           const amount = parseInt(row['贊助金額'] || row['募資金額'] || row['amount'] || '0');
           const target = parseInt(row['目標金額'] || row['target'] || '1');
           const projectData = {
             name: row['名稱'] || row['專案名稱'] || row['name'] || '',
             description: row['描述'] || row['專案描述'] || row['description'] || row['名稱'] || '',
             amount: amount,
             target: target,
             backers: parseInt(row['人數'] || row['支持人數'] || row['backers'] || '0'),
             platform: row['平台'] || row['platform'] || '',
             category: row['類型'] || row['分類'] || row['category'] || '',
             country: '台灣', // 固定為台灣
             launch_date: row['時程'] || row['上線日期'] || row['launch_date'] || '',
             status: (row['狀態'] === '成功' || row['狀態'] === '已完成' ? 'completed' : 
                     row['狀態'] === '失敗' ? 'failed' : 
                     row['status'] || 'active') as "active" | "completed" | "failed",
             image_url: row['網址'] || row['圖片網址'] || row['image_url'] || '',
             // 優先使用Excel中的達成率，否則計算
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
    
    // 清除選擇的檔案
    event.target.value = '';
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  // Filter projects by platform and country
  const taiwanProjects = projects.filter(p => p.country === '台灣').sort((a, b) => b.amount - a.amount);
  const kickstarterProjects = projects.filter(p => p.platform === 'Kickstarter' && p.country !== '台灣');
  const campfireProjects = projects.filter(p => p.platform === 'Campfire' && p.country !== '台灣');

  // 計算台灣專案統計數據（只計算成功專案）
  const successfulTaiwanProjects = taiwanProjects.filter(p => p.status === 'completed');
  const taiwanStats = {
    totalAmount: successfulTaiwanProjects.reduce((sum, p) => sum + p.amount, 0),
    totalBackers: successfulTaiwanProjects.reduce((sum, p) => sum + p.backers, 0),
  };

  const handleBulkDelete = (projectList: Project[], title: string) => {
    if (confirm(`確定要刪除所有${title}嗎？`)) {
      projectList.forEach(project => {
        deleteProject.mutate(project.id);
      });
    }
  };

  const renderProjectTable = (projectList: Project[], title: string, showActions: boolean = false) => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title} ({projectList.length})</CardTitle>
          {showActions && (
            <div className="flex gap-2">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                style={{ display: 'none' }}
                id={`excel-upload-${title.replace(/\s+/g, '-')}`}
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`excel-upload-${title.replace(/\s+/g, '-')}`)?.click()}
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
              </Dialog>
              {title === "台灣專案" && projectList.length > 0 && (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkDelete(projectList, title)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  刪除所有數據
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead>狀態</TableHead>
                 <TableHead>平台</TableHead>
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
               {projectList.map((project) => (
                 <TableRow key={project.id}>
                   <TableCell>
                     <Badge variant={
                       project.status === "completed" ? "default" :
                       project.status === "active" ? "secondary" : "destructive"
                     }>
                        {project.status === "completed" ? "成功" :
                         project.status === "active" ? "進行中" : "失敗"}
                     </Badge>
                   </TableCell>
                   <TableCell>{project.platform}</TableCell>
                   <TableCell>{project.launch_date}</TableCell>
                   <TableCell>{project.category}</TableCell>
                   <TableCell className="font-medium">{project.name}</TableCell>
                   <TableCell>{project.target.toLocaleString()}</TableCell>
                   <TableCell>{project.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {project.target > 0 ? Math.round((project.amount / project.target) * 100) : 0}%
                    </TableCell>
                   <TableCell>{project.backers}</TableCell>
                   <TableCell>
                     {project.image_url ? (
                       <a href={project.image_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                         連結
                       </a>
                     ) : "無"}
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
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>專案管理 (總計: {projects.length} 個專案)</CardTitle>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                style={{ display: 'none' }}
                id="excel-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('excel-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Excel 匯入
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    新增專案
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "編輯專案" : "新增專案"}
                  </DialogTitle>
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
                      <Label htmlFor="platform">平台</Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(value) => setFormData({ ...formData, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇平台" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kickstarter">Kickstarter</SelectItem>
                          <SelectItem value="Campfire">Campfire</SelectItem>
                          <SelectItem value="嘖嘖">嘖嘖</SelectItem>
                          <SelectItem value="Indiegogo">Indiegogo</SelectItem>
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
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="amount">募資金額</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="target">目標金額</Label>
                      <Input
                        id="target"
                        type="number"
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="backers">支持人數</Label>
                      <Input
                        id="backers"
                        type="number"
                        value={formData.backers}
                        onChange={(e) => setFormData({ ...formData, backers: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category">分類</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                          <SelectItem value="台灣">台灣</SelectItem>
                          <SelectItem value="日本">日本</SelectItem>
                          <SelectItem value="美國">美國</SelectItem>
                          <SelectItem value="英國">英國</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="launch_date">時程</Label>
                      <Input
                        id="launch_date"
                        type="text"
                        placeholder="例如：2024-01-15 或 2024年1月"
                        value={formData.launch_date}
                        onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      label="專案圖片"
                      value={formData.image_url}
                      onChange={(url) => setFormData({ ...formData, image_url: url })}
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

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      {editingProject ? "更新" : "創建"}
                    </Button>
                  </div>
                </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">台灣專案 ({taiwanProjects.length})</CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>總贊助金額: NT$ {(taiwanStats.totalAmount / 1000000).toFixed(1)}M</span>
                      <span>總贊助人數: {taiwanStats.totalBackers.toLocaleString()}人</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelImport}
                      style={{ display: 'none' }}
                      id="excel-upload-taiwan"
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('excel-upload-taiwan')?.click()}
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
                    </Dialog>
                    {taiwanProjects.length > 0 && (
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBulkDelete(taiwanProjects, "台灣專案")}
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
                         <TableHead>平台</TableHead>
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
                       {taiwanProjects.map((project) => (
                         <TableRow key={project.id}>
                           <TableCell>
                             <Badge variant={
                               project.status === "completed" ? "default" :
                               project.status === "active" ? "secondary" : "destructive"
                             }>
                                {project.status === "completed" ? "成功" :
                                 project.status === "active" ? "進行中" : "失敗"}
                             </Badge>
                           </TableCell>
                           <TableCell>{project.platform}</TableCell>
                           <TableCell>{project.launch_date}</TableCell>
                           <TableCell>{project.category}</TableCell>
                           <TableCell className="font-medium">{project.name}</TableCell>
                           <TableCell>{project.target.toLocaleString()}</TableCell>
                           <TableCell>{project.amount.toLocaleString()}</TableCell>
                           <TableCell>
                             {project.target > 0 ? Math.round((project.amount / project.target) * 100) : 0}%
                           </TableCell>
                           <TableCell>{project.backers}</TableCell>
                           <TableCell>
                             {project.image_url ? (
                               <a href={project.image_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                 連結
                               </a>
                             ) : "無"}
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
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">國際專案</h3>
              {renderProjectTable(kickstarterProjects, "Kickstarter 平台", true)}
              {renderProjectTable(campfireProjects, "日本 Campfire 平台", true)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};