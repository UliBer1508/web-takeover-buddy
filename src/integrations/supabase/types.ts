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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      booking_inquiries: {
        Row: {
          bed_linen_fee: number | null
          check_in: string
          check_out: string
          cleaning_fee: number | null
          created_at: string | null
          discount_amount: number | null
          guest_email: string
          guest_name: string
          guest_phone: string
          house_id: string
          id: string
          message: string | null
          nights: number | null
          number_of_children: number
          number_of_guests: number
          price_per_night: number | null
          promotion_id: string | null
          service_fee: number | null
          status_id: string
          total_price: number | null
          tourist_tax_total: number | null
          updated_at: string | null
        }
        Insert: {
          bed_linen_fee?: number | null
          check_in: string
          check_out: string
          cleaning_fee?: number | null
          created_at?: string | null
          discount_amount?: number | null
          guest_email: string
          guest_name: string
          guest_phone: string
          house_id: string
          id?: string
          message?: string | null
          nights?: number | null
          number_of_children?: number
          number_of_guests: number
          price_per_night?: number | null
          promotion_id?: string | null
          service_fee?: number | null
          status_id: string
          total_price?: number | null
          tourist_tax_total?: number | null
          updated_at?: string | null
        }
        Update: {
          bed_linen_fee?: number | null
          check_in?: string
          check_out?: string
          cleaning_fee?: number | null
          created_at?: string | null
          discount_amount?: number | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          house_id?: string
          id?: string
          message?: string | null
          nights?: number | null
          number_of_children?: number
          number_of_guests?: number
          price_per_night?: number | null
          promotion_id?: string | null
          service_fee?: number | null
          status_id?: string
          total_price?: number | null
          tourist_tax_total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_inquiries_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_booking_house"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_booking_status"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "booking_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_statuses: {
        Row: {
          display_name: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          display_name: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          display_name?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          display_name: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category_id: string | null
          created_at: string
          house_id: string | null
          id: string
          is_hero: boolean
          season_id: string
          sort_order: number
          title: string
          title_en: string | null
          url: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          house_id?: string | null
          id?: string
          is_hero?: boolean
          season_id: string
          sort_order?: number
          title: string
          title_en?: string | null
          url: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          house_id?: string | null
          id?: string
          is_hero?: boolean
          season_id?: string
          sort_order?: number
          title?: string
          title_en?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_gallery_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_gallery_season"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          bed_linen_fee: number | null
          check_in_time: string | null
          check_out_time: string | null
          cleaning_fee: number | null
          created_at: string
          description: string | null
          external_house_id: string | null
          id: string
          is_active: boolean | null
          max_guests: number
          min_nights: number | null
          name: string
          price_offseason: number | null
          price_summer: number | null
          price_winter: number | null
          service_fee: number | null
          short_description: string | null
          slug: string | null
          sort_order: number | null
          tourist_tax: number | null
        }
        Insert: {
          bed_linen_fee?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          cleaning_fee?: number | null
          created_at?: string
          description?: string | null
          external_house_id?: string | null
          id?: string
          is_active?: boolean | null
          max_guests?: number
          min_nights?: number | null
          name: string
          price_offseason?: number | null
          price_summer?: number | null
          price_winter?: number | null
          service_fee?: number | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number | null
          tourist_tax?: number | null
        }
        Update: {
          bed_linen_fee?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          cleaning_fee?: number | null
          created_at?: string
          description?: string | null
          external_house_id?: string | null
          id?: string
          is_active?: boolean | null
          max_guests?: number
          min_nights?: number | null
          name?: string
          price_offseason?: number | null
          price_summer?: number | null
          price_winter?: number | null
          service_fee?: number | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number | null
          tourist_tax?: number | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          booking_end: string | null
          booking_start: string | null
          created_at: string | null
          description_de: string
          description_en: string | null
          discount_type: string
          discount_value: number
          house_id: string | null
          id: string
          is_active: boolean | null
          min_nights: number | null
          name: string
          sort_order: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          booking_end?: string | null
          booking_start?: string | null
          created_at?: string | null
          description_de: string
          description_en?: string | null
          discount_type: string
          discount_value: number
          house_id?: string | null
          id?: string
          is_active?: boolean | null
          min_nights?: number | null
          name: string
          sort_order?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          booking_end?: string | null
          booking_start?: string | null
          created_at?: string | null
          description_de?: string
          description_en?: string | null
          discount_type?: string
          discount_value?: number
          house_id?: string | null
          id?: string
          is_active?: boolean | null
          min_nights?: number | null
          name?: string
          sort_order?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          guest_name: string
          house_id: string | null
          id: string
          is_visible: boolean | null
          rating: number
          review_date: string
          sort_order: number | null
          text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guest_name: string
          house_id?: string | null
          id?: string
          is_visible?: boolean | null
          rating: number
          review_date: string
          sort_order?: number | null
          text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guest_name?: string
          house_id?: string | null
          id?: string
          is_visible?: boolean | null
          rating?: number
          review_date?: string
          sort_order?: number | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          display_name: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          display_name: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          display_name?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
