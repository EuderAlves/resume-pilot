import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideBriefcaseBusiness,
  LucideCheck,
  LucidePenLine,
  LucidePlus,
  LucideSave,
  LucideTrash2,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import {
  ProfessionalExperience,
  ProfessionalExperienceFormValue,
} from '../data/professional-experience.model';
import { ProfessionalExperienceService } from '../data/professional-experience.service';
import { experienceToFormValue, toExperiencePayload } from '../data/experience-form.mapper';

@Component({
  selector: 'rp-experiences-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideBriefcaseBusiness,
    LucideCheck,
    LucidePenLine,
    LucidePlus,
    LucideSave,
    LucideTrash2,
  ],
  templateUrl: './experiences-page.html',
  styleUrl: './experiences-page.scss',
})
export class ExperiencesPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly experienceService = inject(ProfessionalExperienceService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly experiences = signal<ProfessionalExperience[]>([]);
  protected readonly selectedExperienceId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;
  protected readonly isEditing = computed(() => this.selectedExperienceId() !== null);

  protected readonly form = this.formBuilder.nonNullable.group({
    company: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required, Validators.minLength(2)]],
    location: [''],
    startDate: ['', [Validators.required]],
    endDate: [''],
    isCurrent: [false],
    activitiesInput: ['', [Validators.required]],
    toolsInput: ['', [Validators.required]],
    achievementsInput: [''],
    generatedBulletsInput: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.loadExperiences();
  }

  protected startNewExperience(): void {
    this.selectedExperienceId.set(null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(experienceToFormValue(null));
  }

  protected editExperience(experience: ProfessionalExperience): void {
    this.selectedExperienceId.set(experience.id ?? null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(experienceToFormValue(experience));
  }

  protected async saveExperience(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para salvar experiencias.');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const payload = toExperiencePayload(
      this.form.getRawValue() as ProfessionalExperienceFormValue,
      user.id,
      this.selectedExperienceId() ?? undefined,
    );
    const result = await this.experienceService.saveExperience(payload);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    await this.loadExperiences(false);

    if (result.experience) {
      this.editExperience(result.experience);
    }
  }

  protected async deleteExperience(experience: ProfessionalExperience): Promise<void> {
    if (!experience.id) {
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const result = await this.experienceService.deleteExperience(experience.id);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    this.startNewExperience();
    await this.loadExperiences(false);
  }

  private async loadExperiences(showLoader = true): Promise<void> {
    if (showLoader) {
      this.isLoading.set(true);
    }

    try {
      this.experiences.set(await this.experienceService.listExperiences());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar experiencias.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
