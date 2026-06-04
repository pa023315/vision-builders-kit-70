import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import {
  CrowdfundingClassification,
  CrowdfundingFetchRun,
  CrowdfundingTrackedProject,
} from '@/lib/supabase'

const trackerQueryKey = ['crowdfunding-tracker']
const fetchRunsQueryKey = ['crowdfunding-fetch-runs']

export const useApprovedCrowdfundingProjects = () => {
  return useQuery({
    queryKey: [...trackerQueryKey, 'approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_tracked_projects')
        .select('*')
        .eq('effective_classification', 'approved')
        .eq('ignore_forever', false)
        .order('last_seen_at', { ascending: false })

      if (error) throw error
      return data as CrowdfundingTrackedProject[]
    },
  })
}

export const useAdminCrowdfundingProjects = () => {
  return useQuery({
    queryKey: [...trackerQueryKey, 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_tracked_projects')
        .select('*')
        .order('last_seen_at', { ascending: false })

      if (error) throw error
      return data as CrowdfundingTrackedProject[]
    },
  })
}

export const useCrowdfundingFetchRuns = () => {
  return useQuery({
    queryKey: fetchRunsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_fetch_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(30)

      if (error) throw error
      return data as CrowdfundingFetchRun[]
    },
  })
}

export const useUpdateCrowdfundingReview = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      manualClassification,
      ignoreForever = false,
      adminNote,
    }: {
      id: string
      manualClassification: CrowdfundingClassification | null
      ignoreForever?: boolean
      adminNote?: string | null
    }) => {
      const { data, error } = await supabase
        .from('crowdfunding_tracked_projects')
        .update({
          manual_classification: manualClassification,
          ignore_forever: ignoreForever,
          admin_note: adminNote,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackerQueryKey })
      toast({ title: '審核結果已更新' })
    },
    onError: () => {
      toast({
        title: '更新失敗',
        description: '無法更新審核結果，請稍後再試',
        variant: 'destructive',
      })
    },
  })
}

export const useTriggerCrowdfundingTracker = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        'trigger-crowdfunding-tracker',
        { body: {} },
      )

      if (error) throw error
      return data as {
        status: string
        repository: string
        workflow_file: string
        ref: string
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fetchRunsQueryKey })
      toast({
        title: '已送出強制更新',
        description: 'GitHub Actions 已排入執行，稍後可在抓取紀錄查看結果',
      })
    },
    onError: () => {
      toast({
        title: '強制更新失敗',
        description: '無法觸發 GitHub Actions，請確認 Edge Function secrets 是否已設定',
        variant: 'destructive',
      })
    },
  })
}
