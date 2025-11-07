import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private keepaliveInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.setupChannels();
    this.startKeepalive();
    this.setupConnectionHandlers();
  }

  private setupChannels() {
    const tables = ['leads', 'consultancy_bookings_v2', 'assessments', 'services'];

    tables.forEach((table) => {
      const channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
          },
          (payload) => {
            window.dispatchEvent(
              new CustomEvent('supabase_realtime_update', {
                detail: { table, payload },
              })
            );
          }
        )
        .subscribe((status) => {
          console.log(`[RealtimeManager] ${table} subscription status:`, status);

          if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            console.warn(`[RealtimeManager] ${table} channel error, attempting reconnect...`);
            setTimeout(() => this.reconnectChannel(table), 2000);
          }
        });

      this.channels.set(table, channel);
    });
  }

  private reconnectChannel(table: string) {
    const existingChannel = this.channels.get(table);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channel = supabase
      .channel(`${table}_changes_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          window.dispatchEvent(
            new CustomEvent('supabase_realtime_update', {
              detail: { table, payload },
            })
          );
        }
      )
      .subscribe((status) => {
        console.log(`[RealtimeManager] ${table} reconnection status:`, status);

        if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          setTimeout(() => this.reconnectChannel(table), 2000);
        }
      });

    this.channels.set(table, channel);
  }

  private startKeepalive() {
    if (this.keepaliveInterval) {
      clearInterval(this.keepaliveInterval);
    }

    this.keepaliveInterval = setInterval(async () => {
      try {
        await supabase.from('leads').select('id').limit(1);
        console.log('[RealtimeManager] Keepalive ping sent');
      } catch (error) {
        console.error('[RealtimeManager] Keepalive ping failed:', error);
      }
    }, 270000);
  }

  private setupConnectionHandlers() {
    window.addEventListener('online', () => {
      console.log('[RealtimeManager] Browser online, checking connections...');
      this.checkAndReconnect();
    });

    window.addEventListener('offline', () => {
      console.log('[RealtimeManager] Browser offline');
    });

    supabase.auth.onAuthStateChange((event) => {
      console.log('[RealtimeManager] Auth state changed:', event);
      if (event === 'SIGNED_IN') {
        this.checkAndReconnect();
      } else if (event === 'SIGNED_OUT') {
        this.cleanup();
      }
    });
  }

  private checkAndReconnect() {
    this.channels.forEach((channel, table) => {
      const state = channel.state;
      if (state !== 'joined') {
        console.log(`[RealtimeManager] Reconnecting ${table}, current state: ${state}`);
        this.reconnectChannel(table);
      }
    });
  }

  cleanup() {
    console.log('[RealtimeManager] Cleaning up connections');

    if (this.keepaliveInterval) {
      clearInterval(this.keepaliveInterval);
      this.keepaliveInterval = null;
    }

    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });

    this.channels.clear();
    this.isInitialized = false;
  }
}

export const realtimeManager = new RealtimeManager();
