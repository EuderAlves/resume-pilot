import { Injectable, computed, inject, signal } from '@angular/core';

import { SupabaseService } from '../supabase/supabase.service';

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface SessionUser {
  readonly email: string;
  readonly name: string;
}

export interface AuthResult {
  readonly ok: boolean;
  readonly mode: 'mock' | 'supabase';
  readonly message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly user = signal<SessionUser | null>(null);

  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isSupabaseConfigured = this.supabase.isConfigured;

  async signInWithPassword(credentials: AuthCredentials): Promise<AuthResult> {
    if (!this.supabase.isConfigured()) {
      this.user.set({
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'Usuario MVP',
      });

      return {
        ok: true,
        mode: 'mock',
        message: 'Login simulado enquanto o Supabase nao esta configurado.',
      };
    }

    const { data, error } = await this.supabase.client.auth.signInWithPassword(credentials);

    if (error || !data.user?.email) {
      return {
        ok: false,
        mode: 'supabase',
        message: error?.message ?? 'Nao foi possivel entrar.',
      };
    }

    this.user.set({
      email: data.user.email,
      name: data.user.user_metadata?.['name'] ?? data.user.email.split('@')[0],
    });

    return {
      ok: true,
      mode: 'supabase',
      message: 'Login realizado com sucesso.',
    };
  }

  async signUpWithPassword(credentials: AuthCredentials): Promise<AuthResult> {
    if (!this.supabase.isConfigured()) {
      this.user.set({
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'Usuario MVP',
      });

      return {
        ok: true,
        mode: 'mock',
        message: 'Cadastro simulado enquanto o Supabase nao esta configurado.',
      };
    }

    const { data, error } = await this.supabase.client.auth.signUp(credentials);

    if (error || !data.user?.email) {
      return {
        ok: false,
        mode: 'supabase',
        message: error?.message ?? 'Nao foi possivel criar a conta.',
      };
    }

    this.user.set({
      email: data.user.email,
      name: data.user.email.split('@')[0],
    });

    return {
      ok: true,
      mode: 'supabase',
      message: 'Conta criada com sucesso.',
    };
  }
}
