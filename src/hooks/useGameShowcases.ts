import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, GameShowcase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useGameShowcases = () => {
  return useQuery({
    queryKey: ['game-showcases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_showcases')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as GameShowcase[]
    },
  })
}

export const useCreateGameShowcase = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (showcaseData: Omit<GameShowcase, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('game_showcases')
        .insert([showcaseData])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-showcases'] })
      toast({
        title: "遊戲案例已新增",
        description: "新的遊戲展示案例已成功添加",
      })
    },
    onError: () => {
      toast({
        title: "新增失敗",
        description: "無法新增遊戲案例，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateGameShowcase = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GameShowcase> & { id: string }) => {
      const { data, error } = await supabase
        .from('game_showcases')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-showcases'] })
      toast({
        title: "遊戲案例已更新",
        description: "遊戲展示案例已成功更新",
      })
    },
    onError: () => {
      toast({
        title: "更新失敗",
        description: "無法更新遊戲案例，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteGameShowcase = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('game_showcases')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-showcases'] })
      toast({
        title: "遊戲案例已刪除",
        description: "遊戲展示案例已從系統中移除",
      })
    },
    onError: () => {
      toast({
        title: "刪除失敗",
        description: "無法刪除遊戲案例，請重試",
        variant: "destructive",
      })
    },
  })
}