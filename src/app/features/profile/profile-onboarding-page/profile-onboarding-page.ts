import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideGlobe,
  LucideLanguages,
  LucideSave,
  LucideUserRound,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { ProfessionalProfileService } from '../data/professional-profile.service';
import { profileToFormValue, toProfilePayload } from '../data/profile-form.mapper';

@Component({
  selector: 'rp-profile-onboarding-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideCheck,
    LucideGlobe,
    LucideLanguages,
    LucideSave,
    LucideUserRound,
  ],
  templateUrl: './profile-onboarding-page.html',
  styleUrl: './profile-onboarding-page.scss',
})
export class ProfileOnboardingPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfessionalProfileService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly feedback = signal('');
  protected readonly error = signal('');
  protected readonly user = this.authService.currentUser;

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    headline: ['', [Validators.required, Validators.minLength(8)]],
    targetRole: ['', [Validators.required, Validators.minLength(2)]],
    targetSeniority: ['', [Validators.required]],
    targetCountriesInput: ['', [Validators.required]],
    location: [''],
    relocationGoal: [''],
    languagesInput: ['', [Validators.required]],
    summary: ['', [Validators.required, Validators.minLength(40)]],
  });

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  protected async saveProfile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para salvar seu perfil.');
      return;
    }

    this.isSaving.set(true);
    this.feedback.set('');
    this.error.set('');

    const result = await this.profileService.saveProfile(toProfilePayload(this.form.getRawValue(), user.id));

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
  }

  protected async saveAndGoToDashboard(): Promise<void> {
    await this.saveProfile();

    if (!this.error()) {
      await this.router.navigateByUrl('/app');
    }
  }

  private async loadProfile(): Promise<void> {
    this.isLoading.set(true);
    this.error.set('');

    try {
      const profile = await this.profileService.getCurrentProfile();
      this.form.patchValue(profileToFormValue(profile, this.user()?.email));
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar o perfil.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
