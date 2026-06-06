import { Injectable, computed, signal } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly config = signal(environment.supabase);
  private readonly clientInstance = signal<SupabaseClient | null>(this.createClient());

  readonly isConfigured = computed(() => Boolean(this.config().url && this.config().anonKey));

  get client(): SupabaseClient {
    const client = this.clientInstance();

    if (!client) {
      throw new Error('Supabase ainda nao foi configurado.');
    }

    return client;
  }

  private createClient(): SupabaseClient | null {
    if (!environment.supabase.url || !environment.supabase.anonKey) {
      return null;
    }

    return createClient(environment.supabase.url, environment.supabase.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
}
