import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { UrlKey } from './models/url';

export const routes: Routes = [
  {
    path: UrlKey.Login,
    loadComponent: () => import('@auth/login/login').then((m) => m.Login),
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
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
