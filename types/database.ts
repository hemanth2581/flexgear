export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string;
          role: 'CUSTOMER' | 'ADMIN';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          phone?: string | null;
          full_name: string;
          role?: 'CUSTOMER' | 'ADMIN';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          full_name?: string;
          role?: 'CUSTOMER' | 'ADMIN';
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          slug: string;
          name: string;
          icon: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          slug: string;
          name: string;
          icon?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          slug?: string;
          name?: string;
          icon?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      brands: {
        Row: {
          id: string;
          slug: string;
          name: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
        };
        Relationships: [];
      };
      equipment: {
        Row: {
          id: string;
          category_id: string;
          brand_id: string;
          slug: string;
          name: string;
          description: string;
          image_url: string;
          daily_price: number;
          weekly_price: number | null;
          security_deposit: number;
          rating: number;
          review_count: number;
          is_featured: boolean;
          is_active: boolean;
          specs: Json;
          included_accessories: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          brand_id: string;
          slug: string;
          name: string;
          description: string;
          image_url: string;
          daily_price: number;
          weekly_price?: number | null;
          security_deposit: number;
          rating?: number;
          review_count?: number;
          is_featured?: boolean;
          is_active?: boolean;
          specs?: Json;
          included_accessories?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          brand_id?: string;
          slug?: string;
          name?: string;
          description?: string;
          image_url?: string;
          daily_price?: number;
          weekly_price?: number | null;
          security_deposit?: number;
          rating?: number;
          review_count?: number;
          is_featured?: boolean;
          is_active?: boolean;
          specs?: Json;
          included_accessories?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      equipment_inventory: {
        Row: {
          id: string;
          equipment_id: string;
          serial_number: string;
          status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED';
        };
        Insert: {
          id?: string;
          equipment_id: string;
          serial_number: string;
          status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED';
        };
        Update: {
          id?: string;
          equipment_id?: string;
          serial_number?: string;
          status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED';
        };
        Relationships: [];
      };
      rental_orders: {
        Row: {
          id: string;
          rental_id: string;
          user_id: string;
          status: string;
          start_date: string;
          end_date: string;
          total_days: number;
          delivery_mode: string;
          address: Json;
          subtotal: number;
          discount: number;
          delivery_fee: number;
          tax: number;
          security_deposit: number;
          total: number;
          payment_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rental_id: string;
          user_id: string;
          status: string;
          start_date: string;
          end_date: string;
          total_days: number;
          delivery_mode: string;
          address: Json;
          subtotal: number;
          discount?: number;
          delivery_fee?: number;
          tax: number;
          security_deposit: number;
          total: number;
          payment_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          rental_id?: string;
          user_id?: string;
          status?: string;
          start_date?: string;
          end_date?: string;
          total_days?: number;
          delivery_mode?: string;
          address?: Json;
          subtotal?: number;
          discount?: number;
          delivery_fee?: number;
          tax?: number;
          security_deposit?: number;
          total?: number;
          payment_status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      rental_items: {
        Row: {
          id: string;
          rental_order_id: string;
          equipment_id: string;
          quantity: number;
          daily_price: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          rental_order_id: string;
          equipment_id: string;
          quantity: number;
          daily_price: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          rental_order_id?: string;
          equipment_id?: string;
          quantity?: number;
          daily_price?: number;
          subtotal?: number;
        };
        Relationships: [];
      };
      rental_dates: {
        Row: {
          id: string;
          rental_order_id: string;
          equipment_id: string;
          date: string;
          units_booked: number;
        };
        Insert: {
          id?: string;
          rental_order_id: string;
          equipment_id: string;
          date: string;
          units_booked: number;
        };
        Update: {
          id?: string;
          rental_order_id?: string;
          equipment_id?: string;
          date?: string;
          units_booked?: number;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          rental_order_id: string;
          provider: string;
          provider_payment_id: string;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rental_order_id: string;
          provider?: string;
          provider_payment_id: string;
          amount: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          rental_order_id?: string;
          provider?: string;
          provider_payment_id?: string;
          amount?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      security_deposits: {
        Row: {
          id: string;
          rental_order_id: string;
          amount: number;
          status: string;
          refunded_amount: number | null;
        };
        Insert: {
          id?: string;
          rental_order_id: string;
          amount: number;
          status?: string;
          refunded_amount?: number | null;
        };
        Update: {
          id?: string;
          rental_order_id?: string;
          amount?: number;
          status?: string;
          refunded_amount?: number | null;
        };
        Relationships: [];
      };
      otp_verifications: {
        Row: {
          id: string;
          phone: string;
          otp_hash: string;
          expires_at: string;
          attempts: number;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          otp_hash: string;
          expires_at: string;
          attempts?: number;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          otp_hash?: string;
          expires_at?: string;
          attempts?: number;
          verified?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          line1: string;
          city: string;
          state: string;
          pincode: string;
          lat: number | null;
          lng: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          line1: string;
          city: string;
          state: string;
          pincode: string;
          lat?: number | null;
          lng?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          line1?: string;
          city?: string;
          state?: string;
          pincode?: string;
          lat?: number | null;
          lng?: number | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          equipment_id: string;
          rental_order_id: string | null;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          equipment_id: string;
          rental_order_id?: string | null;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          equipment_id?: string;
          rental_order_id?: string | null;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          equipment_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          equipment_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          equipment_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_inquiries: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          city: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          city?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          city?: string | null;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      partner_applications: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          city: string | null;
          gear_details: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          city?: string | null;
          gear_details: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          city?: string | null;
          gear_details?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      kyc_verifications: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          phone: string | null;
          doc_type: string;
          doc_number: string;
          document_url: string | null;
          status: string;
          verified_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          phone?: string | null;
          doc_type: string;
          doc_number: string;
          document_url?: string | null;
          status?: string;
          verified_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          phone?: string | null;
          doc_type?: string;
          doc_number?: string;
          document_url?: string | null;
          status?: string;
          verified_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
