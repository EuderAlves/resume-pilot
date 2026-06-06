import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowRight, LucideLock, LucideMail, LucideShieldCheck } from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'rp-login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowRight,
    LucideLock,
    LucideMail,
    LucideShieldCheck,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mode = signal<'login' | 'signup'>('login');
  protected readonly isLoading = signal(false);
  protected readonly feedback = signal('');
  protected readonly isSupabaseConfigured = this.authService.isSupabaseConfigured;
  protected readonly actionLabel = computed(() =>
    this.mode() === 'login' ? 'Entrar no MVP' : 'Criar acesso MVP',
  );

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected setMode(mode: 'login' | 'signup'): void {
    this.mode.set(mode);
    this.feedback.set('');
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.feedback.set('');

    const credentials = this.form.getRawValue();
    const result =
      this.mode() === 'login'
        ? await this.authService.signInWithPassword(credentials)
        : await this.authService.signUpWithPassword(credentials);

    this.isLoading.set(false);

    if (!result.ok) {
      this.feedback.set(result.message);
      return;
    }

    await this.router.navigateByUrl('/app');
  }
}
