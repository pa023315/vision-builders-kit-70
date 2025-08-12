import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

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
  created_at: string
  updated_at: string
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
  image_url?: string
  project_url?: string
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