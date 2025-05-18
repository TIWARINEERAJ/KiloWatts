export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auction_listings: {
        Row: {
          amount: string
          bids: number | null
          created_at: string
          current_bid: string
          distance: string
          ends_in: string
          green_certified: boolean | null
          id: string
          seller: string
          source: string
          starting_price: string
          updated_at: string
        }
        Insert: {
          amount: string
          bids?: number | null
          created_at?: string
          current_bid: string
          distance: string
          ends_in: string
          green_certified?: boolean | null
          id?: string
          seller: string
          source: string
          starting_price: string
          updated_at?: string
        }
        Update: {
          amount?: string
          bids?: number | null
          created_at?: string
          current_bid?: string
          distance?: string
          ends_in?: string
          green_certified?: boolean | null
          id?: string
          seller?: string
          source?: string
          starting_price?: string
          updated_at?: string
        }
        Relationships: []
      }
      auction_transactions: {
        Row: {
          blockchain_tx: string | null
          buyer_address: string
          created_at: string
          id: string
          price: number
          quantity: number
          seller_address: string
          status: string
          total_value: number
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          blockchain_tx?: string | null
          buyer_address: string
          created_at?: string
          id?: string
          price: number
          quantity: number
          seller_address: string
          status?: string
          total_value: number
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          blockchain_tx?: string | null
          buyer_address?: string
          created_at?: string
          id?: string
          price?: number
          quantity?: number
          seller_address?: string
          status?: string
          total_value?: number
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      billing: {
        Row: {
          consumption: string
          created_at: string
          due_date: string
          id: string
          issued: string
          net_amount: string
          period: string
          production: string
          status: string
          updated_at: string
        }
        Insert: {
          consumption: string
          created_at?: string
          due_date: string
          id: string
          issued: string
          net_amount: string
          period: string
          production: string
          status: string
          updated_at?: string
        }
        Update: {
          consumption?: string
          created_at?: string
          due_date?: string
          id?: string
          issued?: string
          net_amount?: string
          period?: string
          production?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      discom_monitoring: {
        Row: {
          active_contracts: number
          active_users: number
          alerts: string[] | null
          discom_id: string
          grid_load_percentage: number
          grid_stability_score: number
          id: string
          timestamp: string
          total_energy_traded: number
        }
        Insert: {
          active_contracts: number
          active_users: number
          alerts?: string[] | null
          discom_id: string
          grid_load_percentage: number
          grid_stability_score: number
          id?: string
          timestamp?: string
          total_energy_traded: number
        }
        Update: {
          active_contracts?: number
          active_users?: number
          alerts?: string[] | null
          discom_id?: string
          grid_load_percentage?: number
          grid_stability_score?: number
          id?: string
          timestamp?: string
          total_energy_traded?: number
        }
        Relationships: []
      }
      energy_forecasts: {
        Row: {
          amount: number
          confidence: number | null
          created_at: string
          date: string
          forecast_type: string
          hour: number
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          confidence?: number | null
          created_at?: string
          date: string
          forecast_type: string
          hour: number
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          confidence?: number | null
          created_at?: string
          date?: string
          forecast_type?: string
          hour?: number
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      energy_listings: {
        Row: {
          amount: string
          available: string
          created_at: string
          distance: string
          green_certified: boolean | null
          id: string
          listing_type: string
          price: string
          rating: number
          seller: string
          source: string
          updated_at: string
        }
        Insert: {
          amount: string
          available: string
          created_at?: string
          distance: string
          green_certified?: boolean | null
          id?: string
          listing_type?: string
          price: string
          rating: number
          seller: string
          source: string
          updated_at?: string
        }
        Update: {
          amount?: string
          available?: string
          created_at?: string
          distance?: string
          green_certified?: boolean | null
          id?: string
          listing_type?: string
          price?: string
          rating?: number
          seller?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      meter_readings: {
        Row: {
          blockchain_verification: string | null
          consumption: number
          created_at: string
          id: string
          meter_id: string
          production: number
          reading_timestamp: string
          user_id: string | null
          validated: boolean | null
        }
        Insert: {
          blockchain_verification?: string | null
          consumption: number
          created_at?: string
          id?: string
          meter_id: string
          production: number
          reading_timestamp: string
          user_id?: string | null
          validated?: boolean | null
        }
        Update: {
          blockchain_verification?: string | null
          consumption?: number
          created_at?: string
          id?: string
          meter_id?: string
          production?: number
          reading_timestamp?: string
          user_id?: string | null
          validated?: boolean | null
        }
        Relationships: []
      }
      smart_contracts: {
        Row: {
          blockchain_tx: string | null
          buyer_id: string | null
          contract_address: string
          created_at: string
          end_date: string
          energy_amount: string
          execution_condition: string | null
          id: string
          price_per_unit: string
          seller_id: string | null
          start_date: string
          status: string
          total_amount: string
          updated_at: string
        }
        Insert: {
          blockchain_tx?: string | null
          buyer_id?: string | null
          contract_address: string
          created_at?: string
          end_date: string
          energy_amount: string
          execution_condition?: string | null
          id?: string
          price_per_unit: string
          seller_id?: string | null
          start_date: string
          status?: string
          total_amount: string
          updated_at?: string
        }
        Update: {
          blockchain_tx?: string | null
          buyer_id?: string | null
          contract_address?: string
          created_at?: string
          end_date?: string
          energy_amount?: string
          execution_condition?: string | null
          id?: string
          price_per_unit?: string
          seller_id?: string | null
          start_date?: string
          status?: string
          total_amount?: string
          updated_at?: string
        }
        Relationships: []
      }
      time_of_day_listings: {
        Row: {
          amount: string
          available_from: string
          created_at: string
          distance: string
          green_certified: boolean | null
          id: string
          off_peak_hours: string
          off_peak_price: string
          peak_hours: string
          peak_price: string
          seller: string
          source: string
          standard_price: string
          updated_at: string
        }
        Insert: {
          amount: string
          available_from: string
          created_at?: string
          distance: string
          green_certified?: boolean | null
          id?: string
          off_peak_hours: string
          off_peak_price: string
          peak_hours: string
          peak_price: string
          seller: string
          source: string
          standard_price: string
          updated_at?: string
        }
        Update: {
          amount?: string
          available_from?: string
          created_at?: string
          distance?: string
          green_certified?: boolean | null
          id?: string
          off_peak_hours?: string
          off_peak_price?: string
          peak_hours?: string
          peak_price?: string
          seller?: string
          source?: string
          standard_price?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: string
          blockchain_tx: string
          counterparty: string
          created_at: string
          date: string
          id: string
          rate: string
          status: string
          time: string
          total: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: string
          blockchain_tx: string
          counterparty: string
          created_at?: string
          date: string
          id: string
          rate: string
          status: string
          time: string
          total: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: string
          blockchain_tx?: string
          counterparty?: string
          created_at?: string
          date?: string
          id?: string
          rate?: string
          status?: string
          time?: string
          total?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string
          discom_id: string | null
          display_name: string | null
          id: string
          meter_id: string | null
          updated_at: string
          user_role: string
          username: string
          wallet_address: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          discom_id?: string | null
          display_name?: string | null
          id: string
          meter_id?: string | null
          updated_at?: string
          user_role?: string
          username: string
          wallet_address?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          discom_id?: string | null
          display_name?: string | null
          id?: string
          meter_id?: string | null
          updated_at?: string
          user_role?: string
          username?: string
          wallet_address?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
