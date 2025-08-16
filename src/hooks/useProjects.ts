import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Project } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Project[]
    },
  })
}

export const useTaiwanProjects = () => {
  return useQuery({
    queryKey: ['taiwan-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('country', '台灣')
        .order('amount', { ascending: false })
        .limit(10)
      
      if (error) throw error
      return data as Project[]
    },
  })
}

export const useAllTaiwanProjects = () => {
  return useQuery({
    queryKey: ['all-taiwan-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('country', '台灣')
        .order('amount', { ascending: false })
      
      if (error) throw error
      return data as Project[]
    },
  })
}

export const useGlobalProjects = () => {
  return useQuery({
    queryKey: ['global-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .neq('country', '台灣')
        .order('amount', { ascending: false })
        .limit(10)
      
      if (error) throw error
      return data as Project[]
    },
  })
}

export const useCreateProject = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['taiwan-projects'] })
      queryClient.invalidateQueries({ queryKey: ['all-taiwan-projects'] })
      queryClient.invalidateQueries({ queryKey: ['global-projects'] })
      toast({
        title: "專案已創建",
        description: "新專案已成功添加到資料庫",
      })
    },
    onError: (error) => {
      toast({
        title: "創建失敗",
        description: "無法創建專案，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateProject = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['taiwan-projects'] })
      queryClient.invalidateQueries({ queryKey: ['all-taiwan-projects'] })
      queryClient.invalidateQueries({ queryKey: ['global-projects'] })
      toast({
        title: "專案已更新",
        description: "專案資料已成功更新",
      })
    },
    onError: (error) => {
      toast({
        title: "更新失敗",
        description: "無法更新專案，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteProject = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['taiwan-projects'] })
      queryClient.invalidateQueries({ queryKey: ['all-taiwan-projects'] })
      queryClient.invalidateQueries({ queryKey: ['global-projects'] })
      toast({
        title: "專案已刪除",
        description: "專案已從資料庫中移除",
      })
    },
    onError: (error) => {
      toast({
        title: "刪除失敗",
        description: "無法刪除專案，請重試",
        variant: "destructive",
      })
    },
  })
}