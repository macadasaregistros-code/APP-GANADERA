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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      animals: {
        Row: {
          approx_age_months: number | null
          body_condition_score: number | null
          breed_type: string
          created_at: string
          current_weight_kg: number
          ear_tag: string
          entry_weight_kg: number
          farm_id: string
          health_observations: string | null
          id: string
          internal_code: string
          lot_id: string
          photo_url: string | null
          purchase_date: string
          purchase_price: number
          purchase_price_per_kg: number | null
          sex: Database["public"]["Enums"]["animal_sex"]
          source_text: string
          status: Database["public"]["Enums"]["animal_status"]
          supplier_text: string | null
          updated_at: string
        }
        Insert: {
          approx_age_months?: number | null
          body_condition_score?: number | null
          breed_type: string
          created_at?: string
          current_weight_kg: number
          ear_tag: string
          entry_weight_kg: number
          farm_id: string
          health_observations?: string | null
          id?: string
          internal_code: string
          lot_id: string
          photo_url?: string | null
          purchase_date: string
          purchase_price: number
          purchase_price_per_kg?: number | null
          sex?: Database["public"]["Enums"]["animal_sex"]
          source_text: string
          status?: Database["public"]["Enums"]["animal_status"]
          supplier_text?: string | null
          updated_at?: string
        }
        Update: {
          approx_age_months?: number | null
          body_condition_score?: number | null
          breed_type?: string
          created_at?: string
          current_weight_kg?: number
          ear_tag?: string
          entry_weight_kg?: number
          farm_id?: string
          health_observations?: string | null
          id?: string
          internal_code?: string
          lot_id?: string
          photo_url?: string | null
          purchase_date?: string
          purchase_price?: number
          purchase_price_per_kg?: number | null
          sex?: Database["public"]["Enums"]["animal_sex"]
          source_text?: string
          status?: Database["public"]["Enums"]["animal_status"]
          supplier_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "animals_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_records: {
        Row: {
          allocation_method: string
          amount: number
          animal_id: string | null
          category: string
          cost_date: string
          created_at: string
          created_by: string | null
          description: string
          farm_id: string
          id: string
          lot_id: string | null
          notes: string | null
          pasture_id: string | null
          source_id: string | null
          source_type: string | null
          updated_at: string
        }
        Insert: {
          allocation_method?: string
          amount: number
          animal_id?: string | null
          category: string
          cost_date: string
          created_at?: string
          created_by?: string | null
          description: string
          farm_id: string
          id?: string
          lot_id?: string | null
          notes?: string | null
          pasture_id?: string | null
          source_id?: string | null
          source_type?: string | null
          updated_at?: string
        }
        Update: {
          allocation_method?: string
          amount?: number
          animal_id?: string | null
          category?: string
          cost_date?: string
          created_at?: string
          created_by?: string | null
          description?: string
          farm_id?: string
          id?: string
          lot_id?: string | null
          notes?: string | null
          pasture_id?: string | null
          source_id?: string | null
          source_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animal_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "cost_records_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_pasture_id_fkey"
            columns: ["pasture_id"]
            isOneToOne: false
            referencedRelation: "pastures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_records_pasture_id_fkey"
            columns: ["pasture_id"]
            isOneToOne: false
            referencedRelation: "v_pasture_status"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_members: {
        Row: {
          created_at: string
          farm_id: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["farm_member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          farm_id: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["farm_member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          farm_id?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["farm_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_members_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_members_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "farm_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string
          department: string | null
          id: string
          is_active: boolean
          municipality: string | null
          name: string
          notes: string | null
          owner_id: string
          productive_area_ha: number | null
          total_area_ha: number | null
          updated_at: string
          vereda: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          municipality?: string | null
          name: string
          notes?: string | null
          owner_id: string
          productive_area_ha?: number | null
          total_area_ha?: number | null
          updated_at?: string
          vereda?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          municipality?: string | null
          name?: string
          notes?: string | null
          owner_id?: string
          productive_area_ha?: number | null
          total_area_ha?: number | null
          updated_at?: string
          vereda?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_items: {
        Row: {
          created_at: string
          default_cost_per_unit: number
          farm_id: string
          feed_type: Database["public"]["Enums"]["feed_type"]
          id: string
          is_active: boolean
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_cost_per_unit?: number
          farm_id: string
          feed_type: Database["public"]["Enums"]["feed_type"]
          id?: string
          is_active?: boolean
          name: string
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_cost_per_unit?: number
          farm_id?: string
          feed_type?: Database["public"]["Enums"]["feed_type"]
          id?: string
          is_active?: boolean
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_items_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_items_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
        ]
      }
      health_events: {
        Row: {
          animal_id: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          diagnosis: string | null
          dose: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["health_event_type"]
          farm_id: string
          id: string
          lot_id: string | null
          notes: string | null
          product_name: string | null
          unit: string | null
          updated_at: string
          withdrawal_until: string | null
        }
        Insert: {
          animal_id?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          dose?: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["health_event_type"]
          farm_id: string
          id?: string
          lot_id?: string | null
          notes?: string | null
          product_name?: string | null
          unit?: string | null
          updated_at?: string
          withdrawal_until?: string | null
        }
        Update: {
          animal_id?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          dose?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["health_event_type"]
          farm_id?: string
          id?: string
          lot_id?: string | null
          notes?: string | null
          product_name?: string | null
          unit?: string | null
          updated_at?: string
          withdrawal_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animal_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "health_events_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      lots: {
        Row: {
          code: string | null
          created_at: string
          entry_date: string | null
          farm_id: string
          id: string
          name: string
          notes: string | null
          status: string
          target_sale_weight_kg: number | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          entry_date?: string | null
          farm_id: string
          id?: string
          name: string
          notes?: string | null
          status?: string
          target_sale_weight_kg?: number | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          entry_date?: string | null
          farm_id?: string
          id?: string
          name?: string
          notes?: string | null
          status?: string
          target_sale_weight_kg?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
        ]
      }
      pasture_events: {
        Row: {
          cost_amount: number | null
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["pasture_event_type"]
          farm_id: string
          id: string
          pasture_id: string
          title: string
          updated_at: string
        }
        Insert: {
          cost_amount?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["pasture_event_type"]
          farm_id: string
          id?: string
          pasture_id: string
          title: string
          updated_at?: string
        }
        Update: {
          cost_amount?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["pasture_event_type"]
          farm_id?: string
          id?: string
          pasture_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pasture_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "pasture_events_pasture_id_fkey"
            columns: ["pasture_id"]
            isOneToOne: false
            referencedRelation: "pastures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_events_pasture_id_fkey"
            columns: ["pasture_id"]
            isOneToOne: false
            referencedRelation: "v_pasture_status"
            referencedColumns: ["id"]
          },
        ]
      }
      pasture_rotations: {
        Row: {
          animal_count: number
          created_at: string
          entry_date: string
          exit_date: string | null
          farm_id: string
          id: string
          lot_id: string
          max_grazing_days_snapshot: number
          notes: string | null
          occupation_days: number | null
          pasture_condition_entry: string | null
          pasture_condition_exit: string | null
          pasture_id: string
          planned_exit_date: string | null
          recovery_days_required_snapshot: number
          updated_at: string
        }
        Insert: {
          animal_count: number
          created_at?: string
          entry_date: string
          exit_date?: string | null
          farm_id: string
          id?: string
          lot_id: string
          max_grazing_days_snapshot: number
          notes?: string | null
          occupation_days?: number | null
          pasture_condition_entry?: string | null
          pasture_condition_exit?: string | null
          pasture_id: string
          planned_exit_date?: string | null
          recovery_days_required_snapshot: number
          updated_at?: string
        }
        Update: {
          animal_count?: number
          created_at?: string
          entry_date?: string
          exit_date?: string | null
          farm_id?: string
          id?: string
          lot_id?: string
          max_grazing_days_snapshot?: number
          notes?: string | null
          occupation_days?: number | null
          pasture_condition_entry?: string | null
          pasture_condition_exit?: string | null
          pasture_id?: string
          planned_exit_date?: string | null
          recovery_days_required_snapshot?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pasture_rotations_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_rotations_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "pasture_rotations_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_rotations_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_rotations_pasture_id_fkey"
            columns: ["pasture_id"]
            isOneToOne: false
            referencedRelation: "pastures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_rotations_pasture_id_fkey"
            columns: ["pasture_id"]
            isOneToOne: false
            referencedRelation: "v_pasture_status"
            referencedColumns: ["id"]
          },
        ]
      }
      pastures: {
        Row: {
          area_ha: number
          carrying_capacity_animals: number | null
          created_at: string
          farm_id: string
          grass_type: string | null
          id: string
          is_active: boolean
          max_grazing_days: number
          name: string
          notes: string | null
          recovery_days_required: number
          status: Database["public"]["Enums"]["pasture_manual_status"]
          updated_at: string
          water_available: boolean
        }
        Insert: {
          area_ha: number
          carrying_capacity_animals?: number | null
          created_at?: string
          farm_id: string
          grass_type?: string | null
          id?: string
          is_active?: boolean
          max_grazing_days?: number
          name: string
          notes?: string | null
          recovery_days_required?: number
          status?: Database["public"]["Enums"]["pasture_manual_status"]
          updated_at?: string
          water_available?: boolean
        }
        Update: {
          area_ha?: number
          carrying_capacity_animals?: number | null
          created_at?: string
          farm_id?: string
          grass_type?: string | null
          id?: string
          is_active?: boolean
          max_grazing_days?: number
          name?: string
          notes?: string | null
          recovery_days_required?: number
          status?: Database["public"]["Enums"]["pasture_manual_status"]
          updated_at?: string
          water_available?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pastures_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastures_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role_global: Database["public"]["Enums"]["farm_member_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          role_global?: Database["public"]["Enums"]["farm_member_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role_global?: Database["public"]["Enums"]["farm_member_role"]
          updated_at?: string
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          allocated_cost: number
          animal_id: string
          created_at: string
          days_in_ceba: number
          exit_weight_kg: number
          farm_id: string
          gross_amount: number
          gross_profit: number
          id: string
          lot_id: string
          net_profit: number
          price_per_kg: number
          purchase_cost: number
          roi: number
          sale_id: string
        }
        Insert: {
          allocated_cost?: number
          animal_id: string
          created_at?: string
          days_in_ceba?: number
          exit_weight_kg: number
          farm_id: string
          gross_amount: number
          gross_profit?: number
          id?: string
          lot_id: string
          net_profit?: number
          price_per_kg: number
          purchase_cost?: number
          roi?: number
          sale_id: string
        }
        Update: {
          allocated_cost?: number
          animal_id?: string
          created_at?: string
          days_in_ceba?: number
          exit_weight_kg?: number
          farm_id?: string
          gross_amount?: number
          gross_profit?: number
          id?: string
          lot_id?: string
          net_profit?: number
          price_per_kg?: number
          purchase_cost?: number
          roi?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: true
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: true
            referencedRelation: "v_animal_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "sale_items_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          buyer_text: string
          created_at: string
          extra_costs: number
          farm_id: string
          gross_amount: number
          id: string
          net_amount: number
          notes: string | null
          price_per_kg: number
          sale_date: string
          sale_type: Database["public"]["Enums"]["sale_type"]
          total_weight_kg: number
          updated_at: string
        }
        Insert: {
          buyer_text: string
          created_at?: string
          extra_costs?: number
          farm_id: string
          gross_amount: number
          id?: string
          net_amount: number
          notes?: string | null
          price_per_kg: number
          sale_date: string
          sale_type: Database["public"]["Enums"]["sale_type"]
          total_weight_kg: number
          updated_at?: string
        }
        Update: {
          buyer_text?: string
          created_at?: string
          extra_costs?: number
          farm_id?: string
          gross_amount?: number
          id?: string
          net_amount?: number
          notes?: string | null
          price_per_kg?: number
          sale_date?: string
          sale_type?: Database["public"]["Enums"]["sale_type"]
          total_weight_kg?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
        ]
      }
      supplementation_records: {
        Row: {
          animal_count: number
          cost_per_animal: number | null
          created_at: string
          end_date: string
          farm_id: string
          feed_item_id: string
          id: string
          lot_id: string
          notes: string | null
          quantity: number
          start_date: string
          total_cost: number
          unit: string
          updated_at: string
        }
        Insert: {
          animal_count: number
          cost_per_animal?: number | null
          created_at?: string
          end_date: string
          farm_id: string
          feed_item_id: string
          id?: string
          lot_id: string
          notes?: string | null
          quantity: number
          start_date: string
          total_cost: number
          unit?: string
          updated_at?: string
        }
        Update: {
          animal_count?: number
          cost_per_animal?: number | null
          created_at?: string
          end_date?: string
          farm_id?: string
          feed_item_id?: string
          id?: string
          lot_id?: string
          notes?: string | null
          quantity?: number
          start_date?: string
          total_cost?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplementation_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplementation_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "supplementation_records_feed_item_id_fkey"
            columns: ["feed_item_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplementation_records_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplementation_records_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_records: {
        Row: {
          animal_id: string
          created_at: string
          created_by: string | null
          daily_gain_kg: number | null
          days_in_ceba: number
          days_since_last_weight: number | null
          farm_id: string
          id: string
          lot_id: string
          notes: string | null
          previous_weight_kg: number | null
          weighed_at: string
          weight_kg: number
        }
        Insert: {
          animal_id: string
          created_at?: string
          created_by?: string | null
          daily_gain_kg?: number | null
          days_in_ceba?: number
          days_since_last_weight?: number | null
          farm_id: string
          id?: string
          lot_id: string
          notes?: string | null
          previous_weight_kg?: number | null
          weighed_at: string
          weight_kg: number
        }
        Update: {
          animal_id?: string
          created_at?: string
          created_by?: string | null
          daily_gain_kg?: number | null
          days_in_ceba?: number
          days_since_last_weight?: number | null
          farm_id?: string
          id?: string
          lot_id?: string
          notes?: string | null
          previous_weight_kg?: number | null
          weighed_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animal_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "weight_records_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_records_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_animal_performance: {
        Row: {
          accumulated_daily_gain_kg: number | null
          allocated_cost: number | null
          cost_per_kg_gained: number | null
          current_weight_kg: number | null
          days_in_ceba: number | null
          ear_tag: string | null
          entry_weight_kg: number | null
          farm_id: string | null
          id: string | null
          internal_code: string | null
          kg_gained: number | null
          latest_weight_date: string | null
          lot_id: string | null
          recent_daily_gain_kg: number | null
          status: Database["public"]["Enums"]["animal_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
          {
            foreignKeyName: "animals_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      v_farm_dashboard: {
        Row: {
          avg_daily_gain_kg: number | null
          cost_per_kg_produced: number | null
          estimated_margin: number | null
          farm_id: string | null
          farm_name: string | null
          mortality_count: number | null
          occupied_pastures: number | null
          ready_for_sale_animals: number | null
          sanitary_alerts: number | null
          underperforming_animals: number | null
        }
        Relationships: []
      }
      v_lot_performance: {
        Row: {
          active_animals: number | null
          avg_current_weight_kg: number | null
          avg_daily_gain_kg: number | null
          avg_entry_weight_kg: number | null
          code: string | null
          cost_per_kg_produced: number | null
          estimated_margin: number | null
          farm_id: string | null
          id: string | null
          name: string | null
          total_cost: number | null
          total_kg_gained: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
        ]
      }
      v_pasture_status: {
        Row: {
          active_rotation_id: string | null
          area_ha: number | null
          carrying_capacity_animals: number | null
          current_animal_count: number | null
          current_entry_date: string | null
          current_lot_id: string | null
          days_occupied: number | null
          days_resting: number | null
          days_until_ready: number | null
          farm_id: string | null
          grass_type: string | null
          id: string | null
          last_event_date: string | null
          last_event_title: string | null
          last_event_type:
            | Database["public"]["Enums"]["pasture_event_type"]
            | null
          last_exit_date: string | null
          last_rotation_id: string | null
          manual_status:
            | Database["public"]["Enums"]["pasture_manual_status"]
            | null
          max_grazing_days: number | null
          name: string | null
          pasture_event_cost: number | null
          pasture_status: string | null
          planned_exit_date: string | null
          recovery_days_required: number | null
          recovery_days_required_snapshot: number | null
          status_color: string | null
          water_available: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pasture_rotations_lot_id_fkey"
            columns: ["current_lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasture_rotations_lot_id_fkey"
            columns: ["current_lot_id"]
            isOneToOne: false
            referencedRelation: "v_lot_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastures_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastures_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "v_farm_dashboard"
            referencedColumns: ["farm_id"]
          },
        ]
      }
    }
    Functions: {
      current_farm_role: {
        Args: { target_farm_id: string }
        Returns: Database["public"]["Enums"]["farm_member_role"]
      }
      is_farm_member: { Args: { target_farm_id: string }; Returns: boolean }
    }
    Enums: {
      animal_sex: "macho" | "hembra"
      animal_status:
        | "active"
        | "ready_for_sale"
        | "underperforming"
        | "sick"
        | "sold"
        | "dead"
      farm_member_role: "owner" | "worker"
      feed_type:
        | "sal_mineralizada"
        | "melaza"
        | "silo"
        | "heno"
        | "concentrado"
        | "subproducto"
        | "otro"
      health_event_type:
        | "aftosa"
        | "carbon"
        | "rabia"
        | "desparasitacion"
        | "bano_garrapaticida"
        | "vitaminas"
        | "tratamiento"
        | "enfermedad"
        | "mortalidad"
        | "retiro_sanitario"
      pasture_event_type:
        | "guadana"
        | "mantenimiento_cercas"
        | "siembra_pasto"
        | "fertilizacion"
        | "enmienda"
        | "control_malezas"
        | "reparacion_agua"
        | "limpieza"
        | "observacion"
        | "otro"
      pasture_manual_status: "active" | "maintenance"
      sale_type: "individual" | "lot"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      animal_sex: ["macho", "hembra"],
      animal_status: [
        "active",
        "ready_for_sale",
        "underperforming",
        "sick",
        "sold",
        "dead",
      ],
      farm_member_role: ["owner", "worker"],
      feed_type: [
        "sal_mineralizada",
        "melaza",
        "silo",
        "heno",
        "concentrado",
        "subproducto",
        "otro",
      ],
      health_event_type: [
        "aftosa",
        "carbon",
        "rabia",
        "desparasitacion",
        "bano_garrapaticida",
        "vitaminas",
        "tratamiento",
        "enfermedad",
        "mortalidad",
        "retiro_sanitario",
      ],
      pasture_event_type: [
        "guadana",
        "mantenimiento_cercas",
        "siembra_pasto",
        "fertilizacion",
        "enmienda",
        "control_malezas",
        "reparacion_agua",
        "limpieza",
        "observacion",
        "otro",
      ],
      pasture_manual_status: ["active", "maintenance"],
      sale_type: ["individual", "lot"],
    },
  },
} as const
