import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for client-side operations
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Service role client for admin operations
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database types
export interface Partner {
  id: string;
  email: string;
  company_name: string;
  api_tier: 'free' | 'pro' | 'enterprise';
  api_key: string | null;
  created_at: string;
  approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  website?: string;
  description?: string;
}

export interface ApiUsage {
  id: string;
  partner_id: string;
  endpoint: string;
  requests_count: number;
  date: string;
}

export interface ApiKey {
  id: string;
  partner_id: string;
  key: string;
  name: string;
  created_at: string;
  last_used_at?: string;
  active: boolean;
}
