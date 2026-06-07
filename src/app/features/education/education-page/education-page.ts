import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideGraduationCap,
  LucidePenLine,
  LucidePlus,
  LucideSave,
  LucideTrash2,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { EducationFormValue, EducationRecord } from '../data/education.model';
import { EducationService } from '../data/education.service';
import { educationToFormValue, toEducationPayload } from '../data/education-form.mapper';

@Component({
  selector: 'rp-education-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideCheck,
    LucideGraduationCap,
    LucidePenLine,
    LucidePlus,
    LucideSave,
    LucideTrash2,
  ],
  templateUrl: './education-page.html',
  styleUrl: './education-page.scss',
})
export class EducationPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly educationService = inject(EducationService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly educationList = signal<EducationRecord[]>([]);
  protected readonly selectedEducationId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;
  protected readonly isEditing = computed(() => this.selectedEducationId() !== null);

  protected readonly form = this.formBuilder.nonNullable.group({
    course: ['', [Validators.required, Validators.minLength(2)]],
    institution: ['', [Validators.required, Validators.minLength(2)]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    description: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.loadEducation();
  }

  protected startNewEducation(): void {
    this.selectedEducationId.set(null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(educationToFormValue(null));
  }

  protected editEducation(education: EducationRecord): void {
    this.selectedEducationId.set(education.id ?? null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(educationToFormValue(education));
  }

  protected async saveEducation(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para salvar formacoes.');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const payload = toEducationPayload(
      this.form.getRawValue() as EducationFormValue,
      user.id,
      this.selectedEducationId() ?? undefined,
    );
    const result = await this.educationService.saveEducation(payload);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    await this.loadEducation(false);

    if (result.education) {
      this.editEducation(result.education);
    }
  }

  protected async deleteEducation(education: EducationRecord): Promise<void> {
    if (!education.id) {
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const result = await this.educationService.deleteEducation(education.id);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    this.startNewEducation();
    await this.loadEducation(false);
  }

  private async loadEducation(showLoader = true): Promise<void> {
    if (showLoader) {
      this.isLoading.set(true);
    }

    try {
      this.educationList.set(await this.educationService.listEducation());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar formacoes.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
