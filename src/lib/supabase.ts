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