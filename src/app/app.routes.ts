import { Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { UrlKey } from './models/url';

export const routes: Routes = [
  {
    path: UrlKey.Login,
    loadComponent: () => import('@features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('@features/simple-home/simple-home').then((m) => m.SimpleHome),
  },

  {
    path: '',
    loadComponent: () => import('@core/layout/layout').then((m) => m.Layout),

    children: [
      {
        path: UrlKey.Exercises,
        loadComponent: () => import('@features/exercises/exercises').then((m) => m.Exercises),
      },
      {
        path: UrlKey.Home,
        loadComponent: () => import('@features/home/home').then((m) => m.Home),
        canActivate: [AuthGuard],
      },
      {
        path: UrlKey.Routines,
        loadComponent: () => import('@features/routines/routines').then((m) => m.Routines),
        canActivate: [AuthGuard],
      },
      {
        path: `${UrlKey.Workout}/:id`,
        loadComponent: () => import('@features/workout/workout').then((m) => m.Workout),
        canActivate: [AuthGuard],
      },
      {
        path: UrlKey.Profile,
        loadComponent: () => import('@features/profile/profile').then((m) => m.Profile),
        canActivate: [AuthGuard],
      },
      {
        path: UrlKey.Athletes,
        loadComponent: () => import('@features/athletes/athletes').then((m) => m.Athletes),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['trainer'] },
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
