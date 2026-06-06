import { NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideBriefcaseBusiness,
  LucideLogIn,
  LucideRocket,
} from '@lucide/angular';

import {
  landingMetrics,
  navFeatures,
  productFeatures,
  trustFeatures,
  workflowSteps,
} from '../../../core/data/product-content';

@Component({
  selector: 'rp-landing-page',
  imports: [
    RouterLink,
    NgComponentOutlet,
    LucideArrowRight,
    LucideBriefcaseBusiness,
    LucideLogIn,
    LucideRocket,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  protected readonly landingMetrics = landingMetrics;
  protected readonly navFeatures = navFeatures;
  protected readonly productFeatures = productFeatures;
  protected readonly trustFeatures = trustFeatures;
  protected readonly workflowSteps = workflowSteps;
}
