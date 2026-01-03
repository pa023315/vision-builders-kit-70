import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChangelogEntry {
  id: string;
  date: string;
  content: string;
}

const STORAGE_KEY = "changelog_entries";

const getStoredEntries = (): ChangelogEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // 預設資料
  return [
    { id: "1", date: "2026.01.03", content: "更新台灣數據" },
    { id: "2", date: "2025.09.18", content: "網站上線" },
  ];
};

const saveEntries = (entries: ChangelogEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const ChangelogAdmin = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>(getStoredEntries);
  const [newDate, setNewDate] = useState("");
  const [newContent, setNewContent] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newDate || !newContent) {
      toast({
        title: "請填寫完整",
        description: "日期和內容都必須填寫",
        variant: "destructive",
      });
      return;
    }

    const newEntry: ChangelogEntry = {
      id: Date.now().toString(),
      date: newDate,
      content: newContent,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
    setNewDate("");
    setNewContent("");

    toast({
      title: "新增成功",
      description: "已新增更新紀錄",
    });
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    saveEntries(updatedEntries);

    toast({
      title: "刪除成功",
      description: "已刪除更新紀錄",
    });
  };

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
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                  {entry.date}
                </span>
                <span className="text-foreground">{entry.content}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(entry.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangelogAdmin;
