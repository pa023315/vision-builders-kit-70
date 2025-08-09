import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, CaseStudy } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useCaseStudies = () => {
  return useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as CaseStudy[]
    },
  })
}

export const useCreateCaseStudy = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (caseStudy: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('case_studies')
        .insert([caseStudy])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] })
      toast({
        title: "案例已新增",
        description: "新案例分析已成功添加",
      })
    },
    onError: () => {
      toast({
        title: "新增失敗",
        description: "無法新增案例，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateCaseStudy = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CaseStudy> & { id: string }) => {
      const { data, error } = await supabase
        .from('case_studies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] })
      toast({
        title: "案例已更新",
        description: "案例資料已成功更新",
      })
    },
    onError: () => {
      toast({
        title: "更新失敗",
        description: "無法更新案例，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteCaseStudy = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] })
      toast({
        title: "案例已刪除",
        description: "案例已從系統中移除",
      })
    },
    onError: () => {
      toast({
        title: "刪除失敗",
        description: "無法刪除案例，請重試",
        variant: "destructive",
      })
    },
  })
}