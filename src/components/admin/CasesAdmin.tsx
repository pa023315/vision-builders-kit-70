import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { useCrowdfundingCases, useCreateCrowdfundingCase, useUpdateCrowdfundingCase, useDeleteCrowdfundingCase } from "@/hooks/useCrowdfundingCases";
import { useGameShowcases, useCreateGameShowcase, useUpdateGameShowcase, useDeleteGameShowcase } from "@/hooks/useGameShowcases";
import { CrowdfundingCase, GameShowcase } from "@/lib/supabase";
import { ImageUpload } from "@/components/ImageUpload";

type SortField = 'name' | 'amount' | 'target' | 'success_rate' | 'backers' | 'project_year';
type SortDirection = 'asc' | 'desc';

export const CasesAdmin = () => {
  const [crowdfundingDialogOpen, setCrowdfundingDialogOpen] = useState(false);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);
  const [editingCrowdfunding, setEditingCrowdfunding] = useState<CrowdfundingCase | null>(null);
  const [editingGame, setEditingGame] = useState<GameShowcase | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const [crowdfundingForm, setCrowdfundingForm] = useState({
    name: "",
    description: "",
    amount: "",
    target: "",
    backers: "",
    currency: "USD",
    game_type: "",
    project_year: "",
    image_url: "",
    project_url: "",
  });

  const [gameForm, setGameForm] = useState({
    name: "",
    description: "",
    image_url: "",
    game_url: "",
  });

  const { data: crowdfundingCases = [], isLoading: loadingCrowdfunding } = useCrowdfundingCases();
  const { data: gameShowcases = [], isLoading: loadingGames } = useGameShowcases();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCrowdfundingCases = [...crowdfundingCases].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle null/undefined values
    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';

    // Convert to lowercase for string comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );
  
  const createCrowdfunding = useCreateCrowdfundingCase();
  const updateCrowdfunding = useUpdateCrowdfundingCase();
  const deleteCrowdfunding = useDeleteCrowdfundingCase();
  
  const createGame = useCreateGameShowcase();
  const updateGame = useUpdateGameShowcase();
  const deleteGame = useDeleteGameShowcase();

  const resetCrowdfundingForm = () => {
    setCrowdfundingForm({
      name: "",
      description: "",
      amount: "",
      target: "",
      backers: "",
      currency: "USD",
      game_type: "",
      project_year: "",
      image_url: "",
      project_url: "",
    });
    setEditingCrowdfunding(null);
  };

  const resetGameForm = () => {
    setGameForm({
      name: "",
      description: "",
      image_url: "",
      game_url: "",
    });
    setEditingGame(null);
  };

  const handleCrowdfundingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseInt(crowdfundingForm.amount);
    const target = parseInt(crowdfundingForm.target);
    const success_rate = Math.round((amount / target) * 100);
    
    const data = {
      ...crowdfundingForm,
      amount,
      target,
      backers: parseInt(crowdfundingForm.backers),
      project_year: crowdfundingForm.project_year ? parseInt(crowdfundingForm.project_year) : undefined,
      success_rate,
    };

    if (editingCrowdfunding) {
      updateCrowdfunding.mutate({ id: editingCrowdfunding.id, ...data });
    } else {
      createCrowdfunding.mutate(data);
    }

    resetCrowdfundingForm();
    setCrowdfundingDialogOpen(false);
  };

  const handleGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGame) {
      updateGame.mutate({ id: editingGame.id, ...gameForm });
    } else {
      createGame.mutate(gameForm);
    }

    resetGameForm();
    setGameDialogOpen(false);
  };

  const handleEditCrowdfunding = (case_: CrowdfundingCase) => {
    setEditingCrowdfunding(case_);
    setCrowdfundingForm({
      name: case_.name,
      description: case_.description,
      amount: case_.amount.toString(),
      target: case_.target.toString(),
      backers: case_.backers.toString(),
      currency: case_.currency || "USD",
      game_type: case_.game_type || "",
      project_year: case_.project_year ? case_.project_year.toString() : "",
      image_url: case_.image_url || "",
      project_url: case_.project_url || "",
    });
    setCrowdfundingDialogOpen(true);
  };

  const handleEditGame = (game: GameShowcase) => {
    setEditingGame(game);
    setGameForm({
      name: game.name,
      description: game.description,
      image_url: game.image_url || "",
      game_url: game.game_url || "",
    });
    setGameDialogOpen(true);
  };

  const handleDeleteCrowdfunding = (id: string) => {
    if (confirm("確定要刪除此集資案例嗎？")) {
      deleteCrowdfunding.mutate(id);
    }
  };

  const handleDeleteGame = (id: string) => {
    if (confirm("確定要刪除此遊戲案例嗎？")) {
      deleteGame.mutate(id);
    }
  };

  if (loadingCrowdfunding || loadingGames) {
    return <div>載入中...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="crowdfunding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="crowdfunding">集資專案案例</TabsTrigger>
          <TabsTrigger value="games">遊戲內呈現案例</TabsTrigger>
        </TabsList>

        <TabsContent value="crowdfunding">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>集資專案案例管理</CardTitle>
                <Dialog open={crowdfundingDialogOpen} onOpenChange={setCrowdfundingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCrowdfundingForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      新增集資案例
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCrowdfunding ? "編輯集資案例" : "新增集資案例"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCrowdfundingSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="cf-name">專案名稱</Label>
                        <Input
                          id="cf-name"
                          value={crowdfundingForm.name}
                          onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cf-description">專案介紹</Label>
                        <Textarea
                          id="cf-description"
                          value={crowdfundingForm.description}
                          onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cf-amount">贊助金額</Label>
                          <Input
                            id="cf-amount"
                            type="number"
                            value={crowdfundingForm.amount}
                            onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, amount: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cf-target">目標金額</Label>
                          <Input
                            id="cf-target"
                            type="number"
                            value={crowdfundingForm.target}
                            onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, target: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cf-backers">贊助人數</Label>
                          <Input
                            id="cf-backers"
                            type="number"
                            value={crowdfundingForm.backers}
                            onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, backers: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cf-currency">幣值</Label>
                          <Input
                            id="cf-currency"
                            value={crowdfundingForm.currency}
                            onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, currency: e.target.value })}
                            placeholder="USD, TWD, JPY..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="cf-game-type">遊戲類型</Label>
                          <Input
                            id="cf-game-type"
                            value={crowdfundingForm.game_type}
                            onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, game_type: e.target.value })}
                            placeholder="動作、角色扮演、策略..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="cf-project-year">專案年份</Label>
                          <Input
                            id="cf-project-year"
                            type="number"
                            value={crowdfundingForm.project_year}
                            onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, project_year: e.target.value })}
                            placeholder="2024"
                            min="2000"
                            max="2030"
                          />
                        </div>
                      </div>

                      <div>
                        <ImageUpload
                          label="專案圖片"
                          value={crowdfundingForm.image_url}
                          onChange={(url) => setCrowdfundingForm({ 
                            ...crowdfundingForm, 
                            image_url: url 
                          })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cf-url">專案網址</Label>
                        <Input
                          id="cf-url"
                          value={crowdfundingForm.project_url}
                          onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, project_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setCrowdfundingDialogOpen(false)}>
                          取消
                        </Button>
                        <Button type="submit">
                          {editingCrowdfunding ? "更新" : "創建"}
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
                      <SortableHeader field="name">專案名稱</SortableHeader>
                      <SortableHeader field="amount">贊助金額</SortableHeader>
                      <SortableHeader field="target">目標金額</SortableHeader>
                      <SortableHeader field="success_rate">達成率</SortableHeader>
                      <SortableHeader field="backers">贊助人數</SortableHeader>
                      <TableHead>幣值</TableHead>
                      <TableHead>遊戲類型</TableHead>
                      <SortableHeader field="project_year">專案年份</SortableHeader>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCrowdfundingCases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell className="font-medium">{case_.name}</TableCell>
                        <TableCell>{case_.amount.toLocaleString()}</TableCell>
                        <TableCell>{case_.target.toLocaleString()}</TableCell>
                        <TableCell>{case_.success_rate}%</TableCell>
                        <TableCell>{case_.backers}</TableCell>
                        <TableCell>{case_.currency || 'USD'}</TableCell>
                        <TableCell>{case_.game_type || '-'}</TableCell>
                        <TableCell>{case_.project_year || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {case_.project_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(case_.project_url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCrowdfunding(case_)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCrowdfunding(case_.id)}
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
        </TabsContent>

        <TabsContent value="games">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>遊戲內呈現案例管理</CardTitle>
                <Dialog open={gameDialogOpen} onOpenChange={setGameDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetGameForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      新增遊戲案例
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingGame ? "編輯遊戲案例" : "新增遊戲案例"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGameSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="game-name">遊戲名稱</Label>
                        <Input
                          id="game-name"
                          value={gameForm.name}
                          onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="game-description">介紹說明</Label>
                        <Textarea
                          id="game-description"
                          value={gameForm.description}
                          onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <ImageUpload
                          label="遊戲圖片"
                          value={gameForm.image_url}
                          onChange={(url) => setGameForm({ 
                            ...gameForm, 
                            image_url: url 
                          })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="game-url">遊戲連結</Label>
                        <Input
                          id="game-url"
                          value={gameForm.game_url}
                          onChange={(e) => setGameForm({ ...gameForm, game_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setGameDialogOpen(false)}>
                          取消
                        </Button>
                        <Button type="submit">
                          {editingGame ? "更新" : "創建"}
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
                      <TableHead>遊戲名稱</TableHead>
                      <TableHead>介紹說明</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameShowcases.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{game.name}</TableCell>
                        <TableCell className="max-w-md truncate">{game.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {game.game_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(game.game_url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditGame(game)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteGame(game.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};