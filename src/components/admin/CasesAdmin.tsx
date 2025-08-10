import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useCrowdfundingCases, useCreateCrowdfundingCase, useUpdateCrowdfundingCase, useDeleteCrowdfundingCase } from "@/hooks/useCrowdfundingCases";
import { useGameShowcases, useCreateGameShowcase, useUpdateGameShowcase, useDeleteGameShowcase } from "@/hooks/useGameShowcases";
import { CrowdfundingCase, GameShowcase } from "@/lib/supabase";

export const CasesAdmin = () => {
  const [crowdfundingDialogOpen, setCrowdfundingDialogOpen] = useState(false);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);
  const [editingCrowdfunding, setEditingCrowdfunding] = useState<CrowdfundingCase | null>(null);
  const [editingGame, setEditingGame] = useState<GameShowcase | null>(null);
  
  const [crowdfundingForm, setCrowdfundingForm] = useState({
    name: "",
    description: "",
    amount: "",
    target: "",
    backers: "",
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

                      <div>
                        <Label htmlFor="cf-image">專案圖片網址</Label>
                        <Input
                          id="cf-image"
                          value={crowdfundingForm.image_url}
                          onChange={(e) => setCrowdfundingForm({ ...crowdfundingForm, image_url: e.target.value })}
                          placeholder="https://..."
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
                      <TableHead>專案名稱</TableHead>
                      <TableHead>贊助金額</TableHead>
                      <TableHead>目標金額</TableHead>
                      <TableHead>達成率</TableHead>
                      <TableHead>贊助人數</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crowdfundingCases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell className="font-medium">{case_.name}</TableCell>
                        <TableCell>{case_.amount.toLocaleString()}</TableCell>
                        <TableCell>{case_.target.toLocaleString()}</TableCell>
                        <TableCell>{case_.success_rate}%</TableCell>
                        <TableCell>{case_.backers}</TableCell>
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
                        <Label htmlFor="game-image">遊戲圖片網址</Label>
                        <Input
                          id="game-image"
                          value={gameForm.image_url}
                          onChange={(e) => setGameForm({ ...gameForm, image_url: e.target.value })}
                          placeholder="https://..."
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