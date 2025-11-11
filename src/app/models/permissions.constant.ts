import { Role } from './user.interface';

export type Permission = 'SIMPLE' | 'AHTLETE' | 'MANAGE_ATHLETES';

export const rolePermissions: Record<Role, Permission[]> = {
  GUEST: ['SIMPLE'],
  ATHLETE: ['AHTLETE'],
  TRAINER: ['MANAGE_ATHLETES'],
};
