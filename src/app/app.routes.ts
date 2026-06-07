import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/marketing/landing-page/landing-page').then((m) => m.LandingPage),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'app/profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile-onboarding-page/profile-onboarding-page').then(
        (m) => m.ProfileOnboardingPage,
      ),
  },
  {
    path: 'app/experiences',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/experiences/experiences-page/experiences-page').then(
        (m) => m.ExperiencesPage,
      ),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
