export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      farms: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          department: string | null;
          municipality: string | null;
          vereda: string | null;
          total_area_ha: number | null;
          productive_area_ha: number | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          department?: string | null;
          municipality?: string | null;
          vereda?: string | null;
          total_area_ha?: number | null;
          productive_area_ha?: number | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          department?: string | null;
          municipality?: string | null;
          vereda?: string | null;
          total_area_ha?: number | null;
          productive_area_ha?: number | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      lots: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          code: string | null;
          entry_date: string | null;
          target_sale_weight_kg: number | null;
          status: "active" | "sold" | "closed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name: string;
          code?: string | null;
          entry_date?: string | null;
          target_sale_weight_kg?: number | null;
          status?: "active" | "sold" | "closed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name?: string;
          code?: string | null;
          entry_date?: string | null;
          target_sale_weight_kg?: number | null;
          status?: "active" | "sold" | "closed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pastures: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          area_ha: number;
          grass_type: string | null;
          carrying_capacity_animals: number | null;
          max_grazing_days: number;
          recovery_days_required: number;
          water_available: boolean;
          status: Database["public"]["Enums"]["pasture_manual_status"];
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name: string;
          area_ha: number;
          grass_type?: string | null;
          carrying_capacity_animals?: number | null;
          max_grazing_days?: number;
          recovery_days_required?: number;
          water_available?: boolean;
          status?: Database["public"]["Enums"]["pasture_manual_status"];
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name?: string;
          area_ha?: number;
          grass_type?: string | null;
          carrying_capacity_animals?: number | null;
          max_grazing_days?: number;
          recovery_days_required?: number;
          water_available?: boolean;
          status?: Database["public"]["Enums"]["pasture_manual_status"];
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      pasture_rotations: {
        Row: {
          id: string;
          farm_id: string;
          pasture_id: string;
          lot_id: string;
          entry_date: string;
          planned_exit_date: string | null;
          exit_date: string | null;
          animal_count: number;
          occupation_days: number | null;
          max_grazing_days_snapshot: number;
          recovery_days_required_snapshot: number;
          pasture_condition_entry: string | null;
          pasture_condition_exit: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          pasture_id: string;
          lot_id: string;
          entry_date: string;
          planned_exit_date?: string | null;
          exit_date?: string | null;
          animal_count: number;
          occupation_days?: number | null;
          max_grazing_days_snapshot?: number;
          recovery_days_required_snapshot?: number;
          pasture_condition_entry?: string | null;
          pasture_condition_exit?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          pasture_id?: string;
          lot_id?: string;
          entry_date?: string;
          planned_exit_date?: string | null;
          exit_date?: string | null;
          animal_count?: number;
          occupation_days?: number | null;
          max_grazing_days_snapshot?: number;
          recovery_days_required_snapshot?: number;
          pasture_condition_entry?: string | null;
          pasture_condition_exit?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pasture_events: {
        Row: {
          id: string;
          farm_id: string;
          pasture_id: string;
          event_date: string;
          event_type: Database["public"]["Enums"]["pasture_event_type"];
          title: string;
          description: string | null;
          cost_amount: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          pasture_id: string;
          event_date: string;
          event_type: Database["public"]["Enums"]["pasture_event_type"];
          title: string;
          description?: string | null;
          cost_amount?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          pasture_id?: string;
          event_date?: string;
          event_type?: Database["public"]["Enums"]["pasture_event_type"];
          title?: string;
          description?: string | null;
          cost_amount?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cost_records: {
        Row: {
          id: string;
          farm_id: string;
          lot_id: string | null;
          animal_id: string | null;
          pasture_id: string | null;
          cost_date: string;
          category: string;
          description: string;
          amount: number;
          allocation_method: "animal" | "lote" | "potrero" | "finca";
          source_type: string | null;
          source_id: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          lot_id?: string | null;
          animal_id?: string | null;
          pasture_id?: string | null;
          cost_date: string;
          category: string;
          description: string;
          amount: number;
          allocation_method?: "animal" | "lote" | "potrero" | "finca";
          source_type?: string | null;
          source_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          lot_id?: string | null;
          animal_id?: string | null;
          pasture_id?: string | null;
          cost_date?: string;
          category?: string;
          description?: string;
          amount?: number;
          allocation_method?: "animal" | "lote" | "potrero" | "finca";
          source_type?: string | null;
          source_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      v_pasture_status: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          area_ha: number;
          grass_type: string | null;
          carrying_capacity_animals: number | null;
          max_grazing_days: number;
          recovery_days_required: number;
          water_available: boolean;
          manual_status: Database["public"]["Enums"]["pasture_manual_status"];
          active_rotation_id: string | null;
          current_lot_id: string | null;
          current_entry_date: string | null;
          planned_exit_date: string | null;
          current_animal_count: number | null;
          last_rotation_id: string | null;
          last_exit_date: string | null;
          recovery_days_required_snapshot: number | null;
          days_occupied: number;
          days_resting: number;
          days_until_ready: number;
          pasture_status: "occupied" | "overdue" | "resting" | "ready" | "maintenance";
          status_color: "red" | "blue" | "yellow" | "green" | "orange";
          last_event_date: string | null;
          last_event_type: Database["public"]["Enums"]["pasture_event_type"] | null;
          last_event_title: string | null;
          pasture_event_cost: number;
        };
      };
    };
    Functions: {
      current_farm_role: {
        Args: { target_farm_id: string };
        Returns: Database["public"]["Enums"]["farm_member_role"] | null;
      };
      is_farm_member: {
        Args: { target_farm_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      farm_member_role: "owner" | "worker";
      pasture_manual_status: "active" | "maintenance";
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
        | "otro";
    };
    CompositeTypes: Record<string, never>;
  };
};
