import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';

import { SupabaseService } from '../supabase/supabase.service';

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface SessionUser {
  readonly id: string;
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
  private readonly isRestoringSession = signal(true);
  private readonly sessionRestore = this.restoreSession();

  readonly currentUser = this.user.asReadonly();
  readonly isSessionReady = computed(() => !this.isRestoringSession());
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isSupabaseConfigured = this.supabase.isConfigured;

  constructor() {
    this.listenToAuthChanges();
  }

  async waitForSessionRestore(): Promise<void> {
    await this.sessionRestore;
  }

  async signInWithPassword(credentials: AuthCredentials): Promise<AuthResult> {
    if (!this.supabase.isConfigured()) {
      this.user.set({
        id: 'mock-user',
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

    this.user.set(this.toSessionUser(data.user));

    return {
      ok: true,
      mode: 'supabase',
      message: 'Login realizado com sucesso.',
    };
  }

  async signUpWithPassword(credentials: AuthCredentials): Promise<AuthResult> {
    if (!this.supabase.isConfigured()) {
      this.user.set({
        id: 'mock-user',
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

    this.user.set(this.toSessionUser(data.user));

    return {
      ok: true,
      mode: 'supabase',
      message: 'Conta criada com sucesso.',
    };
  }

  async signOut(): Promise<AuthResult> {
    if (!this.supabase.isConfigured()) {
      this.user.set(null);

      return {
        ok: true,
        mode: 'mock',
        message: 'Sessao mock encerrada.',
      };
    }

    const { error } = await this.supabase.client.auth.signOut();

    if (error) {
      return {
        ok: false,
        mode: 'supabase',
        message: error.message,
      };
    }

    this.user.set(null);

    return {
      ok: true,
      mode: 'supabase',
      message: 'Sessao encerrada com sucesso.',
    };
  }

  private async restoreSession(): Promise<void> {
    if (!this.supabase.isConfigured()) {
      this.isRestoringSession.set(false);
      return;
    }

    try {
      const { data, error } = await this.supabase.client.auth.getSession();

      if (!error) {
        this.user.set(this.toSessionUser(data.session?.user ?? null));
      }
    } finally {
      this.isRestoringSession.set(false);
    }
  }

  private listenToAuthChanges(): void {
    if (!this.supabase.isConfigured()) {
      return;
    }

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.user.set(this.toSessionUser(session?.user ?? null));
      this.isRestoringSession.set(false);
    });
  }

  private toSessionUser(user: User | null): SessionUser | null {
    if (!user?.email) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.['name'] ?? user.email.split('@')[0] ?? 'Usuario MVP',
    };
  }
}
