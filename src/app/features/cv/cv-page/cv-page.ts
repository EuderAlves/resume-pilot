import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideFileText, LucideSave, LucideSparkles } from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { EducationService } from '../../education/data/education.service';
import { ProfessionalExperienceService } from '../../experiences/data/professional-experience.service';
import { JobOpportunity } from '../../jobs/data/job-opportunity.model';
import { JobOpportunityService } from '../../jobs/data/job-opportunity.service';
import { ProfessionalProfileService } from '../../profile/data/professional-profile.service';
import { ProfessionalSkillService } from '../../skills/data/professional-skill.service';
import { CvContent, CvVersion } from '../data/cv-version.model';
import { CvVersionService } from '../data/cv-version.service';
import { estimateAtsScore, generateCvContent } from '../data/cv-generator';

@Component({
  selector: 'rp-cv-page',
  imports: [ReactiveFormsModule, RouterLink, LucideArrowLeft, LucideFileText, LucideSave, LucideSparkles],
  templateUrl: './cv-page.html',
  styleUrl: './cv-page.scss',
})
export class CvPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfessionalProfileService);
  private readonly experienceService = inject(ProfessionalExperienceService);
  private readonly educationService = inject(EducationService);
  private readonly skillService = inject(ProfessionalSkillService);
  private readonly jobService = inject(JobOpportunityService);
  private readonly cvService = inject(CvVersionService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly jobs = signal<JobOpportunity[]>([]);
  protected readonly versions = signal<CvVersion[]>([]);
  protected readonly preview = signal<CvContent | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;

  protected readonly form = this.formBuilder.nonNullable.group({
    jobId: ['', [Validators.required]],
    language: ['pt-BR', [Validators.required]],
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  protected async generateCv(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();
    const job = this.jobs().find((item) => item.id === this.form.controls.jobId.value);

    if (!user || !job) {
      this.error.set('Selecione uma vaga para gerar o CV.');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    try {
      const [profile, experiences, education, skills] = await Promise.all([
        this.profileService.getCurrentProfile(),
        this.experienceService.listExperiences(),
        this.educationService.listEducation(),
        this.skillService.listSkills(),
      ]);
      const content = generateCvContent({ profile, experiences, education, skills, job });
      const atsScore = estimateAtsScore(content, job);
      const result = await this.cvService.saveVersion({
        userId: user.id,
        jobId: job.id ?? '',
        title: `CV | ${job.title}${job.company ? ` | ${job.company}` : ''}`,
        language: this.form.controls.language.value,
        content,
        storagePath: '',
        atsScore,
      });

      if (!result.ok) {
        this.error.set(result.message);
        return;
      }

      this.preview.set(result.version?.content ?? content);
      this.feedback.set(result.message);
      await this.loadVersions();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel gerar o CV.');
    } finally {
      this.isSaving.set(false);
    }
  }

  protected selectVersion(version: CvVersion): void {
    this.preview.set(version.content);
    this.form.patchValue({
      jobId: version.jobId,
      language: version.language,
    });
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);

    try {
      const [jobs, versions] = await Promise.all([
        this.jobService.listJobs(),
        this.cvService.listVersions(),
      ]);

      this.jobs.set(jobs);
      this.versions.set(versions);
      this.preview.set(versions[0]?.content ?? null);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar CVs.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadVersions(): Promise<void> {
    this.versions.set(await this.cvService.listVersions());
  }
}
