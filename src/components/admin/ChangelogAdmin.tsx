import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChangelogEntry {
  id: string;
  date: string;
  content: string;
}

export const ChangelogAdmin = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("changelog")
      .select("id, date, content")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "載入失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAdd = async () => {
    if (!newDate || !newContent) {
      toast({
        title: "請填寫完整",
        description: "日期和內容都必須填寫",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("changelog")
      .insert({ date: newDate, content: newContent });

    if (error) {
      toast({
        title: "新增失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "新增成功", description: "已新增更新紀錄" });
      setNewDate("");
      setNewContent("");
      fetchEntries();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("changelog").delete().eq("id", id);

    if (error) {
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "刪除成功", description: "已刪除更新紀錄" });
      fetchEntries();
    }
  };

  const handleStartEdit = (entry: ChangelogEntry) => {
    setEditingId(entry.id);
    setEditDate(entry.date);
    setEditContent(entry.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDate("");
    setEditContent("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editDate || !editContent) {
      toast({
        title: "請填寫完整",
        description: "日期和內容都必須填寫",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("changelog")
      .update({ date: editDate, content: editContent })
      .eq("id", id);

    if (error) {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "更新成功", description: "已更新紀錄" });
      setEditingId(null);
      setEditDate("");
      setEditContent("");
      fetchEntries();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>更新紀錄管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 新增表單 */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex-shrink-0">
            <Label htmlFor="date">日期</Label>
            <Input
              id="date"
              placeholder="例如: 2026.01.03"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="content">內容</Label>
            <Input
              id="content"
              placeholder="更新內容描述"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              新增
            </Button>
          </div>
        </div>

        {/* 現有紀錄列表 */}
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              {editingId === entry.id ? (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <Input
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-40"
                      placeholder="日期"
                    />
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1"
                      placeholder="內容"
                    />
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveEdit(entry.id)}
                      className="text-primary hover:text-primary"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                      {entry.date}
                    </span>
                    <span className="text-foreground">{entry.content}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangelogAdmin;
