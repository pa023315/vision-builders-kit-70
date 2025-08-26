import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const guideSchema = z.object({
  name: z.string().min(1, "名稱為必填項目"),
  description: z.string().min(1, "描述為必填項目"),
  url: z.string().url("請輸入有效的網址")
});

type GuideFormData = z.infer<typeof guideSchema>;

interface BeginnerGuide {
  id: string;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}

const BeginnerGuidesAdmin = () => {
  const [editingGuide, setEditingGuide] = useState<BeginnerGuide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GuideFormData>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      name: "",
      description: "",
      url: ""
    }
  });

  const { data: guides, isLoading } = useQuery({
    queryKey: ['beginner-guides-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beginner_guides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BeginnerGuide[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: GuideFormData) => {
      const { error } = await supabase
        .from('beginner_guides')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beginner-guides-admin'] });
      queryClient.invalidateQueries({ queryKey: ['beginner-guides'] });
      toast({ title: "新手指南已新增" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ 
        title: "新增失敗", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GuideFormData }) => {
      const { error } = await supabase
        .from('beginner_guides')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beginner-guides-admin'] });
      queryClient.invalidateQueries({ queryKey: ['beginner-guides'] });
      toast({ title: "新手指南已更新" });
      setIsDialogOpen(false);
      setEditingGuide(null);
      form.reset();
    },
    onError: (error) => {
      toast({ 
        title: "更新失敗", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('beginner_guides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beginner-guides-admin'] });
      queryClient.invalidateQueries({ queryKey: ['beginner-guides'] });
      toast({ title: "新手指南已刪除" });
    },
    onError: (error) => {
      toast({ 
        title: "刪除失敗", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const onSubmit = (data: GuideFormData) => {
    if (editingGuide) {
      updateMutation.mutate({ id: editingGuide.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (guide: BeginnerGuide) => {
    setEditingGuide(guide);
    form.reset({
      name: guide.name,
      description: guide.description,
      url: guide.url
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這個新手指南嗎？')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingGuide(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>新手指南管理</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                新增指南
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGuide ? '編輯新手指南' : '新增新手指南'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名稱</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="輸入指南名稱" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>描述</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="輸入指南描述" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>外部連結</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      取消
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingGuide ? '更新' : '新增'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名稱</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>連結</TableHead>
              <TableHead>建立時間</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides?.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell className="font-medium">{guide.name}</TableCell>
                <TableCell>{guide.description}</TableCell>
                <TableCell>
                  <a 
                    href={guide.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {guide.url}
                  </a>
                </TableCell>
                <TableCell>
                  {new Date(guide.created_at).toLocaleDateString('zh-TW')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(guide)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(guide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BeginnerGuidesAdmin;