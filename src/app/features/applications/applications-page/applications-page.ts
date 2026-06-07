import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideClipboardCheck,
  LucidePenLine,
  LucidePlus,
  LucideSave,
  LucideTrash2,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { JobOpportunity } from '../../jobs/data/job-opportunity.model';
import { JobOpportunityService } from '../../jobs/data/job-opportunity.service';
import {
  ApplicationFormValue,
  ApplicationRecord,
  ApplicationStatus,
  ApplicationStatusOption,
} from '../data/application.model';
import { ApplicationService } from '../data/application.service';
import { applicationToFormValue, toApplicationPayload } from '../data/application-form.mapper';

@Component({
  selector: 'rp-applications-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideCheck,
    LucideClipboardCheck,
    LucidePenLine,
    LucidePlus,
    LucideSave,
    LucideTrash2,
  ],
  templateUrl: './applications-page.html',
  styleUrl: './applications-page.scss',
})
export class ApplicationsPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly applicationService = inject(ApplicationService);
  private readonly jobService = inject(JobOpportunityService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly applications = signal<ApplicationRecord[]>([]);
  protected readonly jobs = signal<JobOpportunity[]>([]);
  protected readonly selectedApplicationId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;
  protected readonly isEditing = computed(() => this.selectedApplicationId() !== null);

  protected readonly statusOptions: readonly ApplicationStatusOption[] = [
    { value: 'saved', label: 'Salva', tone: 'neutral' },
    { value: 'cv_tailored', label: 'CV ajustado', tone: 'warning' },
    { value: 'applied', label: 'Aplicada', tone: 'success' },
    { value: 'follow_up_sent', label: 'Follow-up', tone: 'success' },
    { value: 'interview', label: 'Entrevista', tone: 'success' },
    { value: 'technical_test', label: 'Teste tecnico', tone: 'warning' },
    { value: 'offer', label: 'Oferta', tone: 'success' },
    { value: 'rejected', label: 'Negada', tone: 'danger' },
    { value: 'archived', label: 'Arquivada', tone: 'neutral' },
  ];

  protected readonly pipelineColumns = computed(() =>
    this.statusOptions.map((status) => ({
      ...status,
      applications: this.applications().filter((application) => application.status === status.value),
    })),
  );

  protected readonly form = this.formBuilder.nonNullable.group({
    jobId: ['', [Validators.required]],
    appliedAt: [''],
    status: ['saved' as ApplicationStatus, [Validators.required]],
    followUpAt: [''],
    notes: [''],
    contactName: [''],
    contactUrl: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  protected startNewApplication(): void {
    this.selectedApplicationId.set(null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(applicationToFormValue(null));
  }

  protected editApplication(application: ApplicationRecord): void {
    this.selectedApplicationId.set(application.id ?? null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(applicationToFormValue(application));
  }

  protected async saveApplication(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para salvar candidaturas.');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const payload = toApplicationPayload(
      this.form.getRawValue() as ApplicationFormValue,
      user.id,
      this.selectedApplicationId() ?? undefined,
    );
    const result = await this.applicationService.saveApplication(payload);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    await this.loadData(false);

    if (result.application) {
      this.editApplication(result.application);
    }
  }

  protected async deleteApplication(application: ApplicationRecord): Promise<void> {
    if (!application.id) {
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const result = await this.applicationService.deleteApplication(application.id);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    this.startNewApplication();
    await this.loadData(false);
  }

  protected jobTitle(jobId: string): string {
    const job = this.jobs().find((item) => item.id === jobId);

    return job ? `${job.title}${job.company ? ` | ${job.company}` : ''}` : 'Vaga nao informada';
  }

  private async loadData(showLoader = true): Promise<void> {
    if (showLoader) {
      this.isLoading.set(true);
    }

    try {
      const [applications, jobs] = await Promise.all([
        this.applicationService.listApplications(),
        this.jobService.listJobs(),
      ]);

      this.applications.set(applications);
      this.jobs.set(jobs);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar pipeline.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
