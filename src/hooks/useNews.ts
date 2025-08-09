import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, NewsItem } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })
      
      if (error) throw error
      return data as NewsItem[]
    },
  })
}

export const useCreateNews = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('news')
        .insert([news])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast({
        title: "新聞已發布",
        description: "新文章已成功添加",
      })
    },
    onError: () => {
      toast({
        title: "發布失敗",
        description: "無法發布新聞，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateNews = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast({
        title: "新聞已更新",
        description: "文章已成功更新",
      })
    },
    onError: () => {
      toast({
        title: "更新失敗",
        description: "無法更新新聞，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteNews = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast({
        title: "新聞已刪除",
        description: "文章已從系統中移除",
      })
    },
    onError: () => {
      toast({
        title: "刪除失敗",
        description: "無法刪除新聞，請重試",
        variant: "destructive",
      })
    },
  })
}