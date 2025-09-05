import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, CrowdfundingCase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useCrowdfundingCases = () => {
  return useQuery({
    queryKey: ['crowdfunding-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_cases')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as CrowdfundingCase[]
    },
  })
}

export const useCreateCrowdfundingCase = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (caseData: Omit<CrowdfundingCase, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating crowdfunding case with data:', caseData)
      const { data, error } = await supabase
        .from('crowdfunding_cases')
        .insert([caseData])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating crowdfunding case:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crowdfunding-cases'] })
      toast({
        title: "集資案例已新增",
        description: "新的集資專案案例已成功添加",
      })
    },
    onError: (error) => {
      console.error('Create crowdfunding case mutation error:', error)
      toast({
        title: "新增失敗", 
        description: `無法新增集資案例：${error.message || '請重試'}`,
        variant: "destructive",
      })
    },
  })
}

export const useUpdateCrowdfundingCase = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CrowdfundingCase> & { id: string }) => {
      const { data, error } = await supabase
        .from('crowdfunding_cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crowdfunding-cases'] })
      toast({
        title: "集資案例已更新",
        description: "集資專案案例已成功更新",
      })
    },
    onError: () => {
      toast({
        title: "更新失敗",
        description: "無法更新集資案例，請重試",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteCrowdfundingCase = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crowdfunding_cases')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crowdfunding-cases'] })
      toast({
        title: "集資案例已刪除",
        description: "集資專案案例已從系統中移除",
      })
    },
    onError: () => {
      toast({
        title: "刪除失敗",
        description: "無法刪除集資案例，請重試",
        variant: "destructive",
      })
    },
  })
}