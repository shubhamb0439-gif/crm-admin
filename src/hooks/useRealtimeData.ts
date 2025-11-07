import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeData<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  table: string
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  useEffect(() => {
    const handleRealtimeUpdate = (event: CustomEvent) => {
      const { table: updatedTable } = event.detail;
      if (updatedTable === table) {
        queryClient.invalidateQueries({ queryKey });
      }
    };

    window.addEventListener('supabase_realtime_update', handleRealtimeUpdate as EventListener);

    return () => {
      window.removeEventListener('supabase_realtime_update', handleRealtimeUpdate as EventListener);
    };
  }, [queryClient, queryKey, table]);

  return query;
}

export function useLeads() {
  return useRealtimeData(
    ['leads'],
    async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    'leads'
  );
}

export function useLead(id: string) {
  return useRealtimeData(
    ['lead', id],
    async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    'leads'
  );
}

export function useLeadAssessment(email: string) {
  return useRealtimeData(
    ['assessment', email],
    async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    'assessments'
  );
}

export function useLeadBooking(email: string) {
  return useRealtimeData(
    ['booking', email],
    async () => {
      const { data, error } = await supabase
        .from('consultancy_bookings_v2')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    'consultancy_bookings_v2'
  );
}

export function useBookings() {
  return useRealtimeData(
    ['bookings'],
    async () => {
      const { data, error } = await supabase
        .from('consultancy_bookings_v2')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    'consultancy_bookings_v2'
  );
}

export function useServices() {
  return useRealtimeData(
    ['services'],
    async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
    'services'
  );
}
