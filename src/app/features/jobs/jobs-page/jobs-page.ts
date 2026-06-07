import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCheck,
  LucidePenLine,
  LucidePlus,
  LucideSave,
  LucideTarget,
  LucideTrash2,
  LucideWandSparkles,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { analyzeJobDescription } from '../data/job-description-analyzer';
import { JobAnalysis, JobFormValue, JobOpportunity, JobOption } from '../data/job-opportunity.model';
import { JobOpportunityService } from '../data/job-opportunity.service';
import { jobToFormValue, toJobPayload } from '../data/job-form.mapper';

@Component({
  selector: 'rp-jobs-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideCheck,
    LucidePenLine,
    LucidePlus,
    LucideSave,
    LucideTarget,
    LucideTrash2,
    LucideWandSparkles,
  ],
  templateUrl: './jobs-page.html',
  styleUrl: './jobs-page.scss',
})
export class JobsPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly jobService = inject(JobOpportunityService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly jobs = signal<JobOpportunity[]>([]);
  protected readonly selectedJobId = signal<string | null>(null);
  protected readonly analysisPreview = signal<JobAnalysis | null>(null);
  protected readonly userSkillNames = signal<string[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;
  protected readonly isEditing = computed(() => this.selectedJobId() !== null);

  protected readonly seniorityOptions: readonly JobOption[] = [
    { value: '', label: 'Detectar pelo texto' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid-level', label: 'Pleno' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'staff', label: 'Staff' },
  ];

  protected readonly workModelOptions: readonly JobOption[] = [
    { value: '', label: 'Detectar pelo texto' },
    { value: 'remote', label: 'Remoto' },
    { value: 'hybrid', label: 'Hibrido' },
    { value: 'onsite', label: 'Presencial' },
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    company: [''],
    country: [''],
    location: [''],
    sourceUrl: [''],
    seniority: [''],
    workModel: [''],
    salary: [''],
    description: ['', [Validators.required, Validators.minLength(80)]],
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadJobs(), this.loadSkillNames()]);
  }

  protected startNewJob(): void {
    this.selectedJobId.set(null);
    this.feedback.set('');
    this.error.set('');
    this.analysisPreview.set(null);
    this.form.reset(jobToFormValue(null));
  }

  protected editJob(job: JobOpportunity): void {
    this.selectedJobId.set(job.id ?? null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(jobToFormValue(job));
    this.analysisPreview.set(job.analysis);
  }

  protected analyzeDescription(): void {
    const description = this.form.controls.description.value;

    if (description.trim().length < 20) {
      this.analysisPreview.set(null);
      return;
    }

    this.analysisPreview.set(analyzeJobDescription(description, this.userSkillNames()));
  }

  protected async saveJob(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.analyzeDescription();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para salvar vagas.');
      return;
    }

    const analysis = analyzeJobDescription(
      this.form.controls.description.value,
      this.userSkillNames(),
    );

    this.analysisPreview.set(analysis);
    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const payload = toJobPayload(
      this.form.getRawValue() as JobFormValue,
      user.id,
      analysis,
      this.selectedJobId() ?? undefined,
    );
    const result = await this.jobService.saveJob(payload);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    await this.loadJobs(false);

    if (result.job) {
      this.editJob(result.job);
    }
  }

  protected async deleteJob(job: JobOpportunity): Promise<void> {
    if (!job.id) {
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const result = await this.jobService.deleteJob(job.id);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    this.startNewJob();
    await this.loadJobs(false);
  }

  protected labelFor(options: readonly JobOption[], value: string): string {
    return options.find((option) => option.value === value)?.label ?? value;
  }

  private async loadJobs(showLoader = true): Promise<void> {
    if (showLoader) {
      this.isLoading.set(true);
    }

    try {
      this.jobs.set(await this.jobService.listJobs());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar vagas.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadSkillNames(): Promise<void> {
    try {
      this.userSkillNames.set(await this.jobService.listCurrentSkillNames());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar skills.');
    }
  }
}
