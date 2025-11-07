import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          facility: string;
          state: string;
          source: string;
          score: number | null;
          efficiency_level: string | null;
          product_service: string;
          status: string;
          closed_reason: string | null;
          comments: string | null;
          value_per_annum: number | null;
          notes: string | null;
          selected_services: string[] | null;
          created_at: string;
          updated_at: string;
          added_by: string | null;
          added_by_email: string | null;
          country: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          facility: string;
          state: string;
          source: string;
          score?: number | null;
          efficiency_level?: string | null;
          product_service: string;
          status?: string;
          closed_reason?: string | null;
          comments?: string | null;
          value_per_annum?: number | null;
          notes?: string | null;
          selected_services?: string[] | null;
          created_at?: string;
          updated_at?: string;
          added_by?: string | null;
          added_by_email?: string | null;
          country?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          facility?: string;
          state?: string;
          source?: string;
          score?: number | null;
          efficiency_level?: string | null;
          product_service?: string;
          status?: string;
          closed_reason?: string | null;
          comments?: string | null;
          value_per_annum?: number | null;
          notes?: string | null;
          selected_services?: string[] | null;
          created_at?: string;
          updated_at?: string;
          added_by?: string | null;
          added_by_email?: string | null;
          country?: string | null;
        };
      };
      consultancy_bookings_v2: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          country: string;
          state: string;
          city: string;
          facility: string;
          website: string | null;
          product_service: string;
          reason: string;
          preferred_date: string;
          preferred_time: string;
          timezone: string;
          timezone_value: string;
          ist_time: string | null;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          meeting_link: string | null;
          meeting_created_at: string | null;
          consultant_email: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          country: string;
          state: string;
          city: string;
          facility: string;
          website?: string | null;
          product_service: string;
          reason: string;
          preferred_date: string;
          preferred_time: string;
          timezone: string;
          timezone_value: string;
          ist_time?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          meeting_link?: string | null;
          meeting_created_at?: string | null;
          consultant_email?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          country?: string;
          state?: string;
          city?: string;
          facility?: string;
          website?: string | null;
          product_service?: string;
          reason?: string;
          preferred_date?: string;
          preferred_time?: string;
          timezone?: string;
          timezone_value?: string;
          ist_time?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          meeting_link?: string | null;
          meeting_created_at?: string | null;
          consultant_email?: string | null;
        };
      };
      assessments: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          facility: string;
          country: string | null;
          state: string;
          specialties: string[] | null;
          score: number;
          time_taken: number;
          efficiency_level: string;
          product_service: string;
          selected_challenges: string[] | null;
          recommended_services: string[] | null;
          comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          facility: string;
          country?: string | null;
          state: string;
          specialties?: string[] | null;
          score: number;
          time_taken: number;
          efficiency_level: string;
          product_service: string;
          selected_challenges?: string[] | null;
          recommended_services?: string[] | null;
          comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          facility?: string;
          country?: string | null;
          state?: string;
          specialties?: string[] | null;
          score?: number;
          time_taken?: number;
          efficiency_level?: string;
          product_service?: string;
          selected_challenges?: string[] | null;
          recommended_services?: string[] | null;
          comments?: string | null;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          is_visible: boolean;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          is_visible?: boolean;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          is_visible?: boolean;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
    };
  };
};
