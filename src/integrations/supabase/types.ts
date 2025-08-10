export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          created_by: string | null
          doctor_id: string | null
          doctor_name: string
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_email: string | null
          patient_name: string
          patient_phone: string
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          created_by?: string | null
          doctor_id?: string | null
          doctor_name: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_email?: string | null
          patient_name: string
          patient_phone: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          created_by?: string | null
          doctor_id?: string | null
          doctor_name?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_email?: string | null
          patient_name?: string
          patient_phone?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          created_by: string | null
          current_patients: number | null
          email: string | null
          id: string
          location: string
          max_patients: number | null
          name: string
          phone: string | null
          specialization: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_patients?: number | null
          email?: string | null
          id?: string
          location: string
          max_patients?: number | null
          name: string
          phone?: string | null
          specialization: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_patients?: number | null
          email?: string | null
          id?: string
          location?: string
          max_patients?: number | null
          name?: string
          phone?: string | null
          specialization?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      queue: {
        Row: {
          check_in_time: string | null
          created_at: string
          created_by: string | null
          doctor_id: string | null
          estimated_time_minutes: number | null
          id: string
          notes: string | null
          patient_name: string
          phone: string
          priority: boolean | null
          queue_number: number
          status: string | null
          updated_at: string
        }
        Insert: {
          check_in_time?: string | null
          created_at?: string
          created_by?: string | null
          doctor_id?: string | null
          estimated_time_minutes?: number | null
          id?: string
          notes?: string | null
          patient_name: string
          phone: string
          priority?: boolean | null
          queue_number: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          check_in_time?: string | null
          created_at?: string
          created_by?: string | null
          doctor_id?: string | null
          estimated_time_minutes?: number | null
          id?: string
          notes?: string | null
          patient_name?: string
          phone?: string
          priority?: boolean | null
          queue_number?: number
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
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
