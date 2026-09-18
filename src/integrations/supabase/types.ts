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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_details: Json
          discount_minor: number
          guest_email: string | null
          guest_phone: string | null
          id: string
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal_minor: number
          total_minor: number
          updated_at: string
          user_id: string | null
          verification_hash: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_details?: Json
          discount_minor?: number
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          order_number: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_minor: number
          total_minor: number
          updated_at?: string
          user_id?: string | null
          verification_hash: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_details?: Json
          discount_minor?: number
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_minor?: number
          total_minor?: number
          updated_at?: string
          user_id?: string | null
          verification_hash?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          currency: string
          id: string
          is_default: boolean
          name: string
          price_minor: number
          product_id: string
          sku: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number | null
        }
        Insert: {
          currency?: string
          id?: string
          is_default?: boolean
          name: string
          price_minor: number
          product_id: string
          sku: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number | null
        }
        Update: {
          currency?: string
          id?: string
          is_default?: boolean
          name?: string
          price_minor?: number
          product_id?: string
          sku?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badges: string[]
          brand: string
          category_id: string | null
          created_at: string
          currency: string
          delivery_method: string
          delivery_time: string
          description: string
          featured_rank: number | null
          id: string
          image_url: string | null
          is_published: boolean
          name: string
          platform: string | null
          redemption_instructions: string | null
          refund_eligibility: string
          region: string
          requirements: Json
          seo_description: string
          seo_title: string
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          summary: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          badges?: string[]
          brand: string
          category_id?: string | null
          created_at?: string
          currency?: string
          delivery_method?: string
          delivery_time?: string
          description: string
          featured_rank?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name: string
          platform?: string | null
          redemption_instructions?: string | null
          refund_eligibility?: string
          region?: string
          requirements?: Json
          seo_description: string
          seo_title: string
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          summary: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          badges?: string[]
          brand?: string
          category_id?: string | null
          created_at?: string
          currency?: string
          delivery_method?: string
          delivery_time?: string
          description?: string
          featured_rank?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name?: string
          platform?: string | null
          redemption_instructions?: string | null
          refund_eligibility?: string
          region?: string
          requirements?: Json
          seo_description?: string
          seo_title?: string
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          summary?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          delivery_email: string | null
          display_name: string | null
          id: string
          phone: string | null
          preferences: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_email?: string | null
          display_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_email?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          id: string
          is_approved: boolean
          is_verified_purchase: boolean
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          issue_type: string
          order_number: string | null
          screenshot_path: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          issue_type: string
          order_number?: string | null
          screenshot_path?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          issue_type?: string
          order_number?: string | null
          screenshot_path?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "customer"
      order_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "cancelled"
        | "refunded"
        | "fulfilled"
        | "completed"
      product_status:
        | "available"
        | "low_stock"
        | "coming_soon"
        | "out_of_stock"
        | "temporarily_unavailable"
        | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "customer"],
      order_status: [
        "pending",
        "processing",
        "paid",
        "failed",
        "cancelled",
        "refunded",
        "fulfilled",
        "completed",
      ],
      product_status: [
        "available",
        "low_stock",
        "coming_soon",
        "out_of_stock",
        "temporarily_unavailable",
        "archived",
      ],
    },
  },
} as const
