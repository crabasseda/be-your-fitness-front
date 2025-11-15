import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { UrlKey } from './models/url';

export const routes: Routes = [
  {
    path: '',
    redirectTo: UrlKey.Login,
    pathMatch: 'full',
  },
  {
    path: UrlKey.Login,
    loadComponent: () => import('@auth/login/login').then((m) => m.Login),
  },

  {
    path: '',
    loadComponent: () => import('@core/layout/layout').then((m) => m.Layout),
    canActivate: [AuthGuard],
    children: [
      {
        path: UrlKey.Home,
        loadComponent: () => import('@features/home/home').then((m) => m.Home),
      },
      {
        path: UrlKey.Exercises,
        loadComponent: () => import('@features/exercises/exercises').then((m) => m.Exercises),
      },
      {
        path: UrlKey.Routines,
        loadComponent: () => import('@features/routines/routines').then((m) => m.Routines),
      },
      {
        path: `${UrlKey.Workout}/:id`,
        loadComponent: () => import('@features/workout/workout').then((m) => m.Workout),
      },
    ],
  },

  {
    path: '**',
    redirectTo: UrlKey.Login,
  },
];
