export type Role = 'ATHLETE' | 'TRAINER' | 'GUEST';

export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: Role;
  trainer_id: string;
}
