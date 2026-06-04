import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mkllbwsxvkcacyztgsgv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGxid3N4dmtjYWN5enRnc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjczNjksImV4cCI6MjA3MDI0MzM2OX0.j8IQZIgsGqTFZ8L-MgELv6J_MBoNEf1zgZPL6PERWoA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Project {
  id: string
  name: string
  description: string
  amount: number
  target: number
  backers: number
  platform: string
  category: string
  country: string
  launch_date: string
  success_rate: number
  status: 'active' | 'completed' | 'failed'
  image_url?: string
  project_url?: string
  created_at: string
  updated_at: string
}

export type CrowdfundingPlatform = 'kickstarter' | 'campfire'
export type CrowdfundingClassification = 'approved' | 'review' | 'rejected'
export type CrowdfundingProjectStatus = 'active' | 'upcoming' | 'ended' | 'unknown'

export interface CrowdfundingTrackedProject {
  id: string
  platform: CrowdfundingPlatform
  source_id: string | null
  source_url: string
  title: string
  creator: string | null
  description: string | null
  image_url: string | null
  country: string | null
  currency: string | null
  pledged_amount: number
  goal_amount: number
  percent_funded: number
  backer_count: number
  start_at: string | null
  end_at: string | null
  project_status: CrowdfundingProjectStatus
  auto_classification: CrowdfundingClassification
  manual_classification: CrowdfundingClassification | null
  effective_classification: CrowdfundingClassification
  confidence: number
  classification_reasons: string[]
  ignore_forever: boolean
  admin_note: string | null
  raw_payload: unknown | null
  first_seen_at: string
  last_seen_at: string
  last_fetched_at: string | null
  created_at: string
  updated_at: string
}

export interface CrowdfundingFetchRun {
  id: string
  source: CrowdfundingPlatform | 'all'
  started_at: string
  finished_at: string | null
  status: 'running' | 'success' | 'failed'
  pages_requested: number
  candidates_found: number
  created_count: number
  updated_count: number
  approved_count: number
  review_count: number
  rejected_count: number
  error_message: string | null
  metadata: unknown | null
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  published_at: string
  category: string
  featured_image?: string
  url?: string
  created_at: string
  updated_at: string
}

export interface CrowdfundingCase {
  id: string
  name: string
  description: string
  amount: number
  target: number
  backers: number
  success_rate: number
  currency?: string
  game_type?: string
  project_year?: number
  image_url?: string
  project_url?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface GameShowcase {
  id: string
  name: string
  description: string
  image_url?: string
  game_url?: string
  created_at: string
  updated_at: string
}
