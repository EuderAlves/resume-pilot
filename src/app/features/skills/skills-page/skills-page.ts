import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideBrainCircuit,
  LucideCheck,
  LucidePenLine,
  LucidePlus,
  LucideSave,
  LucideTrash2,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { ProfessionalSkill, SkillFormValue, SkillOption } from '../data/professional-skill.model';
import { ProfessionalSkillService } from '../data/professional-skill.service';
import { skillToFormValue, toSkillPayload } from '../data/skill-form.mapper';

@Component({
  selector: 'rp-skills-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideBrainCircuit,
    LucideCheck,
    LucidePenLine,
    LucidePlus,
    LucideSave,
    LucideTrash2,
  ],
  templateUrl: './skills-page.html',
  styleUrl: './skills-page.scss',
})
export class SkillsPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly skillService = inject(ProfessionalSkillService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly skills = signal<ProfessionalSkill[]>([]);
  protected readonly selectedSkillId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly user = this.authService.currentUser;
  protected readonly isEditing = computed(() => this.selectedSkillId() !== null);

  protected readonly categoryOptions: readonly SkillOption[] = [
    { value: 'technical', label: 'Tecnica' },
    { value: 'quality', label: 'Qualidade' },
    { value: 'engineering', label: 'Engenharia' },
    { value: 'product', label: 'Produto' },
    { value: 'cloud-devops', label: 'Cloud/DevOps' },
    { value: 'process', label: 'Processo' },
    { value: 'language', label: 'Idioma' },
    { value: 'soft-skill', label: 'Comportamental' },
  ];

  protected readonly levelOptions: readonly SkillOption[] = [
    { value: 'basic', label: 'Basico' },
    { value: 'intermediate', label: 'Intermediario' },
    { value: 'advanced', label: 'Avancado' },
    { value: 'native', label: 'Nativo' },
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['technical', [Validators.required]],
    level: ['intermediate', [Validators.required]],
    evidence: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.loadSkills();
  }

  protected startNewSkill(): void {
    this.selectedSkillId.set(null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(skillToFormValue(null));
  }

  protected editSkill(skill: ProfessionalSkill): void {
    this.selectedSkillId.set(skill.id ?? null);
    this.feedback.set('');
    this.error.set('');
    this.form.reset(skillToFormValue(skill));
  }

  protected async saveSkill(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();

    if (!user) {
      this.error.set('Sessao nao encontrada. Entre novamente para salvar skills.');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const payload = toSkillPayload(
      this.form.getRawValue() as SkillFormValue,
      user.id,
      this.selectedSkillId() ?? undefined,
    );
    const result = await this.skillService.saveSkill(payload);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    await this.loadSkills(false);

    if (result.skill) {
      this.editSkill(result.skill);
    }
  }

  protected async deleteSkill(skill: ProfessionalSkill): Promise<void> {
    if (!skill.id) {
      return;
    }

    this.isSaving.set(true);
    this.error.set('');
    this.feedback.set('');

    const result = await this.skillService.deleteSkill(skill.id);

    this.isSaving.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    this.feedback.set(result.message);
    this.startNewSkill();
    await this.loadSkills(false);
  }

  protected labelFor(options: readonly SkillOption[], value: string): string {
    return options.find((option) => option.value === value)?.label ?? value;
  }

  private async loadSkills(showLoader = true): Promise<void> {
    if (showLoader) {
      this.isLoading.set(true);
    }

    try {
      this.skills.set(await this.skillService.listSkills());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Nao foi possivel carregar skills.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
