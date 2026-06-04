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
