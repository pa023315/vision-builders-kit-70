import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Link, Loader2 } from "lucide-react";
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/useNews";
import { NewsItem } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";

const CUSTOM_VALUE = "__custom__";

export const NewsAdmin = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isUrlFetching, setIsUrlFetching] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    published_at: "",
    url: "",
    featured_image: "",
  });

  const [customAuthor, setCustomAuthor] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomAuthor, setIsCustomAuthor] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const { data: news = [], isLoading } = useNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  // Extract unique authors and categories from existing news
  const uniqueAuthors = useMemo(() => {
    const authors = news.map(n => n.author).filter(Boolean);
    return [...new Set(authors)];
  }, [news]);

  const uniqueCategories = useMemo(() => {
    const categories = news.map(n => n.category).filter(Boolean);
    return [...new Set(categories)];
  }, [news]);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      published_at: "",
      url: "",
      featured_image: "",
    });
    setEditingNews(null);
    setCustomAuthor("");
    setCustomCategory("");
    setIsCustomAuthor(false);
    setIsCustomCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNews) {
      updateNews.mutate({ id: editingNews.id, ...formData });
    } else {
      createNews.mutate(formData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      author: newsItem.author,
      category: newsItem.category,
      published_at: newsItem.published_at.split('T')[0],
      url: newsItem.url || "",
      featured_image: newsItem.featured_image || "",
    });
    // Check if author/category exists in the list
    const authorExists = uniqueAuthors.includes(newsItem.author);
    const categoryExists = uniqueCategories.includes(newsItem.category);
    setIsCustomAuthor(!authorExists);
    setIsCustomCategory(!categoryExists);
    if (!authorExists) setCustomAuthor(newsItem.author);
    if (!categoryExists) setCustomCategory(newsItem.category);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("確定要刪除此新聞嗎？")) {
      deleteNews.mutate(id);
    }
  };

  const handleUrlFetch = async () => {
    if (!formData.url) {
      alert('請先輸入網址');
      return;
    }

    setIsUrlFetching(true);
    try {
      // 使用 Supabase client 調用 edge function
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { url: formData.url }
      });

      if (error) {
        throw error;
      }
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        excerpt: data.excerpt || prev.excerpt,
        content: data.content || prev.content,
        author: data.author || prev.author,
        category: data.category || prev.category,
      }));

      alert('網頁內容已自動填入！');
    } catch (error) {
      console.error('獲取網頁內容失敗:', error);
      alert('無法獲取網頁內容，請手動輸入');
    } finally {
      setIsUrlFetching(false);
    }
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>新聞管理</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  新增新聞
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNews ? "編輯新聞" : "新增新聞"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">標題</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">摘要</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">內容</Label>
                    <Textarea
                      id="content"
                      className="min-h-[200px]"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">作者</Label>
                      {isCustomAuthor ? (
                        <div className="flex gap-2">
                          <Input
                            id="author"
                            placeholder="輸入新作者名稱"
                            value={customAuthor}
                            onChange={(e) => {
                              setCustomAuthor(e.target.value);
                              setFormData({ ...formData, author: e.target.value });
                            }}
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsCustomAuthor(false);
                              setCustomAuthor("");
                              setFormData({ ...formData, author: "" });
                            }}
                          >
                            取消
                          </Button>
                        </div>
                      ) : (
                        <Select
                          value={formData.author}
                          onValueChange={(value) => {
                            if (value === CUSTOM_VALUE) {
                              setIsCustomAuthor(true);
                              setFormData({ ...formData, author: "" });
                            } else {
                              setFormData({ ...formData, author: value });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇作者" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueAuthors.map((author) => (
                              <SelectItem key={author} value={author}>
                                {author}
                              </SelectItem>
                            ))}
                            <SelectItem value={CUSTOM_VALUE}>+ 新增作者</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="category">分類</Label>
                      {isCustomCategory ? (
                        <div className="flex gap-2">
                          <Input
                            id="category"
                            placeholder="輸入新分類名稱"
                            value={customCategory}
                            onChange={(e) => {
                              setCustomCategory(e.target.value);
                              setFormData({ ...formData, category: e.target.value });
                            }}
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsCustomCategory(false);
                              setCustomCategory("");
                              setFormData({ ...formData, category: "" });
                            }}
                          >
                            取消
                          </Button>
                        </div>
                      ) : (
                        <Select
                          value={formData.category}
                          onValueChange={(value) => {
                            if (value === CUSTOM_VALUE) {
                              setIsCustomCategory(true);
                              setFormData({ ...formData, category: "" });
                            } else {
                              setFormData({ ...formData, category: value });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇分類" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value={CUSTOM_VALUE}>+ 新增分類</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="published_at">發布日期</Label>
                    <Input
                      id="published_at"
                      type="date"
                      value={formData.published_at}
                      onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="url">新聞網址</Label>
                    <div className="flex gap-2">
                      <Input
                        id="url"
                        type="url"
                        placeholder="貼上新聞網址，點擊抓取按鈕自動填入內容"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUrlFetch}
                        disabled={isUrlFetching || !formData.url}
                      >
                        {isUrlFetching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                        抓取
                      </Button>
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      value={formData.featured_image}
                      onChange={(url) => setFormData({ ...formData, featured_image: url })}
                      label="特色圖片"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      {editingNews ? "更新" : "發布"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>標題</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead>分類</TableHead>
                  <TableHead>外部連結</TableHead>
                  <TableHead>發布日期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell className="font-medium">{newsItem.title}</TableCell>
                    <TableCell>{newsItem.author}</TableCell>
                    <TableCell>{newsItem.category}</TableCell>
                    <TableCell>
                      {newsItem.url ? (
                        <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          外部連結
                        </a>
                      ) : (
                        "無"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(newsItem.published_at).toLocaleDateString('zh-TW')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(newsItem)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(newsItem.id)}
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