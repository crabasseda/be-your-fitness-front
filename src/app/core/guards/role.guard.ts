import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as string[];

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
