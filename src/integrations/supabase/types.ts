export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      beginner_guides: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      changelog: {
        Row: {
          content: string
          created_at: string
          date: string
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          date: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      crowdfunding_cases: {
        Row: {
          amount: number
          backers: number
          created_at: string
          currency: string | null
          description: string
          display_order: number | null
          game_type: string | null
          id: string
          image_url: string | null
          name: string
          project_url: string | null
          project_year: number | null
          success_rate: number
          target: number
          updated_at: string
        }
        Insert: {
          amount: number
          backers: number
          created_at?: string
          currency?: string | null
          description: string
          display_order?: number | null
          game_type?: string | null
          id?: string
          image_url?: string | null
          name: string
          project_url?: string | null
          project_year?: number | null
          success_rate: number
          target: number
          updated_at?: string
        }
        Update: {
          amount?: number
          backers?: number
          created_at?: string
          currency?: string | null
          description?: string
          display_order?: number | null
          game_type?: string | null
          id?: string
          image_url?: string | null
          name?: string
          project_url?: string | null
          project_year?: number | null
          success_rate?: number
          target?: number
          updated_at?: string
        }
        Relationships: []
      }
      crowdfunding_fetch_runs: {
        Row: {
          approved_count: number
          candidates_found: number
          created_at: string
          created_count: number
          error_message: string | null
          finished_at: string | null
          id: string
          metadata: Json | null
          pages_requested: number
          rejected_count: number
          review_count: number
          source: "kickstarter" | "campfire" | "all"
          started_at: string
          status: "running" | "success" | "failed"
          updated_count: number
        }
        Insert: {
          approved_count?: number
          candidates_found?: number
          created_at?: string
          created_count?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          pages_requested?: number
          rejected_count?: number
          review_count?: number
          source: "kickstarter" | "campfire" | "all"
          started_at?: string
          status?: "running" | "success" | "failed"
          updated_count?: number
        }
        Update: {
          approved_count?: number
          candidates_found?: number
          created_at?: string
          created_count?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          pages_requested?: number
          rejected_count?: number
          review_count?: number
          source?: "kickstarter" | "campfire" | "all"
          started_at?: string
          status?: "running" | "success" | "failed"
          updated_count?: number
        }
        Relationships: []
      }
      crowdfunding_tracked_projects: {
        Row: {
          admin_note: string | null
          auto_classification: "approved" | "review" | "rejected"
          backer_count: number
          classification_reasons: string[]
          confidence: number
          country: string | null
          created_at: string
          creator: string | null
          currency: string | null
          description: string | null
          effective_classification: "approved" | "review" | "rejected"
          end_at: string | null
          first_seen_at: string
          goal_amount: number
          id: string
          ignore_forever: boolean
          image_url: string | null
          last_fetched_at: string | null
          last_seen_at: string
          manual_classification: "approved" | "review" | "rejected" | null
          percent_funded: number
          platform: "kickstarter" | "campfire"
          pledged_amount: number
          project_status: "active" | "upcoming" | "ended" | "unknown"
          raw_payload: Json | null
          source_id: string | null
          source_url: string
          start_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          auto_classification?: "approved" | "review" | "rejected"
          backer_count?: number
          classification_reasons?: string[]
          confidence?: number
          country?: string | null
          created_at?: string
          creator?: string | null
          currency?: string | null
          description?: string | null
          effective_classification?: "approved" | "review" | "rejected"
          end_at?: string | null
          first_seen_at?: string
          goal_amount?: number
          id?: string
          ignore_forever?: boolean
          image_url?: string | null
          last_fetched_at?: string | null
          last_seen_at?: string
          manual_classification?: "approved" | "review" | "rejected" | null
          percent_funded?: number
          platform: "kickstarter" | "campfire"
          pledged_amount?: number
          project_status?: "active" | "upcoming" | "ended" | "unknown"
          raw_payload?: Json | null
          source_id?: string | null
          source_url: string
          start_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          auto_classification?: "approved" | "review" | "rejected"
          backer_count?: number
          classification_reasons?: string[]
          confidence?: number
          country?: string | null
          created_at?: string
          creator?: string | null
          currency?: string | null
          description?: string | null
          effective_classification?: "approved" | "review" | "rejected"
          end_at?: string | null
          first_seen_at?: string
          goal_amount?: number
          id?: string
          ignore_forever?: boolean
          image_url?: string | null
          last_fetched_at?: string | null
          last_seen_at?: string
          manual_classification?: "approved" | "review" | "rejected" | null
          percent_funded?: number
          platform?: "kickstarter" | "campfire"
          pledged_amount?: number
          project_status?: "active" | "upcoming" | "ended" | "unknown"
          raw_payload?: Json | null
          source_id?: string | null
          source_url?: string
          start_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_showcases: {
        Row: {
          created_at: string
          description: string
          game_url: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          game_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          game_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          featured_image: string | null
          id: string
          published_at: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          featured_image?: string | null
          id?: string
          published_at?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          published_at?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          amount: number
          backers: number
          category: string
          country: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          launch_date: string | null
          name: string
          platform: string
          project_url: string | null
          status: string
          success_rate: number
          target: number
          updated_at: string
        }
        Insert: {
          amount?: number
          backers?: number
          category: string
          country: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          launch_date?: string | null
          name: string
          platform: string
          project_url?: string | null
          status?: string
          success_rate?: number
          target?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          backers?: number
          category?: string
          country?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          launch_date?: string | null
          name?: string
          platform?: string
          project_url?: string | null
          status?: string
          success_rate?: number
          target?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
