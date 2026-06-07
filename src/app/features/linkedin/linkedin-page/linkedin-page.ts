import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideSave, LucideSparkles } from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { ProfessionalExperienceService } from '../../experiences/data/professional-experience.service';
import { ProfessionalProfileService } from '../../profile/data/professional-profile.service';
import { ProfessionalSkillService } from '../../skills/data/professional-skill.service';
import { analyzeLinkedinProfile } from '../data/linkedin-audit-analyzer';
import { LinkedinAudit } from '../data/linkedin-audit.model';
import { LinkedinAuditService } from '../data/linkedin-audit.service';

@Component({
  selector: 'rp-linkedin-page',
  imports: [ReactiveFormsModule, RouterLink, LucideArrowLeft, LucideSave, LucideSparkles],
  templateUrl: './linkedin-page.html',
  styleUrl: './linkedin-page.scss',
})
export class LinkedinPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfessionalProfileService);
  private readonly experienceService = inject(ProfessionalExperienceService);
  private readonly skillService = inject(ProfessionalSkillService);
  private readonly auditService = inject(LinkedinAuditService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly audits = signal<LinkedinAudit[]>([]);
  protected readonly currentAudit = signal<LinkedinAudit | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;
  private readonly targetRole = signal('');
  private readonly targetCountries = signal<string[]>([]);
  private readonly experienceCount = signal(0);
  private readonly skillNames = signal<string[]>([]);

  protected readonly form = this.formBuilder.nonNullable.group({
    profileUrl: [''],
    headline: ['', [Validators.required, Validators.minLength(20)]],
    about: ['', [Validators.required, Validators.minLength(120)]],
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  protected async auditLinkedin(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para auditar LinkedIn.');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const audit = analyzeLinkedinProfile(
      {
        profileUrl: this.form.controls.profileUrl.value,
        headline: this.form.controls.headline.value,
        about: this.form.controls.about.value,
        experienceCount: this.experienceCount(),
        skillCount: this.skillNames().length,
        targetRole: this.targetRole(),
        targetCountries: this.targetCountries(),
        topSkills: this.skillNames(),
      },
      user.id,
    );
    const result = await this.auditService.saveAudit(audit);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.currentAudit.set(result.audit ?? audit);
    this.feedback.set(result.message);
    await this.loadAudits();
  }

  protected selectAudit(audit: LinkedinAudit): void {
    this.currentAudit.set(audit);
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);

    try {
      const [profile, experiences, skills, audits] = await Promise.all([
        this.profileService.getCurrentProfile(),
        this.experienceService.listExperiences(),
        this.skillService.listSkills(),
        this.auditService.listAudits(),
      ]);

      this.targetRole.set(profile?.targetRole ?? '');
      this.targetCountries.set(profile?.targetCountries ?? []);
      this.experienceCount.set(experiences.length);
      this.skillNames.set(skills.map((skill) => skill.name));
      this.audits.set(audits);
      this.currentAudit.set(audits[0] ?? null);
      this.form.patchValue({
        headline: profile?.headline ?? '',
        about: profile?.summary ?? '',
      });
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar auditoria.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadAudits(): Promise<void> {
    this.audits.set(await this.auditService.listAudits());
  }
}
