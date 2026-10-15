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
    PostgrestVersion: "14.17"
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
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          ends_at: string | null
          id: string
          kind: string
          max_uses: number | null
          min_subtotal_minor: number
          starts_at: string | null
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          ends_at?: string | null
          id?: string
          kind: string
          max_uses?: number | null
          min_subtotal_minor?: number
          starts_at?: string | null
          used_count?: number
          value: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          kind?: string
          max_uses?: number | null
          min_subtotal_minor?: number
          starts_at?: string | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          fields: Json
          id: string
          line_total_minor: number
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          sku: string
          unit_price_minor: number
          variant_id: string | null
          variant_name: string
        }
        Insert: {
          created_at?: string
          fields?: Json
          id?: string
          line_total_minor: number
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          sku: string
          unit_price_minor: number
          variant_id?: string | null
          variant_name: string
        }
        Update: {
          created_at?: string
          fields?: Json
          id?: string
          line_total_minor?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string
          unit_price_minor?: number
          variant_id?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_deliveries: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          kind: string
          order_id: string
          order_item_id: string
          revealed_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          order_id: string
          order_item_id: string
          revealed_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          order_id?: string
          order_item_id?: string
          revealed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_deliveries_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_lookup_attempts: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      order_status_events: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          eta_at: string | null
          coupon_code: string | null
          access_token_hash: string | null
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
          eta_at?: string | null
          coupon_code?: string | null
          access_token_hash?: string | null
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
          eta_at?: string | null
          coupon_code?: string | null
          access_token_hash?: string | null
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
      payment_proofs: {
        Row: {
          amount_minor: number
          created_at: string
          id: string
          order_id: string
          resubmit_requested: boolean
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          storage_path: string
          transaction_ref: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          id?: string
          order_id: string
          resubmit_requested?: boolean
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          storage_path: string
          transaction_ref: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          id?: string
          order_id?: string
          resubmit_requested?: boolean
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          storage_path?: string
          transaction_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          fonepay_enabled: boolean
          id: boolean
          instructions: string | null
          qr_image_path: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          fonepay_enabled?: boolean
          id?: boolean
          instructions?: string | null
          qr_image_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          fonepay_enabled?: boolean
          id?: boolean
          instructions?: string | null
          qr_image_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          duration_months: number | null
          account_type: string | null
          device_limit: number | null
          compare_at_minor: number | null
          sale_ends_at: string | null
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
          duration_months?: number | null
          account_type?: string | null
          device_limit?: number | null
          compare_at_minor?: number | null
          sale_ends_at?: string | null
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
          duration_months?: number | null
          account_type?: string | null
          device_limit?: number | null
          compare_at_minor?: number | null
          sale_ends_at?: string | null
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
          product_type: string
          delivery_channel: string
          activation_steps: Json
          warranty_days: number | null
          warranty_note: string | null
          system_requirements: string | null
          delivery_time_label: string | null
          region_locked: boolean
          refund_note: string | null
          collection: string | null
          pairs_with: string[]
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
          product_type?: string
          delivery_channel?: string
          activation_steps?: Json
          warranty_days?: number | null
          warranty_note?: string | null
          system_requirements?: string | null
          delivery_time_label?: string | null
          region_locked?: boolean
          refund_note?: string | null
          collection?: string | null
          pairs_with?: string[]
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
          product_type?: string
          delivery_channel?: string
          activation_steps?: Json
          warranty_days?: number | null
          warranty_note?: string | null
          system_requirements?: string | null
          delivery_time_label?: string | null
          region_locked?: boolean
          refund_note?: string | null
          collection?: string | null
          pairs_with?: string[]
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
          contact: string | null
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
          contact?: string | null
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
          contact?: string | null
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
        | "pending_payment"
        | "payment_submitted"
        | "verified"
        | "rejected"
        | "delivered"
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
        "pending_payment",
        "payment_submitted",
        "verified",
        "rejected",
        "delivered",
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
